# San Dauk Lay Prototype

San Dauk Lay is a Vue + Laravel prototype for a friendly digital-safety workspace. It includes login/register, a safety-check module, profile pages, and an admin panel for viewing users, changing roles, and deleting demo accounts.

## Run with Docker

```bash
docker compose up --build
```

Open the app at:

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api

Demo accounts after the backend starts and seeds the SQLite database:

- Admin: `admin@sandauklay.test` / `password`
- Student: `student@sandauklay.test` / `password`

The backend uses a Docker volume for `storage/app/database.sqlite`, so demo data stays between restarts. To reset all data:

```bash
docker compose down -v
docker compose up --build
```

## Local development without Docker

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Backend requires PHP 8.3+ and Composer:

```bash
cd backend
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

Google login is optional for the prototype. Add `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_REDIRECT_URI` in `backend/.env` if you want to demo OAuth.
