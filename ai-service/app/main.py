from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from app.config import get_settings
from app.schemas import (
    ChatRequest, ChatResponse, ProductSource,
    SyncResponse, HealthResponse
)
from app.database import get_mysql_client
from app.vectorstore import get_vectorstore
from app.agents import get_chat_agent
from app.agents.smart_agent import get_smart_agent

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    logger.info("Starting AI Service...")
    
    # Initialize components
    settings = get_settings()
    logger.info(f"ChromaDB persist directory: {settings.chroma_persist_directory}")
    
    yield
    
    logger.info("Shutting down AI Service...")


app = FastAPI(
    title="ReRent AI Chatbot Service",
    description="AI-powered product consultation chatbot using LangChain + RAG",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint."""
    mysql_client = get_mysql_client()
    vectorstore = get_vectorstore()
    
    db_connected = mysql_client.test_connection()
    vs_ready = vectorstore.is_ready()
    
    status = "healthy" if (db_connected and vs_ready) else "degraded"
    
    return HealthResponse(
        status=status,
        database_connected=db_connected,
        vectorstore_ready=vs_ready
    )


@app.post("/sync", response_model=SyncResponse)
async def sync_products():
    """Sync products from MySQL to ChromaDB vector store."""
    try:
        vectorstore = get_vectorstore()
        count = vectorstore.sync_products()
        
        logger.info(f"Synced {count} products to vector store")
        
        return SyncResponse(
            success=True,
            message=f"Successfully synced {count} products to vector store",
            products_synced=count
        )
    except Exception as e:
        logger.error(f"Sync failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to sync products: {str(e)}"
        )


@app.post("/ask", response_model=ChatResponse)
async def ask(request: ChatRequest):
    """
    Chat with AI about products and orders.
    
    Set use_smart_agent=True (default) for Text-to-SQL approach (more flexible).
    Set use_smart_agent=False for rule-based intent detection (faster but limited).
    """
    try:
        # Choose agent based on request
        if request.use_smart_agent:
            agent = get_smart_agent()
        else:
            agent = get_chat_agent()
        
        result = agent.chat(
            query=request.query,
            user_id=request.user_id,
            conversation_history=request.conversation_history
        )
        
        sources = [
            ProductSource(
                product_id=s["product_id"],
                name=s["name"],
                price=s["price"],
                category=s.get("category")
            )
            for s in result.get("sources", [])
        ]
        
        return ChatResponse(
            answer=result["answer"],
            sources=sources,
            metadata=result.get("metadata")
        )
    except Exception as e:
        logger.error(f"Chat failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process chat: {str(e)}"
        )


@app.get("/stats")
async def get_stats():
    """Get vector store statistics."""
    vectorstore = get_vectorstore()
    mysql_client = get_mysql_client()
    
    return {
        "vectorstore_products": vectorstore.get_product_count(),
        "database_connected": mysql_client.test_connection()
    }


@app.get("/debug/db")
async def debug_database():
    """Debug endpoint to check database content."""
    mysql_client = get_mysql_client()
    
    try:
        conn = mysql_client._get_connection()
        with conn.cursor() as cursor:
            # Count total products
            cursor.execute("SELECT COUNT(*) as total FROM products")
            total = cursor.fetchone()
            
            # Get distinct statuses
            cursor.execute("SELECT status, COUNT(*) as cnt FROM products GROUP BY status")
            statuses = cursor.fetchall()
            
            # Sample a few products
            cursor.execute("SELECT id, name, status FROM products LIMIT 5")
            samples = cursor.fetchall()
            
            return {
                "total_products": total["total"] if total else 0,
                "status_breakdown": statuses,
                "sample_products": samples
            }
    except Exception as e:
        return {"error": str(e)}


if __name__ == "__main__":
    import uvicorn
    settings = get_settings()
    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=True
    )
