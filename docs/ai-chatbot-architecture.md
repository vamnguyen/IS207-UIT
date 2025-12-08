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

## Intent Detection

AI Service tự động phát hiện ý định người dùng:

| Intent           | Trigger Keywords          | Data Source            |
| ---------------- | ------------------------- | ---------------------- |
| `product_search` | (default)                 | ChromaDB Vector Search |
| `order_history`  | "đơn hàng", "lịch sử mua" | MySQL Orders           |
| `order_status`   | "đơn #123", "trạng thái"  | MySQL Orders           |
| `best_sellers`   | "bán chạy", "phổ biến"    | MySQL Aggregation      |
| `check_stock`    | "tồn kho", "còn hàng"     | MySQL Products         |

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
