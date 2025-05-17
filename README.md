
# Terra Zetetica — минимальный проект на Next.js

Этот репозиторий — стартовый шаблон сайта для вашего «сетевого государства».

## Быстрый старт

```bash
# 1. Установите зависимости
npm install

# 2. Запустите локальный dev‑сервер
npm run dev
# → Откройте http://localhost:3000
```

## Деплой на Vercel

1. Создайте репозиторий на GitHub и запушьте туда этот код.
2. Зайдите на https://vercel.com, нажмите **New Project**.
3. Подключите репозиторий *terra-zetetica*.
4. Оставьте настройки по умолчанию (`npm run build`, Output — `.next`) и нажмите **Deploy**.
5. Через ~30 сек. сайт будет доступен по адресу `https://<project>.vercel.app`.

## Структура

```
pages/          — страницы Next.js (index.js и _app.js)
styles/globals.css  — Tailwind + базовые стили
tailwind.config.js  — конфигурация Tailwind
postcss.config.js   — PostCSS + autoprefixer
```

## Добавление Tailwind компонентов

Используйте готовые блоки из [tailwindui.com](https://tailwindui.com/) или https://flowbite.com, копируя HTML в файлы `/pages` или создавая React‑компоненты в `/components`.

Удачи 🌐
