import dotenv from 'dotenv';
dotenv.config({ path: './config/.env' });
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Безопасность
app.use(helmet({
    contentSecurityPolicy: {
        useDefaults: false,
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'", 
                "'unsafe-inline'",
                "https://api-maps.yandex.ru",
                "https://yandex.st",
                "https://*.yandex.ru",
                "https://*.yandex.net"
            ],
            scriptSrcAttr: ["'self'", "'unsafe-inline'"],
            styleSrc: [
                "'self'", 
                "'unsafe-inline'", 
                "https://fonts.googleapis.com",
                "https://yandex.st",
                "https://*.yandex.ru"
            ],
            fontSrc: [
                "'self'", 
                "https://fonts.gstatic.com",
                "https://yandex.st"
            ],
            imgSrc: [
                "'self'", 
                "data:", 
                "https:",
                "https://*.yandex.ru",
                "https://*.yandex.net",
                "https://core-renderer-tiles.maps.yandex.net"
            ],
            connectSrc: [
                "'self'",
                "https://api-maps.yandex.ru",
                "https://*.yandex.ru",
                "https://*.yandex.net"
            ],
            frameSrc: [
                "'self'", 
                "https://yandex.ru", 
                "https://*.yandex.ru"
            ],
            workerSrc: ["'self'", "blob:"]
        },
    },
}));

// Rate limiting для защиты от DDoS
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 100, // максимум 100 запросов с одного IP
    message: 'Слишком много запросов с этого IP, попробуйте позже.'
});
app.use('/api/', limiter);

// Сжатие ответов
app.use(compression());

// CORS настройки
const corsOptions = {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: '1d',
    etag: true
}));

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Логирование
const log = (level, message, data = {}) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`, data);
};

log('info', 'Запуск сервера', { 
    nodeEnv: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000
});

if (!TELEGRAM_BOT_TOKEN) {
    log('error', 'TELEGRAM_BOT_TOKEN не задан в переменных окружения!');
    process.exit(1);
}
if (!TELEGRAM_CHAT_ID) {
    log('error', 'TELEGRAM_CHAT_ID не задан в переменных окружения!');
    process.exit(1);
}

// Middleware для логирования запросов
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        log('info', `${req.method} ${req.path}`, {
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip
        });
    });
    next();
});

app.post('/api/feedback', async (req, res) => {
    try {
        const { name, phone, email, message, price, size, extras } = req.body;
        
        // Валидация данных
        if (!name || !phone) {
            return res.status(400).json({ error: 'Имя и телефон обязательны' });
        }
        
        const text = `\n🔥 НОВАЯ ЗАЯВКА С САЙТА!\n\n👤 Клиент: ${name}\n📞 Телефон: ${phone}\n📧 Email: ${email || 'Не указан'}\n\n📊 РАСЧЕТ:\n💰 Итоговая стоимость: ${price}\n📏 Размер: ${size}\n⚡ Опции: ${extras}\n\n💬 Комментарий: ${message || 'Нет комментария'}\n\n⏰ Дата: ${new Date().toLocaleString('ru-RU')}`;
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text,
                parse_mode: 'HTML'
            })
        });
        
        const result = await response.json();
        if (!response.ok || !result.ok) {
            log('error', 'Ошибка Telegram API', result);
            return res.status(500).json({ ok: false, error: result.description || 'Ошибка Telegram API' });
        }
        
        log('info', 'Заявка успешно отправлена в Telegram', { name, phone });
        res.json({ ok: true });
    } catch (e) {
        log('error', 'Ошибка при отправке в Telegram', { error: e.message });
        res.status(500).json({ ok: false, error: e.message });
    }
});

// API: Каталог бань из БД с кешированием
let catalogCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 минут

app.get('/api/catalog', (req, res) => {
    // Проверяем кеш
    if (catalogCache && cacheTimestamp && (Date.now() - cacheTimestamp) < CACHE_DURATION) {
        return res.json(catalogCache);
    }
    
    const dbPath = path.resolve(__dirname, 'db', 'baths.db');
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
        if (err) {
            log('error', 'Ошибка подключения к БД', { error: err.message });
            return res.status(500).json({ error: 'Ошибка подключения к БД' });
        }
        
        db.all('SELECT * FROM bathhouses ORDER BY price ASC', (err, rows) => {
            if (err) {
                log('error', 'Ошибка запроса к БД', { error: err.message });
                db.close();
                return res.status(500).json({ error: 'Ошибка запроса к БД' });
            }
            
            // Преобразуем JSON поля обратно в объекты
            const processedRows = rows.map(row => {
                let images = [];
                try {
                    // Парсим поле image как JSON-массив
                    if (row.image) {
                        images = JSON.parse(row.image);
                    }
                } catch (e) {
                    // Если не удалось распарсить как JSON, используем как одно изображение
                    images = row.image ? [row.image] : [];
                }
                
                return {
                    ...row,
                    images: images, // Добавляем поле images
                    specs: row.specs ? JSON.parse(row.specs) : [],
                    features: row.features ? JSON.parse(row.features) : []
                };
            });
            
            // Обновляем кеш
            catalogCache = processedRows;
            cacheTimestamp = Date.now();
            
            res.json(processedRows);
            db.close();
        });
    });
});

// API: Конфиг калькулятора
app.get('/api/calculator-config', (req, res) => {
    res.json({
        sizes: {
            '200000': { name: '2м × 4м', price: 200000 },
            '250000': { name: '2м × 5м', price: 250000 },
            '300000': { name: '2м × 6м', price: 300000 },
            '350000': { name: '2.5м × 6м', price: 350000 }
        },
        materials: {
            '1': { name: 'Кедр сибирский', multiplier: 1 },
            '1.3': { name: 'Кедр канадский', multiplier: 1.3 },
            '0.8': { name: 'Липа', multiplier: 0.8 },
            '0.9': { name: 'Осина', multiplier: 0.9 }
        },
        stoves: {
            '0': { name: 'Без печи', price: 0 },
            '50000': { name: 'Электрическая печь', price: 50000 },
            '80000': { name: 'Дровяная печь', price: 80000 },
            '120000': { name: 'Премиум дровяная', price: 120000 }
        },
        extras: {
            delivery: { name: 'Доставка и установка (по договорённости)', price: 0}
        }
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Обработка 404 для API
app.use('/api/*', (req, res) => {
    res.status(404).json({ error: 'API endpoint не найден' });
});

// Обработка ошибок
app.use((err, req, res, next) => {
    log('error', 'Ошибка сервера', { error: err.message, stack: err.stack });
    res.status(500).json({ 
        error: process.env.NODE_ENV === 'production' ? 'Внутренняя ошибка сервера' : err.message 
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    log('info', `Сервер запущен на порту ${PORT}`);
});