# TV Display System

Система отображения медиа контента для OrangePI с админ панелью для управления контентом.

## Возможности

- 📺 **Публичный режим отображения** (`/display`) - полноэкранный просмотр фото и видео для OrangePI
- ⚙️ **Админ панель** (`/admin`) - управление контентом с авторизацией
- 🔄 **Автообновление** - контент обновляется автоматически
- 📱 **Адаптивный дизайн** - работает на любых устройствах

## Быстрый старт

1. **Установка зависимостей:**

```bash
npm install
# или
bun install
```

2. **Настройка переменных окружения:**

```bash
# Создайте файл .env.local
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

3. **Запуск в режиме разработки:**

```bash
npm run dev
# или
bun dev
```

4. **Открыть в браузере:**

- Главная страница: [http://localhost:3000](http://localhost:3000)
- Режим отображения: [http://localhost:3000/display](http://localhost:3000/display)
- Админ панель: [http://localhost:3000/admin](http://localhost:3000/admin)

## Использование с OrangePI

### Автоматический запуск на OrangePI

Создайте скрипт для автоматического запуска браузера в полноэкранном режиме:

```bash
#!/bin/bash
# autostart.sh

# Ждем загрузки системы
sleep 10

# Запускаем Chromium в полноэкранном режиме
chromium-browser \
  --kiosk \
  --no-sandbox \
  --disable-infobars \
  --disable-session-crashed-bubble \
  --disable-restore-session-state \
  --autoplay-policy=no-user-gesture-required \
  http://ваш-домен.com/display

# Или для локального сервера:
# http://192.168.1.100:3000/display
```

### Настройка автозапуска

1. Сделайте скрипт исполняемым:

```bash
chmod +x autostart.sh
```

2. Добавьте в автозагрузку (например, в crontab):

```bash
crontab -e
# Добавьте строку:
@reboot /path/to/autostart.sh
```

## Структура проекта

```
src/
├── app/
│   ├── page.tsx              # Главная страница с навигацией
│   ├── display/
│   │   └── page.tsx          # Публичный режим отображения
│   ├── admin/
│   │   ├── page.tsx          # Страница входа в админку
│   │   ├── dashboard/
│   │   │   └── page.tsx      # Админ панель
│   │   ├── api/              # API клиенты для админки
│   │   │   ├── auth.ts       # API для авторизации
│   │   │   └── media.ts      # API для медиа файлов
│   │   └── hooks/            # React Query хуки
│   │       ├── use-auth.ts   # Хук для авторизации
│   │       └── use-media.ts  # Хук для медиа файлов
│   ├── providers.tsx         # React Query Provider
│   └── api/                  # Next.js API Routes
│       ├── auth/
│       │   ├── login/
│       │   │   └── route.ts  # Вход в систему
│       │   ├── logout/
│       │   │   └── route.ts  # Выход из системы
│       │   └── me/
│       │       └── route.ts  # Проверка авторизации
│       └── media/
│           ├── route.ts      # CRUD для медиа
│           ├── upload/
│           │   └── route.ts  # Загрузка файлов
│           └── [id]/
│               └── route.ts  # Удаление файлов
├── lib/
│   ├── api-client.ts         # Axios клиент с cookies
│   ├── query-client.ts       # React Query конфигурация
│   └── media-storage.ts      # Временное хранилище медиа
├── middleware.ts             # Защита админских маршрутов
└── ...
```

## API

### Авторизация

- `POST /api/auth/login` - вход в админку

### Медиа файлы

- `GET /api/media` - получить список медиа файлов
- `POST /api/media/upload` - загрузить файл (требует авторизации)
- `DELETE /api/media/[id]` - удалить файл (требует авторизации)

## Архитектура

### Технологии:

- **Next.js 15** - React фреймворк
- **React Query** - Кеширование и синхронизация данных
- **Axios** - HTTP клиент с поддержкой cookies
- **TypeScript** - Типизация
- **Tailwind CSS** - Стилизация

### Особенности:

- **Cookie-based авторизация** - безопасная сессионная авторизация
- **React Query** - автоматическое кеширование и обновление данных
- **Хуки** - переиспользуемая логика для работы с API
- **Middleware** - защита админских маршрутов на уровне Next.js
- **Модульная архитектура** - разделение логики по функциональным блокам

## Безопасность

- Админ панель защищена cookie-based авторизацией
- HttpOnly cookies защищают от XSS атак
- SameSite cookies защищают от CSRF атак
- Публичный режим отображения не требует авторизации
- Middleware защищает админские маршруты
- Загруженные файлы сохраняются в папке `public/uploads/`

## Настройка в продакшене

1. **Смените учетные данные админа:**

```bash
# В .env.local или переменных окружения
ADMIN_USERNAME=your_secure_username
ADMIN_PASSWORD=your_secure_password
```

2. **Настройте базу данных** (опционально):
   - Текущая версия использует временное хранилище в памяти
   - Для продакшена рекомендуется подключить базу данных

3. **Настройте HTTPS** для безопасности

## Разработка

```bash
# Запуск в режиме разработки
npm run dev

# Проверка кода
npm run lint
npm run format:check

# Исправление форматирования
npm run format
npm run lint:fix

# Сборка для продакшена
npm run build
npm run start
```

## Особенности баннеров

- **Поддерживаемые форматы:** JPG, PNG, GIF, WebP, MP4, WebM, OGV
- **Настраиваемое время показа** для каждого баннера
- **Автоматическая смена** с учетом времени показа
- **Название и описание** для каждого баннера
- **Превью** в админ панели

## Структура данных баннера

```typescript
interface Banner {
  id: number;
  title: string;
  description: string;
  seconds: number; // Время показа в секундах
  file_url: string; // URL файла
  file_type: "image" | "video";
  created_at: string;
  updated_at: string;
}
```

## Лицензия

MIT
