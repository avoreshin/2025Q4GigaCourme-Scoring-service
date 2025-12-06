# Настройка GigaChat API

## Получение API ключа

1. Зарегистрируйтесь на [GigaChat](https://developers.sber.ru/gigachat)
2. Создайте приложение в личном кабинете
3. Получите API ключ (Client ID и Client Secret)

## Формат API ключа

API ключ должен быть в формате Base64: `ClientID:ClientSecret`

Пример:
```
NDZmMzhkZmUtOTQ1Ny00MmY4LTlhZjctOWExYzY1OTNmZWQ3OjdiYmNjNThkLWZiNWYtNDg2OS1iNWY5LWQ4NTJmMjQxMjg1NA==
```

## Настройка переменных окружения

Добавьте в файл `.env`:

```env
GIGACHAT_API_KEY=your_base64_encoded_api_key
GIGACHAT_AUTH_URL=https://ngw.devices.sberbank.ru:9443/api/v2/oauth
```

## Используемые модели

По умолчанию используется модель `GigaChat-Pro`. Модель можно изменить в конфигурационных файлах агентов:
- `backend/app/services/agents/text_analyzer/config.yaml`
- `backend/app/services/agents/market_analyzer/config.yaml`
- `backend/app/services/agents/financial_analyzer/config.yaml`
- `backend/app/services/agents/team_analyzer/config.yaml`
- `backend/app/services/agents/risk_predictor/config.yaml`

## Процесс авторизации

1. Система отправляет POST запрос на `GIGACHAT_AUTH_URL` с:
   - `scope: GIGACHAT_API_PERS`
   - `Authorization: Bearer {GIGACHAT_API_KEY}`
2. Получает access token
3. Использует токен для вызовов API

## API Endpoints

- **Авторизация**: `https://ngw.devices.sberbank.ru:9443/api/v2/oauth`
- **Chat Completions**: `https://gigachat.devices.sberbank.ru/api/v1/chat/completions`

## Проверка настройки

После настройки переменных окружения перезапустите backend:

```bash
docker-compose restart backend
```

Или при локальной разработке:

```bash
cd backend
python -m uvicorn app.main:app --reload
```

## Troubleshooting

### Ошибка "GIGACHAT_API_KEY not configured"

Убедитесь, что:
1. Файл `.env` существует в корне проекта
2. Переменная `GIGACHAT_API_KEY` установлена
3. API ключ в правильном формате (Base64)

### Ошибка авторизации

Проверьте:
1. Правильность API ключа
2. Доступность сервиса GigaChat
3. Срок действия ключа (при необходимости обновите)
