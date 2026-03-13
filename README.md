 User Management System

A clean, secure backend API for managing users — with a separate admin panel built in. Built with Node.js, TypeScript, Express, Prisma, and PostgreSQL.

---

 What This Does

This project gives you two things in one:

- **A user-facing auth system** — sign up, log in, and view your profile
- **An admin dashboard API** — list, update, and delete users

Both sides are fully independent, with separate JWT secrets so there's no way for a user token to sneak into admin territory.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js + TypeScript |
| Framework | Express |
| Database | PostgreSQL |
| ORM | Prisma |
| Password Hashing | argon2 |
| Auth | JWT (dual secret) |

---

## ⚡ Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/JOHNNY-OBA/creative-verse.git
cd user-management-system
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up your environment

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Your `.env` should look like this:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/user_mgmt"
JWT_SECRET="your-user-secret-here"
JWT_ADMIN_SECRET="your-admin-secret-here"
PORT=3000
```

> 💡 Make sure your PostgreSQL database is running before the next step.

### 4. Run database migrations

```bash
npx prisma migrate dev --name init
```

### 5.  Seed an admin account

```bash
npm run seed
```

### 6. Start the server

```bash
# Development (with hot reload)
npm run dev

# Production
npm run build && npm start
```

Your API will be live at `http://localhost:3000` 🎉

---

## 📡 API Endpoints

### Auth — `/api/auth`

| Method | Endpoint | What it does | Auth required? |
|---|---|---|---|
| POST | `/api/auth/signup` | Register a new user | ❌ |
| POST | `/api/auth/login` | Log in and get a token | ❌ |
| GET | `/api/auth/me` | Get your profile | ✅ User token |

#### Sign Up
```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "supersecret123"
}
```

#### Log In
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "jane@example.com",
  "password": "supersecret123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <your_token>
```

---

### Admin — `/api/admin`

> All admin routes (except login) require an admin JWT token.

| Method | Endpoint | What it does |
|---|---|---|
| POST | `/api/admin/login` | Admin login |
| GET | `/api/admin/users` | List all users (with pagination + search) |
| PATCH | `/api/admin/users/:id` | Update a user |
| DELETE | `/api/admin/users/:id` | Delete a user |

#### Admin Login
```http
POST /api/admin/login
Content-Type: application/json

{
   "email": "admin@example.com",
    "password": "yes@2021.password"
}
```

#### List Users
```http
GET /api/admin/users?page=1&limit=10&search=jane
Authorization: Bearer <admin_token>
```

#### Update a User
```http
PATCH /api/admin/users/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Jane Smith",
  "status": "suspended"
}
```

#### Delete a User
```http
DELETE /api/admin/users/:id
Authorization: Bearer <admin_token>
```

---

**Error:**
```json
{
  "success": false,
  "error": {
    "message": "Something went wrong",
    "code": "ERROR_CODE"
  }
}
```

---

## 🔐 Security Notes

- **Passwords** are hashed with `argon2id` — never stored in plain text
- **User and Admin tokens** use separate secrets — a user token will never work on admin routes
- **Suspended users** can't log in — they receive a `403` immediately
- **Error messages** never expose stack traces or internal details to the client
