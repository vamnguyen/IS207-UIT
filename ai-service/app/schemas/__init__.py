from pydantic import BaseModel
from typing import Optional


class ChatRequest(BaseModel):
    """Request model for chat endpoint."""
    query: str
    user_id: Optional[int] = None
    conversation_history: Optional[list[dict]] = None
    use_smart_agent: bool = True  # Use Text-to-SQL agent by default


class ProductSource(BaseModel):
    """Product information returned as source."""
    product_id: int
    name: str
    price: float
    category: Optional[str] = None


class ChatResponse(BaseModel):
    """Response model for chat endpoint."""
    answer: str
    sources: list[ProductSource] = []
    metadata: Optional[dict] = None


class SyncResponse(BaseModel):
    """Response model for sync endpoint."""
    success: bool
    message: str
    products_synced: int = 0


class HealthResponse(BaseModel):
    """Response model for health check."""
    status: str
    database_connected: bool
    vectorstore_ready: bool
