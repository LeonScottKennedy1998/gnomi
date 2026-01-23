# Gnomgarden Admin + API

## Что внутри
- `public/` — статический лендинг
- `server/` — Express API + Prisma + SQLite
- `admin/` — React (Vite) админка
- `data/content.json` — единый источник контента + бэкап

## Быстрый старт (dev)
1. Установить зависимости:
   ```bash
   npm install
   ```
2. Скопировать `.env.example` → `.env` и задать `ADMIN_PASSWORD` и `JWT_SECRET`.
3. Миграция и сид:
   ```bash
   npm run prisma:migrate
   npm run seed
   ```
4. Запуск:
   ```bash
   npm run dev
   ```

Админка откроется на `http://localhost:5173/admin/`, API и лендинг — на `http://localhost:3000/`.

## Продакшн
1. Установить зависимости и задать `.env`.
2. Миграция/сид (один раз):
   ```bash
   npm run prisma:migrate
   npm run seed
   ```
3. Сборка:
   ```bash
   npm run build
   ```
4. Запуск:
   ```bash
   npm run start
   ```

## Скрипты
- `npm run dev` — запуск сервера + админки
- `npm run build` — сборка admin + server
- `npm run start` — запуск production сервера
- `npm run prisma:migrate` — миграции Prisma
- `npm run seed` — загрузить `data/content.json` в БД

## API
- `GET /api/content` — весь контент
- `PUT /api/content` — сохранить весь контент (нужна авторизация)
- `GET/PUT /api/projects`, `/api/services`, `/api/carousels`, `/api/pricing`, `/api/contacts`, `/api/site`
- `POST /api/upload` — загрузка изображения (jpg/png/webp)
- `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`

## Примечания
- Авторизация через httpOnly cookie + CSRF токен (double-submit cookie).
- Изображения загружаются в `public/uploads` и доступны по `/uploads/...`.
- Все изменения админки сохраняются в SQLite и дублируются в `data/content.json`.
