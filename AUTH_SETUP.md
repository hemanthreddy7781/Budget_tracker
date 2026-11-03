# Ledgr authentication setup

This patch adds email/password registration, bcrypt password hashing, JWT bearer-token authentication, and per-user ownership for all existing API resources.

## 1. Back up your current database

Before changing the schema, create a MySQL backup. The migration below is intended to run once against the existing `ledgr` database.

```bash
mysqldump -u YOUR_DB_USER -p ledgr > ledgr-before-auth.sql
```

## 2. Install dependencies

From the repository root:

```bash
npm install
```

This installs `bcryptjs` and `jsonwebtoken` for the server and refreshes the root package lock.

## 3. Configure the server

Copy `server/.env.example` to `server/.env`. Set a unique JWT secret of at least 32 characters. For example, generate one with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Never commit `.env` files.

## 4. Run the database migration

Run the SQL file once against your existing database:

```bash
mysql -u YOUR_DB_USER -p ledgr < server/src/db/migrations/001_auth.sql
```

The migration creates the `users` table and adds `user_id` ownership columns to settings, categories, account groups, accounts, budgets and transactions. Existing rows are assigned to a disabled legacy owner (user ID 1), so they are not exposed to new accounts. New users receive their own default categories, account groups and settings. They start with no transactions or accounts.

If your existing database contains personal data that you need to keep using, do not discard it. It remains in the database under the legacy owner and needs an intentional, verified one-time transfer to the account you control before opening registration publicly.

## 5. Run locally

```bash
npm run dev
```

Open `http://localhost:5173`. Register a new account, then create an account (e.g. Cash) before adding transactions.

## 6. Authentication API

- `POST /auth/register` — `{ "name": "...", "email": "...", "password": "at least 8 chars" }`
- `POST /auth/login` — `{ "email": "...", "password": "..." }`
- `GET /auth/me` — requires `Authorization: Bearer <token>`

All other API routes require a valid bearer token. The React app stores the token in local storage and adds it to API requests. For a higher-security production deployment, consider moving to secure, HttpOnly, SameSite cookies and adding CSRF protection, rate limiting, email verification, password reset, and refresh-token rotation.

## 7. Production frontend

Set `VITE_API_URL` in the frontend hosting provider to the backend origin, with no trailing slash and no `/api` suffix (for example `https://your-api.onrender.com`). Set `CLIENT_URL` on the backend to the exact deployed frontend origin. Keep `JWT_SECRET` and database credentials private.

## Important

This implementation scopes every existing resource query to the authenticated user's ID. Do not remove the ownership filters or accept a `user_id` from client request bodies. The server always derives the owner from the verified JWT.
