# Marketplace - Маркетплейс объявлений

Marketplace для продажи товаров с системой авторизации, профилями пользователей, товарными объявлениями и возможностью покупок.

## Описание

Проект представляет собой веб-приложение для продажи товаров, где пользователи могут:
- Регистрироваться и авторизовываться
- Создавать профили и управлять личными данными
- Публиковать объявления о продаже товаров
- Просматривать каталог товаров
- Совершать покупки

## Стек технологий

### Backend
- **Python** - язык программирования
- **FastAPI** - веб-фреймворк для создания API
- **MySQL** - система управления базами данных
- **SQLAlchemy** - ORM для работы с базой данных
- **Alembic** - инструмент для миграций базы данных
- **Pydantic** - валидация данных и работа с конфигурацией
- **JWT (python-jose)** - токеновая авторизация
- **Passlib** - хеширование паролей (Argon2)

### Frontend
- **Next.js 16** - React-фреймворк для веб-приложений
- **React 19** - библиотека для построения пользовательских интерфейсов
- **TypeScript** - типизация JavaScript
- **Tailwind CSS 4** - CSS-фреймворк для стилизации
- **Axios** - HTTP-клиент для работы с API

## Установка и запуск

### Требования
- Python 3.8+
- Node.js 20+
- MySQL 8.0+

### Backend

1. Перейдите в директорию backend:
```bash
cd backend
```

2. Создайте виртуальное окружение:
```bash
python -m venv venv
```

3. Активируйте виртуальное окружение:
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

4. Установите зависимости:
```bash
pip install -r requirements.txt
```

5. Настройте переменные окружения, скопировав файл примера:
```bash
cp .env.example .env
```

Отредактируйте `.env` файл, указав данные вашей MySQL базы данных:
```
DATABASE_URL=mysql+pymysql://user:password@localhost:3306/dbname
TOKEN_EXPIRES_TIME=3600
SECRET_KEY=your-secret-key
ALGORITHM=HS256
```

6. Запустите миграции базы данных:
```bash
alembic upgrade head
```

7. Запустите сервер:
```bash
uvicorn app.main:app --reload
```

Backend будет доступен по адресу: `http://127.0.0.1:8000`

API документация (Swagger): `http://127.0.0.1:8000/docs`

### Frontend

1. Перейдите в директорию frontend:
```bash
cd frontend
```

2. Установите зависимости:
```bash
npm install
```

3. Настройте переменные окружения. Файл `.env.local` уже создан, убедитесь что содержит:
```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

4. Запустите сервер разработки:
```bash
npm run dev
```

Frontend будет доступен по адресу: `http://localhost:3000`

## Структура проекта

```
lesson97/
├── backend/                 # Backend часть приложения
│   ├── alembic/            # Миграции базы данных
│   │   └── versions/       # SQL миграции
│   ├── app/                # Основное приложение
│   │   ├── api/            # API маршруты
│   │   │   └── routes/     # Эндпоинты
│   │   ├── core/           # Настройки и зависимости
│   │   ├── crud/           # CRUD операции с БД
│   │   ├── db/             # Конфигурация БД
│   │   ├── models/         # SQLAlchemy модели
│   │   └── schemas/        # Pydantic схемы
│   ├── requirements.txt    # Python зависимости
│   └── .env.example        # Пример конфигурации
│
├── frontend/               # Frontend часть приложения
│   ├── src/
│   │   ├── app/            # Next.js App Router страницы
│   │   │   ├── dashboard/  # Панель управления
│   │   │   ├── login/      # Страница входа
│   │   │   ├── profile/    # Профиль пользователя
│   │   │   ├── register/   # Страница регистрации
│   │   │   ├── layout.tsx  # Главный layout
│   │   │   └── page.tsx    # Главная страница
│   │   ├── components/     # Переиспользуемые компоненты
│   │   │   ├── Button.tsx
│   │   │   ├── ErrorAlert.tsx
│   │   │   └── FormField.tsx
│   │   └── lib/            # Утилиты и helpers
│   │       ├── api.ts      # Работа с API
│   │       ├── auth.ts     # Авторизация
│   │       └── types.ts    # TypeScript типы
│   ├── package.json        # Node.js зависимости
│   ├── next.config.ts      # Конфигурация Next.js
│   └── .env.local          # Переменные окружения
│
└── README.md              # Документация
```

## Модели данных

### Account (Пользователь)
- `id` - уникальный идентификатор
- `username` - имя пользователя (уникальное)
- `email` - email (уникальный)
- `password` - хешированный пароль
- `created_at` - дата создания
- `updated_at` - дата обновления

### Item (Товар)
- `id` - уникальный идентификатор
- `name` - название товара
- `description` - описание
- `count` - количество
- `price` - цена
- `user_id` - id продавца
- `categories` - категории товара

### Category (Категория)
- `id` - уникальный идентификатор
- `name` - название категории

### Purchase (Покупка)
- `id` - уникальный идентификатор
- `account_id` - id покупателя
- `item_id` - id товара
- `price` - цена покупки
- `count` - количество
- `created_at` - дата покупки
