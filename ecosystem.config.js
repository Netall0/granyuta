module.exports = {
  apps: [{
    name: 'granyuta',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    // Автоматический перезапуск
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    
    // Логирование
    log_file: './logs/combined.log',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    
    // Мониторинг
    min_uptime: '10s',
    max_restarts: 10,
    
    // Переменные окружения
    env_file: './config/.env'
  }]
}; 