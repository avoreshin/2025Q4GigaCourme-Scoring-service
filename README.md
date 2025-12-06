# Startup Scoring System 2.0

Система интеллектуального скоринга стартапов с использованием AI-агентов через MCP протокол.

## Технологии

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Python + FastAPI
- **База данных**: PostgreSQL
- **AI**: GigaChat через MCP протокол

## Структура проекта

```
.
├── frontend/              # React приложение
├── backend/               # FastAPI приложение
│   └── app/
│       ├── api/           # API endpoints
│       ├── core/          # Конфигурация и БД
│       ├── models/        # SQLAlchemy модели
│       ├── schemas/       # Pydantic схемы
│       └── services/      # Бизнес-логика
│           ├── agents/    # AI-агенты (MCP)
│           ├── parsers/   # Парсеры документов
│           └── scoring/   # Сервис скоринга
├── nginx/                 # Nginx конфигурация
├── server/                # Скрипты для продакшена
├── docker-compose.yml     # Docker конфигурация (dev)
├── docker-compose.prod.yml # Docker конфигурация (prod)
└── start-docker.sh        # Скрипт запуска через Docker
```

## Установка и запуск

### Быстрый запуск через Docker (рекомендуется)

```bash
./start-docker.sh
```

Или вручную:
```bash
docker-compose up --build
```

Скрипт автоматически:
- Проверит наличие Docker и Docker Compose
- Проверит наличие `.env` файла
- Соберет и запустит все сервисы (PostgreSQL, Backend, Frontend)
- Покажет статус контейнеров

После запуска доступны:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **PostgreSQL**: localhost:5432

### Локальная разработка (без Docker)

#### Требования

- Python 3.9+
- Node.js 18+
- PostgreSQL 15+

#### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Инициализация БД
python -m app.core.init_db

# Запуск сервера
uvicorn app.main:app --reload --port 8000
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

#### База данных

Убедитесь, что PostgreSQL запущен и создана база данных согласно `DATABASE_URL` из `.env`.

## Переменные окружения

Создайте файл `.env` в корне проекта на основе `env.production.example`:

```env
DATABASE_URL=postgresql://scoring_user:scoring_password@localhost:5432/scoring_db
GIGACHAT_API_KEY=your_api_key
GIGACHAT_AUTH_URL=https://ngw.devices.sberbank.ru:9443/api/v2/oauth
SECRET_KEY=your-secret-key-change-in-production
UPLOAD_DIR=./uploads
MCP_BASE_PORT=8000
```

**Важно**: Для настройки GigaChat API см. [GIGACHAT_SETUP.md](./GIGACHAT_SETUP.md)

## API Endpoints

### Стартапы
- `GET /api/startups` - список стартапов (с фильтрами: industry, stage, geography)
- `GET /api/startups/{startup_id}` - детали стартапа
- `POST /api/startups` - создание стартапа
- `PUT /api/startups/{startup_id}` - обновление стартапа
- `DELETE /api/startups/{startup_id}` - удаление стартапа
- `POST /api/startups/upload` - загрузка питча (PDF, Markdown, URL, текст)

### Скоринг
- `POST /api/scorings/startups/{startup_id}/score` - запуск скоринга
- `GET /api/scorings` - список всех скорингов
- `GET /api/scorings/{scoring_id}` - детали скоринга
- `POST /api/scorings/{scoring_id}/comments` - добавление комментария

### Документы
- `GET /api/pitch-documents/{document_id}` - получение документа
- `PUT /api/pitch-documents/{document_id}/text` - обновление текста документа
- `POST /api/pitch-documents/{document_id}/analyze-missing` - анализ недостающей информации

### Лидерборд
- `GET /api/leaderboard` - рейтинг стартапов

### Экспорт
- `GET /api/export/{scoring_id}/export/pdf` - экспорт в PDF
- `GET /api/export/{scoring_id}/export/excel` - экспорт в Excel

### Агенты
- `GET /api/agents/configs` - список конфигураций агентов
- `GET /api/agents/configs/{agent_name}` - конфигурация агента
- `PUT /api/agents/configs/{agent_name}` - обновление конфигурации
- `POST /api/agents/configs/{agent_name}/reset` - сброс конфигурации

Полная документация API доступна по адресу: http://localhost:8000/docs

## Продакшен

Для продакшена используйте `docker-compose.prod.yml`:

```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

Скрипты для управления продакшен сервером находятся в папке `server/`:
- `start.sh` - запуск сервисов
- `stop.sh` - остановка сервисов
- `update.sh` - обновление проекта
- `backup-db.sh` - резервное копирование БД
- `get-ssl.sh` - получение SSL сертификатов

## Лицензия

MIT

