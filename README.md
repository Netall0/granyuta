# ГрАнь Уюта - Бани-бочки из сибирского кедра

Сайт компании ГрАнь Уюта - производитель качественных бань-бочек из сибирского кедра в Новосибирске.

## 🚀 Быстрый старт

### Требования
- Node.js 18+
- npm или yarn
- PM2 (для продакшена)

### Установка

1. **Клонируйте репозиторий**
```bash
git clone <repository-url>
cd granyuta
```

2. **Установите зависимости**
```bash
npm install
```

3. **Настройте переменные окружения**
```bash
cp config/env.example config/.env
# Отредактируйте config/.env и заполните необходимые переменные
```

4. **Запустите в режиме разработки**
```bash
npm run dev
```

## 🏭 Продакшен деплой

### Вариант 1: PM2 (рекомендуется)

1. **Установите PM2 глобально**
```bash
npm install -g pm2
```

2. **Запустите деплой**
```bash
chmod +x deploy.sh
./deploy.sh
```

### Вариант 2: Docker

1. **Соберите и запустите контейнеры**
```bash
docker-compose up -d
```

### Вариант 3: Ручной запуск

1. **Установите зависимости**
```bash
npm ci --only=production
```

2. **Запустите приложение**
```bash
NODE_ENV=production npm start
```

## 🔧 Конфигурация

### Переменные окружения

Создайте файл `config/.env` на основе `config/env.example`:

```env
# Telegram Bot
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here

# Server
PORT=3000
NODE_ENV=production

# Security
SESSION_SECRET=your_session_secret_here
CORS_ORIGIN=https://yourdomain.com

# Database
DB_PATH=./db/baths.db

# Logging
LOG_LEVEL=info
```

### SSL сертификаты

Для HTTPS создайте директорию `ssl/` и поместите туда:
- `cert.pem` - SSL сертификат
- `key.pem` - приватный ключ

## 📊 Мониторинг

### PM2 команды
```bash
pm2 status          # Статус процессов
pm2 monit           # Мониторинг в реальном времени
pm2 logs granyuta   # Просмотр логов
pm2 restart granyuta # Перезапуск
```

### Health Check
```bash
curl http://localhost:3000/api/health
```

## 🔒 Безопасность

Проект включает следующие меры безопасности:

- **Helmet.js** - защита заголовков HTTP
- **Rate Limiting** - защита от DDoS
- **CORS** - настройки CORS
- **Input Validation** - валидация входных данных
- **SQL Injection Protection** - защита от SQL инъекций

## 📁 Структура проекта

```
granyuta/
├── config/           # Конфигурационные файлы
├── db/              # База данных и модели
├── public/          # Статические файлы
├── logs/            # Логи (создается автоматически)
├── server.js        # Основной сервер
├── package.json     # Зависимости
├── Dockerfile       # Docker конфигурация
├── docker-compose.yml # Docker Compose
├── nginx.conf       # Nginx конфигурация
├── ecosystem.config.js # PM2 конфигурация
└── deploy.sh        # Скрипт деплоя
```

## 🛠️ Разработка

### Доступные скрипты

```bash
npm start           # Запуск в продакшене
npm run dev         # Запуск в режиме разработки
npm run build       # Сборка (не требуется)
npm run lint        # Проверка кода
npm run security-check # Проверка безопасности
```

### API Endpoints

- `GET /api/catalog` - Каталог бань
- `GET /api/calculator-config` - Конфигурация калькулятора
- `POST /api/feedback` - Отправка заявки
- `GET /api/health` - Проверка здоровья

## 📈 Производительность

### Оптимизации

- **Сжатие** - gzip для всех ответов
- **Кеширование** - кеш каталога на 5 минут
- **Статические файлы** - кеширование на 1 день
- **Rate Limiting** - защита от перегрузки

### Мониторинг

- Логирование всех запросов
- Health check endpoint
- PM2 мониторинг процессов

## 🐛 Устранение неполадок

### Частые проблемы

1. **Ошибка подключения к БД**
   - Проверьте путь к файлу БД
   - Убедитесь в правах доступа

2. **Telegram не отправляет сообщения**
   - Проверьте токен бота
   - Проверьте chat_id
   - Убедитесь в правах бота

3. **Ошибки PM2**
   - Проверьте логи: `pm2 logs granyuta`
   - Перезапустите: `pm2 restart granyuta`

## 📞 Поддержка

Для получения поддержки обращайтесь:
- Телефон: +7-913-770-56-56
- Telegram: @GranUyta
- VK: vk.com/club230435323

## 📄 Лицензия

ISC License 