CINEMA_DAILY — публичное интернет-приложение
============================================

Это веб-сайт для бесплатного размещения на Cloudflare Pages. Посетители открывают его по обычной интернет-ссылке в браузере. Ничего устанавливать не требуется.

ЧТО ВНУТРИ
----------
- index.html — интерфейс сайта.
- functions/api/movies.js — серверный API для загрузки кинопремьер и постеров TMDB.
- functions/api/news.js — серверный API для RSS-новостей Variety, Deadline и The Guardian Film.
- TMDB-токен хранится в секретах Cloudflare, а не в публичном HTML.
- Новости и премьеры автоматически обновляются на открытой странице каждые 30 минут. Серверные ответы кэшируются.

ПУБЛИКАЦИЯ — БЕЗ КОМАНДНОЙ СТРОКИ
---------------------------------
Понадобятся аккаунты GitHub и Cloudflare. Для первой публикации нужен интернет.

ШАГ 1. Создать GitHub-репозиторий
1. Откройте https://github.com/new
2. Repository name: CINEMA_DAILY
3. Выберите Public.
4. Нажмите Create repository.
5. Нажмите Add file → Upload files.
6. Распакуйте ZIP проекта на компьютере и загрузите ВСЕ содержимое папки CINEMA_DAILY_Web:
   - index.html
   - папку functions целиком, вместе с папкой api и обоими файлами .js
   - README_RU.txt
7. Нажмите Commit changes.

ШАГ 2. Развернуть на Cloudflare Pages
1. Откройте https://dash.cloudflare.com/
2. Создайте бесплатный аккаунт или войдите.
3. Откройте Workers & Pages.
4. Выберите Create application → Pages → Connect to Git.
5. Подключите GitHub и выберите репозиторий CINEMA_DAILY.
6. Project name: cinema-daily (если имя свободно).
7. Framework preset: None.
8. Build command: оставьте пустым.
9. Build output directory: / (корень репозитория).
10. Нажмите Save and Deploy.
11. После завершения Cloudflare покажет адрес вида https://cinema-daily.pages.dev. Это публичная ссылка сайта.

ШАГ 3. Настроить TMDB для постеров и премьер
1. Создайте/откройте аккаунт TMDB: https://www.themoviedb.org/
2. Перейдите в https://www.themoviedb.org/settings/api
3. Запросите API Read Access Token. Заполнение заявки может потребовать описания сайта.
4. В Cloudflare откройте Workers & Pages → cinema-daily → Settings → Variables and Secrets (или Settings → Environment variables).
5. Добавьте переменную:
   Name: TMDB_READ_TOKEN
   Value: ваш API Read Access Token
   Type: Secret (если доступен выбор типа — выбирайте Secret).
6. Не добавляйте токен в index.html и не публикуйте его в GitHub.
7. Дополнительно можно задать:
   TMDB_REGION = US (или GB, DE, AT, LV, RU)
   TMDB_LANGUAGE = ru-RU
8. Сохраните настройки и запустите повторное развёртывание (Deployments → Retry deployment) или создайте новый commit.

ПРОВЕРКА
--------
После публикации откройте:
- https://ВАШ-САЙТ.pages.dev/ — сайт.
- https://ВАШ-САЙТ.pages.dev/api/news — JSON со свежими новостями.
- https://ВАШ-САЙТ.pages.dev/api/movies — JSON с фильмами. Если TMDB_TOKEN не настроен, endpoint вернёт ошибку конфигурации.

ВАЖНЫЕ ОГРАНИЧЕНИЯ
------------------
- У сайта есть публичная ссылка, и любой человек может его открыть.
- Автообновление в браузере происходит, пока страница открыта. Серверные ответы кэшируются, но это не гарантирует непрерывное обновление, когда никто не посещает сайт.
- Некоторые RSS-источники могут блокировать запросы или временно менять формат; в таком случае часть новостей может отсутствовать.
- Даты премьер зависят от страны и могут меняться дистрибьюторами.
- TMDB API бесплатен для некоммерческого использования при соблюдении условий и атрибуции TMDB. Для коммерческого проекта уточните лицензию.
- Бесплатный тариф платформы может иметь ограничения, которые провайдер вправе менять.
- На этом этапе автоматическое обновление самой версии сайта происходит после загрузки новых файлов в GitHub, а не автоматически по расписанию.

ОФИЦИАЛЬНЫЕ ССЫЛКИ
------------------
Cloudflare Pages: https://developers.cloudflare.com/pages/
GitHub: https://github.com/
TMDB API: https://developer.themoviedb.org/docs
