# Мини интернет-магазин

Full-stack приложение на NestJS + React.

## Технологический стек

**Backend:** NestJS, Prisma ORM, PostgreSQL, JWT, bcrypt
**Frontend:** React 18, TypeScript, Redux Toolkit, TailwindCSS, React Router v6

## Структура проекта

```
shop/
├── backend/          # NestJS API сервер
│   ├── prisma/
│   │   ├── schema.prisma   # Схема базы данных
│   │   └── seed.ts         # Начальные данные
│   └── src/
│       ├── auth/           # Аутентификация (JWT, роли)
│       ├── cart/           # Корзина
│       ├── orders/         # Заказы
│       ├── products/       # Товары (CRUD)
│       ├── prisma/         # Prisma модуль
│       └── users/          # Пользователи
└── frontend/         # React SPA
    └── src/
        ├── api/            # Axios API слой
        ├── components/     # UI компоненты
        ├── features/       # Redux slices
        ├── pages/          # Страницы
        └── types/          # TypeScript типы
```

## Предварительные требования

- Node.js 18+
- PostgreSQL 14+
- npm или yarn

## Запуск

### 1. Клонировать и установить зависимости

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Настроить базу данных

```bash
cd backend

# Скопировать .env.example в .env и настроить DATABASE_URL
cp .env.example .env

# Запустить миграции Prisma
npx prisma migrate dev --name init

# Заполнить базу тестовыми данными
npx prisma db seed
```

### 3. Запустить приложение

```bash
# Terminal 1: Backend (http://localhost:3001)
cd backend
npm run start:dev

# Terminal 2: Frontend (http://localhost:5173)
cd frontend
npm run dev
```

### 4. Открыть в браузере

Перейдите на http://localhost:5173

## Тестовые аккаунты (после seed)

| Роль   | Имя             | Email           | Пароль   |
|--------|-----------------|-----------------|----------|
| Админ  | Азиз Азизов     | admin@shop.com  | admin123 |
| Юзер   | Али Алиев       | user@shop.com   | user123  |

## API Endpoints

### Аутентификация
- `POST /api/auth/register` — Регистрация
- `POST /api/auth/login` — Вход

### Товары
- `GET /api/products` — Список товаров (фильтры: search, category, minPrice, maxPrice, page, limit)
- `GET /api/products/categories` — Список категорий
- `GET /api/products/:id` — Товар по ID
- `POST /api/products` — Создать (только ADMIN)
- `PATCH /api/products/:id` — Обновить (только ADMIN)
- `DELETE /api/products/:id` — Удалить (только ADMIN)

### Корзина (требуется JWT)
- `GET /api/cart` — Получить корзину
- `POST /api/cart` — Добавить товар
- `PATCH /api/cart/:id` — Обновить количество
- `DELETE /api/cart/:id` — Удалить товар
- `DELETE /api/cart` — Очистить корзину

### Заказы (требуется JWT)
- `GET /api/orders` — Мои заказы
- `POST /api/orders` — Оформить заказ (из корзины)
