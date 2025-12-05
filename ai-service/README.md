# AI Chatbot Service - ReRent

AI service sử dụng FastAPI + LangChain + ChromaDB để tư vấn sản phẩm cho thuê.

## Local Development (venv)

```bash
# 1. Setup environment
chmod +x setup.sh
./setup.sh

# 2. Activate venv (every new terminal)
source venv/bin/activate

# 3. Configure .env
# Edit .env with your GOOGLE_API_KEY and MySQL credentials

# 4. Start server
uvicorn app.main:app --reload --port 8001

# 5. Sync products to vector DB
curl -X POST http://localhost:8001/sync
```

## Docker (for production)

```bash
# Build and run
docker-compose up -d

# Sync products
curl -X POST http://localhost:8001/sync
```

## API Endpoints

| Endpoint  | Method | Description                     |
| --------- | ------ | ------------------------------- |
| `/ask`    | POST   | Chat với AI về sản phẩm         |
| `/sync`   | POST   | Sync data từ MySQL vào ChromaDB |
| `/health` | GET    | Health check                    |
| `/stats`  | GET    | Vector store statistics         |

## Environment Variables

```env
# Required
GOOGLE_API_KEY=your-google-api-key

# MySQL
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=matcha_db
MYSQL_USER=root
MYSQL_PASSWORD=password

# Optional
CHROMA_PERSIST_DIRECTORY=./chroma_data
HOST=0.0.0.0
PORT=8001
```

## Production Deployment

For production deployment as a separate server:

1. Use Docker: `docker-compose up -d`
2. Or deploy to cloud (AWS EC2, GCP, Railway, Fly.io, etc.)
3. Update Laravel's `AI_SERVICE_URL` to point to production URL

---

## Deploy to Render.com

### Step 1: Push to GitHub

```bash
git add ai-service/
git commit -m "Add AI service"
git push
```

### Step 2: Create Render Web Service

1. Go to [render.com](https://render.com) → **New** → **Web Service**
2. Connect your GitHub repo
3. Set **Root Directory**: `ai-service`
4. Render will auto-detect `Dockerfile`

### Step 3: Configure Environment Variables

In Render Dashboard → Environment:

| Key                        | Value                      |
| -------------------------- | -------------------------- |
| `GOOGLE_API_KEY`           | Your Gemini API key        |
| `MYSQL_HOST`               | Your production MySQL host |
| `MYSQL_PORT`               | 3306                       |
| `MYSQL_DATABASE`           | matcha_db                  |
| `MYSQL_USER`               | your_user                  |
| `MYSQL_PASSWORD`           | your_password              |
| `CHROMA_PERSIST_DIRECTORY` | /app/chroma_data           |

### Step 4: Update Laravel Backend

After deploy, you'll get URL like `https://rerent-ai-service.onrender.com`

Update Laravel `.env`:

```env
AI_SERVICE_URL=https://rerent-ai-service.onrender.com
```

### Step 5: Sync Products

```bash
curl -X POST https://rerent-ai-service.onrender.com/sync
```

> **Note**: Render free tier will spin down after 15 minutes of inactivity. First request may take ~30s to wake up.
