FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Pre-download ChromaDB ONNX model to avoid runtime download
RUN python -c "from chromadb.utils import embedding_functions; ef = embedding_functions.DefaultEmbeddingFunction(); ef(['test'])"

# Copy application code
COPY . .

# Create directory for ChromaDB data
RUN mkdir -p /app/chroma_data

# Expose port (Render uses PORT env variable)
EXPOSE 8001

# Use PORT from environment (Render requirement)
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8001}
