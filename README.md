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
| Deployment | Vercel (frontend), Render (backend) |

---

## Project Structure

```
bansal-fireworks/
├── client/                          # React frontend
│   ├── index.html
│   ├── vite.config.js               # Vite config + /api proxy
│   ├── vercel.json                  # Vercel rewrite rules
│   ├── package.json
│   ├── public/
│   │   ├── Logo.png
│   │   └── placeholder.png          # Default product image
│   └── src/
│       ├── App.jsx                  # Route definitions
│       ├── main.jsx                 # Entry point
│       ├── index.css                # Global styles
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   ├── AdminLayout.jsx
│       │   ├── ProtectedRoute.jsx
│       │   └── ScrollToTop.jsx
│       └── pages/
│           ├── HomePage.jsx
│           ├── ProductsPage.jsx
│           ├── ProductDetailPage.jsx
│           ├── AboutPage.jsx
│           ├── ContactPage.jsx
│           ├── AdminLoginPage.jsx
│           ├── AdminDashboardPage.jsx
│           ├── AdminAddProductPage.jsx
│           ├── AdminEditProductPage.jsx
│           ├── AdminInquiriesPage.jsx
│           ├── AdminCatalogPage.jsx
│           ├── AdminSettingsPage.jsx
│           └── NotFoundPage.jsx
├── backend/
│   ├── main.py                      # FastAPI app, CORS, lifespan
│   ├── config.py                    # Environment settings
│   ├── database.py                  # Motor MongoDB connection
│   ├── cloudinary_config.py         # Cloudinary init
│   ├── middleware/
│   │   └── auth.py                  # JWT Bearer dependency
│   ├── models/                      # Pydantic data models
│   ├── schemas/                     # Request/response schemas
│   ├── routers/
│   │   ├── auth.py                  # Login endpoints
│   │   ├── products.py              # Product CRUD
│   │   ├── brands.py                # Brand CRUD
│   │   ├── categories.py            # Category CRUD
│   │   └── contact.py               # Inquiry endpoints
│   ├── utils/
│   │   ├── __init__.py              # Async Cloudinary upload/delete
│   │   └── media.py                 # Re-exports for convenience
│   ├── seed_admin.py                # Create first admin + DB indexes
│   ├── create_user.py               # Create a specific user
│   ├── requirements.txt
│   └── .env.example
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
| `/contact` | ContactPage | Inquiry form |
| `*` | NotFoundPage | 404 fallback |

### Admin (protected, requires JWT)

| Route | Page | Description |
|-------|------|-------------|
| `/admin/login` | AdminLoginPage | Admin login |
| `/admin/dashboard` | AdminDashboardPage | Product list with toggle/delete |
| `/admin/add-product` | AdminAddProductPage | Add new product with image uploads |
| `/admin/edit-product/:id` | AdminEditProductPage | Edit existing product |
| `/admin/catalog` | AdminCatalogPage | Manage brands and categories |
| `/admin/inquiries` | AdminInquiriesPage | View/manage customer inquiries |
| `/admin/settings` | AdminSettingsPage | Admin settings |

---

## API Reference

All endpoints are prefixed with `/api`. Interactive docs at `/api/docs` (Swagger) and `/api/redoc` (ReDoc) when the backend is running.

### Auth

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/login` | — | Login, returns `{ token }` |
| POST | `/api/admin/login` | — | Alias used by the frontend |

### Products

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/get-products` | — | List active products (filterable) |
| GET | `/api/get-product/:id` | — | Get single product |
| GET | `/api/admin/get-products` | JWT | List all products (including inactive) |
| POST | `/api/admin/add-product` | JWT | Create product (multipart/form-data) |
| PUT | `/api/update-product/:id` | JWT | Update product (appends new images) |
| PATCH | `/api/admin/toggle-product/:id` | JWT | Toggle product active/inactive |
| DELETE | `/api/delete-product/:id` | JWT | Delete product + Cloudinary assets |

### Inquiries

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/add-inquiry` | — | Submit contact inquiry |
| GET | `/api/get-inquiries` | JWT | List all inquiries |
| PATCH | `/api/toggle-inquiry/:id` | JWT | Toggle read/unread status |
| DELETE | `/api/delete-inquiry/:id` | JWT | Delete inquiry |

### Brands

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/brands` | — | List all active brands |
| POST | `/api/brands` | JWT | Create brand |
| GET | `/api/brands/:id` | — | Get brand by ID |
| PUT | `/api/brands/:id` | JWT | Update brand |
| DELETE | `/api/brands/:id` | JWT | Delete brand |

### Categories

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/categories` | — | List all active categories |
| POST | `/api/categories` | JWT | Create category |
| GET | `/api/categories/:id` | — | Get category by ID |
| PUT | `/api/categories/:id` | JWT | Update category |
| DELETE | `/api/categories/:id` | JWT | Delete category |

### Health

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Returns service status, DB connectivity, uptime |

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
cd bansal-fireworks/client
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

---

### 5. Start the backend

```bash
cd backend
source .venv/bin/activate
uvicorn main:app --reload --port 8011
```

Backend will be available at `http://localhost:8011`
API docs at `http://localhost:8011/api/docs`

---

### 6. Start the frontend

```bash
cd client
npm run dev
```

Frontend will be available at `http://localhost:5173`

The Vite dev server automatically proxies all `/api/*` requests to `http://localhost:8011`, so no CORS issues in local development.

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
source .venv/bin/activate
python seed_admin.py --email admin@bansalfireworks.com --password YourStrongPassword
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

The `client/vercel.json` rewrites `/api/*` to the Render backend and all other routes to `index.html` for SPA routing.

### Backend — Render

Deploy the `backend/` directory. Set all environment variables from the table above as platform secrets.

Start command:
```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

---

## License

All rights reserved © Bansal Fireworks
