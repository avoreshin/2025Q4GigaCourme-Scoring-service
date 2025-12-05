# Startup Scoring System 2.0

Система интеллектуального скоринга стартапов с использованием AI-агентов через MCP протокол.

## Технологии

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Python + FastAPI
- **База данных**: PostgreSQL
- **AI**: GigaChat через MCP протокол

## Структура проекта

```
2025ScoringService2.0/
├── frontend/          # React приложение
├── backend/           # FastAPI приложение
└── docker-compose.yml # Docker конфигурация
```

## Установка и запуск

### Быстрый запуск (рекомендуется)

**Linux/Mac:**
```bash
# Запустить все сервисы одновременно
./start.sh
```

**Windows:**
```cmd
start.bat
```

Этот скрипт автоматически:
- Проверит наличие .env файла
- Создаст виртуальное окружение для Python
- Установит все зависимости
- Инициализирует базу данных
- Запустит backend и frontend

### Отдельные сервисы

#### Только Backend

**Linux/Mac:**
```bash
./start-backend.sh
```

**Windows:**
```cmd
start-backend.bat
```

#### Только Frontend

**Linux/Mac:**
```bash
./start-frontend.sh
```

**Windows:**
```cmd
start-frontend.bat
```

#### Инициализация БД

**Linux/Mac:**
```bash
./init-db.sh
```

**Windows:**
```cmd
init-db.bat
```

### С помощью Docker Compose

```bash
./start-docker.sh
# или
docker-compose up --build
```

### Локальная разработка (вручную)

#### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m app.core.init_db  # Инициализация БД
uvicorn app.main:app --reload
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Переменные окружения

Создайте файл `.env` в корне проекта:

```env
DATABASE_URL=postgresql://scoring_user:scoring_password@localhost:5432/scoring_db
GIGACHAT_API_KEY=your_api_key
GIGACHAT_AUTH_URL=https://ngw.devices.sberbank.ru:9443/api/v2/oauth
SECRET_KEY=your-secret-key
UPLOAD_DIR=./uploads
MCP_BASE_PORT=8000
```

## API Endpoints

- `POST /api/startups/upload` - загрузка питча
- `POST /api/startups/{id}/score` - запуск скоринга
- `GET /api/startups` - список стартапов
- `GET /api/leaderboard` - лидерборд
- `GET /api/agents/configs` - конфигурации агентов

## Лицензия

MIT

