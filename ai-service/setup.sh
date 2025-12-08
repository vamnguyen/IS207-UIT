#!/bin/bash

# AI Service Setup Script
# Run this script to set up the development environment

set -e

echo "🚀 Setting up AI Service..."

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
else
    echo "✅ Virtual environment already exists"
fi

# Activate virtual environment
echo "🔄 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Copy .env if not exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env from .env.example..."
    cp .env.example .env
    echo "⚠️  Please edit .env with your credentials"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "To activate the environment, run:"
echo "  source venv/bin/activate"
echo ""
echo "To start the server, run:"
echo "  uvicorn app.main:app --reload --port 8001"
echo ""
echo "To sync products from database, run:"
echo "  curl -X POST http://localhost:8001/sync"
