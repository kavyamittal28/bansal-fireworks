# Bansal Fireworks — Python Backend

FastAPI + Motor (async MongoDB) + Cloudinary

## Quick Start

### 1. Install dependencies

```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, and Cloudinary credentials
```

### 3. Seed the first admin user

```bash
python seed_admin.py --email admin@bansalfireworks.com --password YourStrongPassword
```

This also creates all recommended MongoDB indexes automatically.

### 4. Run the development server

```bash
uvicorn app.main:app --reload --port 8000
```

### 5. API documentation

- Swagger UI: http://localhost:8000/api/docs
- ReDoc:       http://localhost:8000/api/redoc
- Health:      http://localhost:8000/api/health

---

## API Routes

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/login` | — | Login (primary) |
| POST | `/api/admin/login` | — | Login (frontend alias) |
| GET | `/api/products` | — | List products (supports `?category`, `?brand`, `?bestseller`, `?skip`, `?limit`) |
| POST | `/api/products` | JWT | Create product (multipart/form-data) |
| POST | `/api/admin/products` | JWT | Create product (frontend alias) |
| GET | `/api/products/:id` | — | Get single product |
| PUT | `/api/products/:id` | JWT | Update product (appends new images) |
| DELETE | `/api/products/:id` | JWT | Delete product + Cloudinary assets |
| GET | `/api/brands` | — | List brands |
| POST | `/api/brands` | JWT | Create brand |
| GET | `/api/brands/:id` | — | Get brand |
| PUT | `/api/brands/:id` | JWT | Update brand |
| DELETE | `/api/brands/:id` | JWT | Delete brand |
| GET | `/api/categories` | — | List categories |
| POST | `/api/categories` | JWT | Create category |
| GET | `/api/categories/:id` | — | Get category |
| PUT | `/api/categories/:id` | JWT | Update category |
| DELETE | `/api/categories/:id` | JWT | Delete category |

---

## Example Requests

### Login

```bash
curl -X POST http://localhost:8000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@bansalfireworks.com", "password": "YourStrongPassword"}'
```

Response:
```json
{ "token": "<jwt>", "token_type": "bearer" }
```

### Create Product (with images)

```bash
curl -X POST http://localhost:8000/api/products \
  -H "Authorization: Bearer <token>" \
  -F "name=Sky Sparklers" \
  -F "category=Sparklers" \
  -F "brand=Standard Fireworks" \
  -F "price=299" \
  -F "description=Premium sparklers" \
  -F "ecoFriendly=true" \
  -F "bestseller=false" \
  -F "images=@/path/to/image.jpg"
```

### Create Brand

```bash
curl -X POST http://localhost:8000/api/brands \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Standard Fireworks", "slug": "standard-fireworks"}'
```

### List Products (filtered)

```bash
curl "http://localhost:8000/api/products?category=Sparklers&bestseller=true"
```

### Delete Product

```bash
curl -X DELETE http://localhost:8000/api/products/<product_id> \
  -H "Authorization: Bearer <token>"
```

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGODB_URL` | MongoDB connection string (Atlas or local) |
| `DB_NAME` | Database name (default: `bansal_fireworks`) |
| `JWT_SECRET` | Secret key for signing JWTs (min 32 chars) |
| `JWT_ALGORITHM` | JWT algorithm (default: `HS256`) |
| `JWT_EXPIRE_MINUTES` | Token expiry in minutes (default: `1440` = 24h) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins |

---

## MongoDB Indexes

Created automatically by `seed_admin.py`:

```
users.email          (unique)
brands.slug          (unique)
categories.slug      (unique)
products.category
products.brand
products.created_at  (descending)
```

To recreate indexes only (without adding a user):

```bash
python seed_admin.py --email x@x.com --password x --indexes-only
```

---

## Production Deployment

Deploy on **Railway**, **Render**, or **Fly.io**. Set all `.env` variables as platform secrets.

The Vite frontend's `vite.config.js` already has the dev proxy configured (`/api` → `localhost:8000`). For production, set the backend URL as an environment variable and update the frontend fetch calls, or deploy both behind a reverse proxy (e.g., nginx) that routes `/api/*` to the backend.
