<context>
    Проект: Marketplace объявлений для продажи товаров с чатом между покупателем и продавцом

    Стек: 
    - Backend: Python + FastAPI + MySQL
    - Frontend: Next.js

    Структура проекта:
    backend:
        alembic:
            versions/
            env.py
            script.py.mako
        app:
            api/
                routes/
                    main.py
            core/
                core.py
                dependencies.py
                security.py
            models/
               models.py
            schemas/
               schemas.py
            crud/
                main.py
            main.py
    frontend:
        src/
            app/
                dashboard/
                    page.tsx
                login/
                    page.tsx
                profile/
                    page.tsx
                register/
                    page.tsx
                favicon.ico
                globals.css
                layout.tsx
                page.tsx
            components/
                Button.tsx
                ErrorAlert.tsx
                FormField.tsx
            lib/
                api.ts
                auth.ts
                types.ts
        .env.local
        package.json
        next.config.ts
        tsconfig.json
        eslint.config.mjs

</context>

<constraints>
    - Использовать современные и поддерживаемые технологии.
    - Разрабатывать только frontend.
    - Не изменять и не использовать для редактирования папку backend.
    - Перед интеграцией изучать существующие API endpoints и их контракты.
    - Не придумывать endpoints, ответы API и фиктивную авторизацию.
    - Не устанавливать дополнительные зависимости без необходимости.
    - Соблюдать существующую архитектуру проекта.
    - Не запускай frontend и backend приложения
</constraints>

<tools>
    - Next.js
</tools>

<workflow>
    Перед выполнением задачи изучать frontend часть и составлять краткий план.

    Выполнять задачу пошагово, не изменяя лишние файлы.
    Подключать frontend к реальному FastAPI API.

    Исправлять обнаруженные ошибки.

    Если информации об API недостаточно, не выдумывать решения, а сообщать, что необходимо уточнить.
</workflow>

<design_rules>
    ЗАПРЕЩЁННЫЕ ЭЛЕМЕНТЫ:
    - Неоновые акценты (циан, фиолетовый, лайм)
    - Градиенты на фоне
    - Box-shadow со свечением
    - Стеклянные панели (glassmorphism)
    - Чистый #000000 и #FFFFFF
    - Градиенты с indigo/purple/violet (#6366f1, #8b5cf6, #a855f7 и близкие оттенки)
    - Центрированный hero + три одинаковые карточки с иконками под ним
    - Одинаковый border-radius (например, везде 16px) и одинаковые тени у всех карточек
    - Неоновые свечения (box-shadow с насыщенным цветом) и градиентный текст на нескольких заголовках

    ЦВЕТОВАЯ ПАЛИТРА (тёмная тема):
    - Canvas / Base (основной фон): #1C1C1E (не #000000)
    - Surface / Raised (карточки, панели): #2A2A2D
    - Inset / Input (поля ввода, футер): #151517
    - Text Primary: #F2F2F7 (не #FFFFFF)
    - Text Secondary: rgba(242, 242, 247, 0.6)
    - Accent / CTA: #B8935A (приглушённая латунь — единственный акцент)
    - Accent Hover: #C9A36B
    - Border / Divider: #3A3A3D
    - Muted / Disabled: #5C5C61

    СТРУКТУРА И ЛАЙАУТ:
    - Разрушать однородность: чередовать секции с разной шириной, padding и визуальным весом
    - Использовать асимметрию: split-screen, доминирующая колонка, bento-сетка с разными span
    - Разделять блоки не только карточками: использовать тонкие линии (border-t, divide-y), отступы и фоновые тона
    - Текст выравнивать по левому краю; центрирование — только для коротких заголовков или CTA
    - Внутренние отступы карточки не должны быть больше внешних отступов между блоками (правило близости)

    CSS ПЕРЕМЕННЫЕ (globals.css):
    - --canvas: #1C1C1E
    - --surface: #2A2A2D
    - --inset: #151517
    - --text-primary: #F2F2F7
    - --text-secondary: rgba(242, 242, 247, 0.6)
    - --accent: #B8935A
    - --accent-hover: #C9A36B
    - --border: #3A3A3D
    - --muted: #5C5C61
    - --error: #FF453A
    - --success: #30D158
    - --warning: #FF9F0A
    - --info: #0A84FF
    - --disabled: #5C5C61
    - --shadow: rgba(0, 0, 0, 0.3)
</design_rules>

<output>
    Дай краткий список созданных и изменённых файлов с описанием каждого. Укажи выполненные проверки и оставшиеся проблемы, если они есть. Создавай файл errors.md и выноси ошибки которые не удалось решить
</output>