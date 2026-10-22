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
    - Градиенты с indigo/purple/violet (#6366f1, #8b5cf6, #a855f7 и близкие оттенки)
    - Стеклянные/glassmorphism эффекты и полупрозрачные размытые панели
    - Центрированный hero + три одинаковые карточки с иконками под ним
    - Одинаковый border-radius (например, везде 16px) и одинаковые тени у всех карточек
    - Неоновые свечения (box-shadow с насыщенным цветом) и градиентный текст на нескольких заголовках
    - Чистый белый фон (#FFFFFF) и чистый чёрный текст (#000000)

    ЦВЕТОВАЯ ПАЛИТРА:
    - Canvas (основной фон): #FFFBEB
    - Surface (карточки, панели): #FEF3C7
    - Ink / основной текст: #292524
    - Primary accent: #A16207
    - Secondary accent: #F59E0B
    - Muted text: #78716C

    СТРУКТУРА И ЛАЙАУТ:
    - Разрушать однородность: чередовать секции с разной шириной, padding и визуальным весом
    - Использовать асимметрию: split-screen, доминирующая колонка, bento-сетка с разными span
    - Разделять блоки не только карточками: использовать тонкие линии (border-t, divide-y), отступы и фоновые тона
    - Текст выравнивать по левому краю; центрирование — только для коротких заголовков или CTA
    - Внутренние отступы карточки не должны быть больше внешних отступов между блоками (правило близости)

    CSS ПЕРЕМЕННЫЕ (globals.css):
    - --canvas: #FFFBEB
    - --surface: #FEF3C7
    - --ink: #292524
    - --primary: #A16207
    - --secondary: #F59E0B
    - --muted: #78716C
    - --error: #DC2626
    - --success: #059669
    - --warning: #D97706
    - --info: #0891B2
    - --disabled: #D6D3D1
    - --border: #E7E5E4
    - --shadow: rgba(41, 37, 36, 0.08)
</design_rules>

<output>
    Дай краткий список созданных и изменённых файлов с описанием каждого. Укажи выполненные проверки и оставшиеся проблемы, если они есть. Создавай файл errors.md и выноси ошибки которые не удалось решить
</output>