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
