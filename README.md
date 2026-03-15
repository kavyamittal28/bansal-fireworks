# Bansal Fireworks

A full-stack e-commerce catalog for browsing and managing fireworks products. Built with **React + Vite** on the frontend and **FastAPI + MongoDB** on the backend, with **Cloudinary** for image storage.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Pages & Routes](#pages--routes)
- [API Reference](#api-reference)
- [Local Development](#local-development)
- [Environment Variables](#environment-variables)
- [Admin Setup](#admin-setup)
- [Deployment](#deployment)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 7, Tailwind CSS 4, React Router 7 |
| Backend | FastAPI, Uvicorn |
| Database | MongoDB (via Motor async driver) |
| Auth | JWT (PyJWT) + bcrypt |
| Image Storage | Cloudinary |
| Deployment | Vercel (frontend), Railway / Render / Fly.io (backend) |

---

## Project Structure

```
bansal-fireworks/
├── src/                          # React frontend
│   ├── App.jsx                   # Route definitions
│   ├── main.jsx                  # Entry point
│   ├── index.css                 # Global styles
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── ScrollToTop.jsx
│   └── pages/
│       ├── HomePage.jsx
│       ├── ProductsPage.jsx
│       ├── ProductDetailPage.jsx
│       ├── AboutPage.jsx
│       ├── ContactPage.jsx
│       ├── AdminLoginPage.jsx
│       ├── AdminAddProductPage.jsx
│       └── NotFoundPage.jsx
├── backend/                      # Python backend
│   ├── app/
│   │   ├── main.py               # FastAPI app, CORS, lifespan
│   │   ├── config.py             # Environment settings
│   │   ├── database.py           # Motor MongoDB connection
│   │   ├── cloudinary_config.py  # Cloudinary init
│   │   ├── middleware/
│   │   │   └── auth.py           # JWT Bearer dependency
│   │   ├── models/               # Pydantic data models
│   │   ├── schemas/              # Request/response schemas
│   │   ├── routers/              # Auth, products, brands, categories
│   │   └── utils/
│   │       └── cloudinary.py     # Async upload/delete helpers
│   ├── seed_admin.py             # Create first admin + DB indexes
│   ├── create_user.py            # Create a specific user by user_id
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
├── public/
├── index.html
├── vite.config.js                # Vite config + /api proxy
├── vercel.json                   # Vercel SPA rewrite rules
└── package.json
```

---

## Pages & Routes

### Public

| Route | Page | Description |
|-------|------|-------------|
| `/` | HomePage | Landing page with hero and featured products |
| `/products` | ProductsPage | Full catalog with brand/category filters and sort |
| `/products/:id` | ProductDetailPage | Product detail with image gallery and tabs |
| `/about` | AboutPage | Company information |
| `/contact` | ContactPage | Bulk order inquiry form |
| `*` | NotFoundPage | 404 fallback |

### Admin (full-screen, no shared header/footer)

| Route | Page | Description |
|-------|------|-------------|
| `/admin/login` | AdminLoginPage | JWT-authenticated admin login |
| `/admin/add-product` | AdminAddProductPage | Add new product with image uploads |

---

## API Reference

All endpoints are prefixed with `/api`. Interactive docs available at `/api/docs` (Swagger) and `/api/redoc` (ReDoc) when the backend is running.

### Auth

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/login` | — | Login, returns `{ token }` |
| POST | `/api/admin/login` | — | Alias used by the frontend |

**Request body:**
```json
{ "email": "admin@example.com", "password": "YourPassword" }
```

**Response:**
```json
{ "token": "<jwt>", "token_type": "bearer" }
```

---

### Products

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/products` | — | List products (filterable) |
| POST | `/api/products` | JWT | Create product (multipart/form-data) |
| POST | `/api/admin/products` | JWT | Alias used by the frontend |
| GET | `/api/products/:id` | — | Get single product |
| PUT | `/api/products/:id` | JWT | Update product (appends new images) |
| DELETE | `/api/products/:id` | JWT | Delete product + Cloudinary assets |

**GET /api/products query params:**

| Param | Type | Description |
|-------|------|-------------|
| `category` | string | Filter by category name |
| `brand` | string | Filter by brand name |
| `bestseller` | bool | Filter bestsellers only |
| `eco_friendly` | bool | Filter eco-friendly only |
| `skip` | int | Pagination offset (default: 0) |
| `limit` | int | Page size (default: 50) |

**POST /api/products form fields:**

| Field | Type | Required |
|-------|------|----------|
| `name` | string | Yes |
| `category` | string | Yes |
| `brand` | string | Yes |
| `price` | float | Yes |
| `description` | string | No |
| `ecoFriendly` | string (`"true"`/`"false"`) | No |
| `bestseller` | string (`"true"`/`"false"`) | No |
| `images` | file(s) | No |

---

### Brands

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/brands` | — | List all active brands |
| POST | `/api/brands` | JWT | Create brand |
| GET | `/api/brands/:id` | — | Get brand by ID |
| PUT | `/api/brands/:id` | JWT | Update brand |
| DELETE | `/api/brands/:id` | JWT | Delete brand |

---

### Categories

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/categories` | — | List all active categories |
| POST | `/api/categories` | JWT | Create category |
| GET | `/api/categories/:id` | — | Get category by ID |
| PUT | `/api/categories/:id` | JWT | Update category |
| DELETE | `/api/categories/:id` | JWT | Delete category |

---

### Health

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Returns `{ "status": "ok" }` |

---

## Local Development

### Prerequisites

- Node.js 18+
- Python 3.10+
- A MongoDB database (Atlas free tier works)
- A Cloudinary account (free tier works)

---

### 1. Clone and install frontend dependencies

```bash
git clone <repository-url>
cd bansal-fireworks
npm install
```

---

### 2. Set up the backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

---

### 3. Configure environment variables

```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your credentials (see Environment Variables below)
```

---

### 4. Seed the admin user and create DB indexes

```bash
cd backend
python seed_admin.py --email admin@bansalfireworks.com --password YourStrongPassword
```

To create a user with a specific user ID:

```bash
python create_user.py
```

---

### 5. Start the backend

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

Backend will be available at `http://localhost:8000`
API docs at `http://localhost:8000/api/docs`

---

### 6. Start the frontend

```bash
# from project root
npm run dev
```

Frontend will be available at `http://localhost:5173`

The Vite dev server automatically proxies all `/api/*` requests to `http://localhost:8000`, so no CORS issues in local development.

---

## Environment Variables

Create `backend/.env` based on `backend/.env.example`:

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URL` | MongoDB connection string | `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/` |
| `DB_NAME` | Database name | `bansal_fireworks` |
| `JWT_SECRET` | Secret key for signing JWTs (min 32 chars) | `a_very_long_random_secret_string` |
| `JWT_ALGORITHM` | JWT signing algorithm | `HS256` |
| `JWT_EXPIRE_MINUTES` | Token lifetime in minutes | `1440` (24 hours) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `your_api_secret` |
| `ALLOWED_ORIGINS` | Comma-separated allowed CORS origins | `http://localhost:5173,https://yourdomain.com` |
| `APP_ENV` | Environment name | `development` or `production` |

---

## Admin Setup

### Creating the first admin user

```bash
cd backend
python seed_admin.py --email admin@bansalfireworks.com --password YourStrongPassword
```

### Re-creating indexes only (without adding a user)

```bash
python seed_admin.py --email x@x.com --password x --indexes-only
```

### MongoDB indexes created automatically

| Collection | Index | Type |
|------------|-------|------|
| `users` | `email` | Unique |
| `users` | `user_id` | Unique |
| `brands` | `slug` | Unique |
| `categories` | `slug` | Unique |
| `products` | `category` | — |
| `products` | `brand` | — |
| `products` | `created_at` | Descending |

---

## Deployment

### Frontend — Vercel

The `vercel.json` at the project root rewrites all routes to `index.html` for client-side routing to work correctly.

```bash
# from project root
vercel deploy
```

Set `VITE_API_URL` if your backend is on a separate domain and update the `fetch()` calls accordingly.

### Backend — Railway / Render / Fly.io

Deploy the `backend/` directory. Set all environment variables from the table above as platform secrets.

Start command:
```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

---

## License

All rights reserved © Bansal Fireworks
