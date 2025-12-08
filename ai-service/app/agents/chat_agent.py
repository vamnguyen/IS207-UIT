import re
from typing import Optional
from functools import lru_cache
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from app.config import get_settings
from app.database import get_mysql_client
from app.vectorstore import get_vectorstore


class ChatAgent:
    """LangChain-based chat agent for product consultation."""
    
    SYSTEM_PROMPT = """Bạn là trợ lý ảo của nền tảng cho thuê đồ ReRent. 
Nhiệm vụ của bạn là tư vấn, hỗ trợ khách hàng tìm sản phẩm phù hợp và trả lời các câu hỏi về đơn hàng.

Khi trả lời:
- Sử dụng tiếng Việt tự nhiên, thân thiện
- Trích dẫn thông tin sản phẩm cụ thể (tên, giá, danh mục)
- Nếu không tìm thấy sản phẩm phù hợp, gợi ý khách hàng mô tả chi tiết hơn
- Format giá tiền theo định dạng Việt Nam (ví dụ: 500.000₫)
- Khi nói về tồn kho, nếu stock > 0 là "còn hàng", nếu = 0 là "hết hàng"

Dữ liệu sản phẩm liên quan:
{context}

Lịch sử hội thoại:
{chat_history}
"""

    def __init__(self):
        self.settings = get_settings()
        self._llm = None
        self._chain = None
    
    def _get_llm(self):
        """Get or create LLM instance."""
        if self._llm is None:
            self._llm = ChatGoogleGenerativeAI(
                model="gemini-2.5-flash",
                google_api_key=self.settings.google_api_key,
                temperature=0.7,
                max_output_tokens=1024,
            )
        return self._llm
    
    def _get_chain(self):
        """Get or create the LangChain chain."""
        if self._chain is None:
            prompt = ChatPromptTemplate.from_messages([
                ("system", self.SYSTEM_PROMPT),
                ("human", "{question}")
            ])
            self._chain = prompt | self._get_llm() | StrOutputParser()
        return self._chain
    
    def _detect_intent(self, query: str) -> tuple[str, dict]:
        """Detect user intent from query."""
        query_lower = query.lower()
        
        # Check for order history
        if any(kw in query_lower for kw in ["đơn hàng", "lịch sử", "đã mua", "đã thuê", "order"]):
            return "order_history", {}
        
        # Check for order status with order ID
        order_match = re.search(r"(?:đơn|order)\s*#?\s*(\d+)", query_lower)
        if order_match:
            return "order_status", {"order_id": int(order_match.group(1))}
        
        # Check for best sellers
        if any(kw in query_lower for kw in ["bán chạy", "phổ biến", "best seller", "hot", "được thuê nhiều"]):
            return "best_sellers", {}
        
        # Check for stock inquiry
        stock_match = re.search(r"(?:tồn kho|còn hàng|còn không|stock)\s*(?:sản phẩm|sp)?\s*#?\s*(\d+)?", query_lower)
        if stock_match and stock_match.group(1):
            return "check_stock", {"product_id": int(stock_match.group(1))}
        
        # Default: product search/consultation
        return "product_search", {}
    
    def _format_price(self, price: float) -> str:
        """Format price in Vietnamese style."""
        return f"{price:,.0f}₫".replace(",", ".")
    
    def _build_order_history_context(self, user_id: int) -> str:
        """Build context for order history."""
        mysql_client = get_mysql_client()
        orders = mysql_client.get_user_orders(user_id)
        
        if not orders:
            return "Khách hàng chưa có đơn hàng nào."
        
        context_parts = ["Lịch sử đơn hàng gần đây của khách hàng:"]
        for order in orders:
            items_text = ", ".join([
                f"{item['product_name']} x{item['quantity']}"
                for item in order.get('items', [])
            ])
            context_parts.append(
                f"- Đơn #{order['id']}: {order['status']} | "
                f"Tổng: {self._format_price(float(order['total_amount']))} | "
                f"Sản phẩm: {items_text}"
            )
        return "\n".join(context_parts)
    
    def _build_order_status_context(self, order_id: int, user_id: int) -> str:
        """Build context for order status."""
        mysql_client = get_mysql_client()
        order = mysql_client.get_order_status(order_id, user_id)
        
        if not order:
            return f"Không tìm thấy đơn hàng #{order_id} trong hệ thống của khách hàng."
        
        return (
            f"Thông tin đơn hàng #{order['id']}:\n"
            f"- Trạng thái: {order['status']}\n"
            f"- Tổng tiền: {self._format_price(float(order['total_amount']))}\n"
            f"- Thời gian thuê: {order.get('start_date', 'N/A')} - {order.get('end_date', 'N/A')}\n"
            f"- Địa chỉ: {order.get('address', 'N/A')}"
        )
    
    def _build_best_sellers_context(self) -> str:
        """Build context for best sellers."""
        mysql_client = get_mysql_client()
        products = mysql_client.get_best_sellers(limit=5)
        
        if not products:
            return "Chưa có dữ liệu về sản phẩm được thuê nhiều."
        
        context_parts = ["Top sản phẩm được thuê nhiều nhất:"]
        for i, product in enumerate(products, 1):
            context_parts.append(
                f"{i}. {product['name']} - {self._format_price(float(product['price']))} "
                f"({int(product['total_rented'])} lượt thuê) | "
                f"Danh mục: {product.get('category_name', 'N/A')} | "
                f"Còn: {product['stock']} sản phẩm"
            )
        return "\n".join(context_parts)
    
    def _build_stock_context(self, product_id: int) -> str:
        """Build context for stock check."""
        mysql_client = get_mysql_client()
        product = mysql_client.check_product_stock(product_id)
        
        if not product:
            return f"Không tìm thấy sản phẩm #{product_id}."
        
        stock_status = "còn hàng" if product['stock'] > 0 else "hết hàng"
        return (
            f"Thông tin tồn kho sản phẩm #{product['id']}:\n"
            f"- Tên: {product['name']}\n"
            f"- Số lượng: {product['stock']} ({stock_status})\n"
            f"- Trạng thái: {product['status']}"
        )
    
    def _build_product_search_context(self, query: str) -> tuple[str, list[dict]]:
        """Build context for product search using vector similarity."""
        vectorstore = get_vectorstore()
        similar_products = vectorstore.search_similar(query, n_results=5)
        
        if not similar_products:
            return "Không tìm thấy sản phẩm liên quan trong hệ thống.", []
        
        context_parts = ["Các sản phẩm phù hợp với yêu cầu:"]
        for product in similar_products:
            context_parts.append(
                f"- {product['name']} | Giá: {self._format_price(product['price'])} | "
                f"Danh mục: {product.get('category', 'N/A')} | "
                f"Còn: {product['stock']} sản phẩm"
            )
        
        return "\n".join(context_parts), similar_products
    
    def chat(
        self,
        query: str,
        user_id: Optional[int] = None,
        conversation_history: Optional[list[dict]] = None
    ) -> dict:
        """Process a chat message and return response."""
        
        # Detect intent
        intent, intent_data = self._detect_intent(query)
        
        # Build context based on intent
        sources = []
        if intent == "order_history" and user_id:
            context = self._build_order_history_context(user_id)
        elif intent == "order_status" and user_id:
            context = self._build_order_status_context(
                intent_data["order_id"], user_id
            )
        elif intent == "best_sellers":
            context = self._build_best_sellers_context()
        elif intent == "check_stock":
            context = self._build_stock_context(intent_data["product_id"])
        else:
            context, sources = self._build_product_search_context(query)
        
        # Format conversation history
        chat_history = ""
        if conversation_history:
            for msg in conversation_history[-5:]:  # Last 5 messages
                role = "Khách" if msg.get("role") == "user" else "Bot"
                chat_history += f"{role}: {msg.get('content', '')}\n"
        
        # Run chain
        chain = self._get_chain()
        answer = chain.invoke({
            "context": context,
            "chat_history": chat_history or "Chưa có hội thoại trước đó.",
            "question": query
        })
        
        return {
            "answer": answer,
            "sources": [
                {
                    "product_id": s["product_id"],
                    "name": s["name"],
                    "price": s["price"],
                    "category": s.get("category")
                }
                for s in sources
            ],
            "metadata": {
                "intent": intent,
                "user_id": user_id
            }
        }


@lru_cache()
def get_chat_agent() -> ChatAgent:
    """Get cached ChatAgent instance."""
    return ChatAgent()
