# 🛁 БаняБочка - Сайт для компании по производству бань-бочек

Современный одностраничный сайт с функциональными вкладками, калькулятором стоимости и интеграцией с Telegram.

## 📁 Структура проекта

```
granyuta/
├── index.html          # Главная страница
├── styles.css          # Стили CSS
├── script.js           # JavaScript функциональность
└── README.md           # Документация
```

## ✨ Возможности

### 🏠 Вкладки сайта
- **Главная** - приветственная страница с преимуществами
- **О нас** - информация о компании, статистика, команда
- **Наши работы** - портфолио с фильтрацией по категориям
- **Калькулятор** - расчет стоимости бани с формой заявки

### 🧮 Калькулятор стоимости
- Выбор размера бани (2×4м, 2×5м, 2×6м, 2.5×6м)
- Выбор материала (кедр, липа, осина)
- Выбор печи (электрическая, дровяная, премиум)
- Дополнительные опции (освещение, вентиляция, доставка, фундамент)
- Автоматический расчет стоимости

### 📱 Социальные сети
- Telegram
- VKontakte
- Instagram
- YouTube

### 📧 Интеграция с Telegram
- Автоматическая отправка заявок в Telegram
- Настраиваемый бот и чат
- Подробная информация о заявке

## 🚀 Установка и настройка

### 1. Базовая настройка
1. Скачайте все файлы в одну папку
2. Откройте `index.html` в браузере
3. Сайт готов к использованию!

### 2. Настройка Telegram бота (опционально)

#### Создание бота:
1. Найдите @BotFather в Telegram
2. Отправьте команду `/newbot`
3. Следуйте инструкциям для создания бота
4. Сохраните полученный токен

#### Получение Chat ID:
1. Добавьте бота в нужный чат/канал
2. Отправьте сообщение в чат
3. Перейдите по ссылке: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
4. Найдите `chat_id` в ответе

#### Настройка в коде:
Откройте `script.js` и измените настройки:

```javascript
const TELEGRAM_CONFIG = {
    BOT_TOKEN: '1234567890:ABCdefGHIjklMNOpqrsTUVwxyz', // Ваш токен
    CHAT_ID: '123456789',                                // ID чата
    ENABLED: true                                        // Включить отправку
};
```

### 3. Настройка контента

#### Изменение контактной информации:
Отредактируйте в `index.html`:
- Телефон: `+7 (999) 123-45-67`
- Email: `info@banyabochka.ru`
- Ссылки на соцсети

#### Изменение цен в калькуляторе:
Отредактируйте в `script.js` секцию `CONFIG`:
```javascript
const CONFIG = {
    sizes: {
        '200000': { name: '2м × 4м', price: 200000 },
        // Добавьте свои размеры и цены
    },
    // ... остальные настройки
};
```

#### Изменение работ в портфолио:
Отредактируйте в `index.html` секцию `.works-grid`:
```html
<div class="work-card" data-category="small">
    <div class="work-image">
        <img src="путь_к_изображению.jpg" alt="Описание">
    </div>
    <div class="work-info">
        <h3>Название проекта</h3>
        <p>Размер: 2м × 4м</p>
        <!-- Добавьте свои данные -->
    </div>
</div>
```

## 🎨 Кастомизация

### Цветовая схема
Измените переменные CSS в `styles.css`:
```css
:root {
    --primary-dark: #2c1810;    /* Темно-коричневый */
    --primary-brown: #5d4037;   /* Коричневый */
    --accent-orange: #ff6b35;   /* Оранжевый */
    --accent-gold: #ffc107;     /* Золотой */
    /* ... остальные цвета */
}
```

### Шрифты
Сайт использует Google Fonts:
- Russo One (заголовки)
- Open Sans (основной текст)
- Caveat (декоративный текст)

### Изображения
Замените SVG-заглушки на реальные фотографии:
1. Добавьте изображения в папку проекта
2. Замените `src` в тегах `<img>`
3. Рекомендуемый размер: 400×300px

## 📱 Адаптивность

Сайт полностью адаптивен и корректно отображается на:
- 🖥️ Десктопах (1200px+)
- 💻 Планшетах (768px-1199px)
- 📱 Мобильных устройствах (до 767px)

## 🔧 Технические особенности

### JavaScript функциональность:
- Переключение вкладок без перезагрузки
- Живой расчет стоимости
- Фильтрация портфолио
- Валидация форм
- Анимации при скролле
- Интеграция с Telegram API

### CSS особенности:
- CSS Grid и Flexbox
- CSS переменные
- Плавные анимации
- Градиенты и тени
- Hover-эффекты

## 📞 Поддержка

При возникновении вопросов:
1. Проверьте консоль браузера (F12) на наличие ошибок
2. Убедитесь, что все файлы находятся в одной папке
3. Проверьте настройки Telegram бота

## 📄 Лицензия

Свободное использование для коммерческих и некоммерческих проектов.

---

**Создано для компании "БаняБочка"** 🛁
*Финские бани-бочки под ключ*

## 🚀 Как сделать безопасный бэкенд для заявок (Node.js + Express)

### 1. Структура проекта

```
/project-root
  |-- .env
  |-- server.js
  |-- package.json
  |-- (твой фронт: index.html, script.js и т.д.)
```

### 2. package.json

```json
{
  "name": "banya-backend",
  "version": "1.0.0",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "node-fetch": "^3.3.2"
  }
}
```

### 3. .env (НЕ коммить в git!)

```
TELEGRAM_BOT_TOKEN=твой_токен_бота
TELEGRAM_CHAT_ID=твой_чат_id
PORT=3000
```

### 4. server.js

```js
import 'dotenv/config';
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors()); // если фронт на другом домене

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

app.post('/api/feedback', async (req, res) => {
    const { name, phone, email, message, price, size, extras } = req.body;

    const text = `\n🔥 НОВАЯ ЗАЯВКА С САЙТА!\n\n👤 Клиент: ${name}\n📞 Телефон: ${phone}\n📧 Email: ${email || 'Не указан'}\n\n📊 РАСЧЕТ:\n💰 Итоговая стоимость: ${price}\n📏 Размер: ${size}\n⚡ Опции: ${extras}\n\n💬 Комментарий: ${message || 'Нет комментария'}\n\n⏰ Дата: ${new Date().toLocaleString('ru-RU')}`;

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text,
                parse_mode: 'HTML'
            })
        });
        if (!response.ok) throw new Error('Ошибка Telegram API');
        res.json({ ok: true });
    } catch (e) {
        res.status(500).json({ ok: false, error: e.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
```

### 5. Как отправлять с фронта

```js
fetch('https://ТВОЙ-БЭКЕНД.onrender.com/api/feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        name: 'Имя',
        phone: 'Телефон',
        email: 'Почта',
        message: 'Комментарий',
        price: '380 000 ₽',
        size: '2×4м',
        extras: 'LED-освещение'
    })
})
.then(res => res.json())
.then(data => {
    if (data.ok) alert('Заявка отправлена!');
    else alert('Ошибка отправки!');
});
```

### 6. Как хостить на Render.com

1. Зарегистрируйся на [render.com](https://render.com/)
2. Создай новый Web Service → выбери свой репозиторий (или залей архивом)
3. В настройках добавь переменные окружения (Environment → Add Environment Variable):
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`
   - `PORT` (можно не указывать, Render сам подставит)
4. Команда запуска:  
   ```
   npm install && npm start
   ```
5. После деплоя получишь ссылку типа `https://your-app.onrender.com`
6. На фронте используй этот адрес для отправки заявок

---

**Если что-то не понятно — просто скопируй этот блок в отдельный файл и следуй шагам!** 

# Структура проекта

- public/ — фронтенд (index.html, styles.css, script.js, images, icons)
- bot/ — Telegram-бот
- routes/ — роуты API
- controllers/ — логика обработки запросов
- services/ — бизнес-логика (например, калькулятор)
- config/ — конфиги и переменные окружения 