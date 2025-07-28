#!/bin/bash

# Скрипт деплоя для продакшена
set -e

echo "🚀 Начинаем деплой ГрАнь Уюта..."

# Проверяем наличие .env файла
if [ ! -f "./config/.env" ]; then
    echo "❌ Файл config/.env не найден!"
    echo "Скопируйте config/env.example в config/.env и заполните переменные"
    exit 1
fi

# Останавливаем предыдущие процессы
echo "📦 Останавливаем предыдущие процессы..."
pm2 stop granyuta 2>/dev/null || true
pm2 delete granyuta 2>/dev/null || true

# Устанавливаем зависимости
echo "📦 Устанавливаем зависимости..."
npm ci --only=production

# Создаем директории для логов
echo "📁 Создаем директории для логов..."
mkdir -p logs

# Проверяем безопасность
echo "🔒 Проверяем безопасность..."
npm audit --audit-level=moderate || echo "⚠️  Обнаружены уязвимости, но продолжаем деплой"

# Запускаем приложение
echo "🚀 Запускаем приложение..."
pm2 start ecosystem.config.js --env production

# Сохраняем конфигурацию PM2
echo "💾 Сохраняем конфигурацию PM2..."
pm2 save

# Проверяем статус
echo "✅ Проверяем статус..."
pm2 status

echo "🎉 Деплой завершен успешно!"
echo "📊 Мониторинг: pm2 monit"
echo "📋 Логи: pm2 logs granyuta" 