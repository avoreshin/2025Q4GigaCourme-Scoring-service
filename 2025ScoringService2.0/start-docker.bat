@echo off
REM Скрипт для локального запуска проекта через Docker Compose (Windows)

cd /d %~dp0

echo 🐳 Запуск Startup Scoring System через Docker Compose...

REM Проверка наличия Docker
where docker >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker не установлен. Установите Docker Desktop: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

REM Проверка наличия Docker Compose
docker compose version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose не установлен. Установите Docker Desktop: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

REM Проверка наличия .env файла
if not exist .env (
    echo ⚠️  Файл .env не найден. Создайте его на основе env.production.example
    echo.
    echo 📝 Пример содержимого .env:
    echo.
    echo DATABASE_URL=postgresql://scoring_user:scoring_password@localhost:5432/scoring_db
    echo GIGACHAT_API_KEY=your_api_key
    echo GIGACHAT_AUTH_URL=https://ngw.devices.sberbank.ru:9443/api/v2/oauth
    echo SECRET_KEY=your-secret-key-change-in-production
    echo UPLOAD_DIR=./uploads
    echo MCP_BASE_PORT=8000
    echo.
    set /p CONTINUE="Продолжить без .env файла? (y/n): "
    if /i not "%CONTINUE%"=="y" (
        pause
        exit /b 1
    )
)

echo 📦 Остановка существующих контейнеров (если есть)...
docker compose down 2>nul

echo 🏗️  Сборка и запуск контейнеров...
docker compose up --build -d

echo ⏳ Ожидание готовности сервисов...
timeout /t 5 /nobreak >nul

echo.
echo 📊 Статус контейнеров:
docker compose ps

echo.
echo ✅ Сервисы запущены!
echo.
echo 📍 Доступные сервисы:
echo    - Frontend: http://localhost:3000
echo    - Backend API: http://localhost:8000
echo    - API Docs: http://localhost:8000/docs
echo    - PostgreSQL: localhost:5432
echo.
echo 📋 Полезные команды:
echo    - Просмотр логов: docker compose logs -f
echo    - Остановка: docker compose down
echo    - Перезапуск: docker compose restart
echo.

set /p SHOW_LOGS="Показать логи? (y/n): "
if /i "%SHOW_LOGS%"=="y" (
    docker compose logs -f
)

pause
