# AI Chatbot Service - Architecture Overview

## Kiến trúc hệ thống

Hệ thống chatbot AI sử dụng kiến trúc **RAG (Retrieval-Augmented Generation)** với FastAPI + LangChain + ChromaDB để tư vấn sản phẩm cho thuê.

```mermaid
flowchart TB
    subgraph Client["🖥️ End-User Frontend"]
        A[Chat Widget]
    end

    subgraph Laravel["⚙️ Laravel Backend (Docker)"]
        B[ChatController]
        C[AIServiceClient]
    end

    subgraph AIService["🤖 AI Service (Python)"]
        D[FastAPI Server<br/>Port 8001]
        E[LangChain ChatAgent]
        F[Intent Detection]
        G[RAG Pipeline]
    end

    subgraph VectorDB["📦 Vector Database"]
        H[ChromaDB]
        I[Product Embeddings]
    end

    subgraph MySQL["🗄️ MySQL Database"]
        J[(Products)]
        K[(Orders)]
        L[(Categories)]
    end

    subgraph LLM["🧠 LLM Provider"]
        M[Google Gemini API]
    end

    A -->|"POST /api/chat"| B
    B --> C
    C -->|"POST /ask"| D
    D --> E
    E --> F
    F -->|"Product Search"| G
    F -->|"Order History"| J
    F -->|"Best Sellers"| J
    G --> H
    H --> I
    G --> M
    M -->|"Generated Response"| E
    E -->|"JSON Response"| C
    C --> B
    B -->|"Stream Response"| A

    J -->|"POST /sync"| H
```

---

## Luồng xử lý Chat

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend
    participant LC as Laravel Controller
    participant AI as AI Service
    participant CA as Chat Agent
    participant VDB as ChromaDB
    participant LLM as Gemini

    U->>FE: Nhập câu hỏi
    FE->>LC: POST /api/chat/assistant
    LC->>AI: POST /ask {query, user_id}
    AI->>CA: process(query)
    CA->>CA: Detect Intent

    alt Product Search
        CA->>VDB: Similarity Search
        VDB-->>CA: Related Products
    else Order Query
        CA->>CA: Query MySQL directly
    end

    CA->>LLM: Generate Response
    LLM-->>CA: AI Response
    CA-->>AI: {answer, sources}
    AI-->>LC: JSON Response
    LC-->>FE: Stream Response
    FE-->>U: Hiển thị câu trả lời
```

---

## Các thành phần chính

| Component  | Technology      | Port | Description          |
| ---------- | --------------- | ---- | -------------------- |
| Frontend   | Next.js         | 3000 | Chat UI cho end-user |
| Backend    | Laravel + Nginx | 8000 | API Gateway, Auth    |
| AI Service | FastAPI         | 8001 | LangChain + RAG      |
| Vector DB  | ChromaDB        | -    | Product embeddings   |
| Database   | MySQL           | 3306 | Products, Orders     |
| LLM        | Google Gemini   | -    | Text generation      |

---

## Chat Agent Modes

AI Service hỗ trợ 2 chế độ xử lý chat:

### 1. Smart Agent (Text-to-SQL) - Mặc định

**Cách hoạt động:** LLM tự động quyết định chiến lược xử lý dựa trên câu hỏi.

```mermaid
flowchart LR
    A[User Query] --> B[LLM Router]
    B -->|"SQL needed"| C[Generate SQL]
    B -->|"Semantic search"| D[Vector Search]
    B -->|"General chat"| E[Direct Answer]
    C --> F[Execute on MySQL]
    D --> G[ChromaDB]
    F --> H[LLM Answer]
    G --> H
    E --> H
```

**Ưu điểm:**

- Linh hoạt, không cần code thêm cho query mới
- Xử lý được các câu hỏi phức tạp (filter, aggregate, sort)
- LLM hiểu ngữ cảnh tốt hơn regex

**Ví dụ queries được hỗ trợ tự động:**

- "Sản phẩm đắt nhất là gì?" → SQL: `ORDER BY price DESC LIMIT 1`
- "Có bao nhiêu sản phẩm?" → SQL: `SELECT COUNT(*)`
- "Sản phẩm giá từ 100k đến 500k" → SQL: `WHERE price BETWEEN ...`
- "Sản phẩm thuộc danh mục Âm thanh" → SQL: `JOIN categories`

### 2. Rule-based Agent (Legacy)

**Cách hoạt động:** Dùng regex để detect intent, sau đó gọi function tương ứng.

| Intent           | Trigger Keywords          | Data Source            |
| ---------------- | ------------------------- | ---------------------- |
| `product_search` | (default)                 | ChromaDB Vector Search |
| `order_history`  | "đơn hàng", "lịch sử mua" | MySQL Orders           |
| `order_status`   | "đơn #123", "trạng thái"  | MySQL Orders           |
| `best_sellers`   | "bán chạy", "phổ biến"    | MySQL Aggregation      |
| `check_stock`    | "tồn kho", "còn hàng"     | MySQL Products         |
| `most_expensive` | "đắt nhất", "giá cao"     | MySQL ORDER BY price   |
| `cheapest`       | "rẻ nhất", "giá thấp"     | MySQL ORDER BY price   |

**Ưu điểm:**

- Nhanh hơn (1 LLM call thay vì 2)
- Không tốn token cho routing

### API Request

```json
{
  "query": "Sản phẩm đắt nhất là gì?",
  "user_id": 123,
  "use_smart_agent": true // true = Text-to-SQL, false = Rule-based
}
```

---

## Data Sync Flow

```mermaid
flowchart LR
    A[(MySQL Products)] -->|"POST /sync"| B[AI Service]
    B --> C[Fetch Products]
    C --> D[Create Embeddings]
    D --> E[Store in ChromaDB]
    E --> F[Ready for RAG]
```
