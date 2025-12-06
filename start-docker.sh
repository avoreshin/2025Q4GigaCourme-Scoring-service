#!/bin/bash

# Скрипт для локального запуска проекта через Docker Compose

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "🐳 Запуск Startup Scoring System через Docker Compose..."

# Проверка наличия Docker и Docker Compose
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен. Установите Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose не установлен. Установите Docker Compose: https://docs.docker.com/compose/install/"
    exit 1
fi

# Проверка наличия .env файла
if [ ! -f .env ]; then
    echo "⚠️  Файл .env не найден. Создайте его на основе env.production.example"
    echo "📝 Пример содержимого .env:"
    echo ""
    echo "DATABASE_URL=postgresql://scoring_user:scoring_password@localhost:5432/scoring_db"
    echo "GIGACHAT_API_KEY=your_api_key"
    echo "GIGACHAT_AUTH_URL=https://ngw.devices.sberbank.ru:9443/api/v2/oauth"
    echo "SECRET_KEY=your-secret-key-change-in-production"
    echo "UPLOAD_DIR=./uploads"
    echo "MCP_BASE_PORT=8000"
    echo ""
    read -p "Продолжить без .env файла? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Используем docker-compose или docker compose в зависимости от версии
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
else
    DOCKER_COMPOSE="docker compose"
fi

echo "📦 Остановка существующих контейнеров (если есть)..."
$DOCKER_COMPOSE down 2>/dev/null || true

echo "🏗️  Сборка и запуск контейнеров..."
$DOCKER_COMPOSE up --build -d

echo "⏳ Ожидание готовности сервисов..."
sleep 5

# Проверка состояния контейнеров
echo ""
echo "📊 Статус контейнеров:"
$DOCKER_COMPOSE ps

echo ""
echo "✅ Сервисы запущены!"
echo ""
echo "📍 Доступные сервисы:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend API: http://localhost:8000"
echo "   - API Docs: http://localhost:8000/docs"
echo "   - PostgreSQL: localhost:5432"
echo ""
echo "📋 Полезные команды:"
echo "   - Просмотр логов: $DOCKER_COMPOSE logs -f"
echo "   - Остановка: $DOCKER_COMPOSE down"
echo "   - Перезапуск: $DOCKER_COMPOSE restart"
echo ""
echo "🔍 Для просмотра логов в реальном времени:"
echo "   $DOCKER_COMPOSE logs -f"

# Предложение показать логи
read -p "Показать логи? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    $DOCKER_COMPOSE logs -f
fi
