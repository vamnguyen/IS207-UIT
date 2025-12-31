<p align="center">
  <a href="https://www.uit.edu.vn/" title="Trường Đại học Công nghệ Thông tin" style="border: 5;">
    <img src="https://i.imgur.com/WmMnSRt.png" alt="Trường Đại học Công nghệ Thông tin | University of Information Technology">
  </a>
</p>

<!-- Title -->
<h1 align="center"><b>IS207 - E-COMMERCE RENTAL PLATFORM</b></h1>

## 📖 Introduction

A C2C E-commerce platform for renting items, built with a modern tech stack focusing on AI integration and Microservices architecture.

**Key Features:**

- **User Platform**: Search, rent, and list items.
- **Shop Management**: Manage inventory, orders, and revenue.
- **Admin Dashboard**: System oversight and user management.
- **AI Service**: RAG-based Chatbot & Recommendation System.

---

## 🏗 System Architecture

| Component      | Technology       | Directory     | Description                                      |
| :------------- | :--------------- | :------------ | :----------------------------------------------- |
| **Backend**    | Laravel 12 (API) | `/backend`    | Core REST API, Authentication, Business Logic.   |
| **AI Service** | Python (FastAPI) | `/ai-service` | LLM integration (Gemini), ChromaDB Vector Store. |
| **End User**   | Next.js 15       | `/end-user`   | Customer facing storefront.                      |
| **Shop**       | Next.js 15       | `/shop`       | Vendor dashboard for product/order management.   |
| **Admin**      | Next.js 15       | `/admin`      | Administrator dashboard.                         |

---

## 🚀 Getting Started

### Prerequisites

- **Docker Desktop** (Recommended for easiest setup)
- OR Manual Setup:
  - **PHP** >= 8.2 & Composer
  - **Node.js** >= 20 & npm
  - **Python** >= 3.10
  - **MySQL** or **SQLite**

---

### 🐳 Docker Setup (Recommended)

You can run the Backend and AI Service using Docker.

#### 1. Backend (Laravel)

```bash
cd backend
cp .env.example .env
# Update .env configuration if needed
docker-compose up -d --build
docker-compose exec app php artisan key:generate
docker-compose exec app php artisan migrate --seed
```

_Backend will be available at: http://localhost:8000_

#### 2. AI Service

```bash
cd ai-service
cp .env.example .env
# Add GOOGLE_API_KEY in .env
docker-compose up -d --build
```

_AI Service will be available at: http://localhost:8001_

---

### 💻 Manual Installation Guide

#### 1. Backend Setup

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
# Configure DB in .env then run:
php artisan migrate --seed
php artisan serve
```

#### 2. AI Service Setup

```bash
cd ai-service
# Using setup script (Mac/Linux)
chmod +x setup.sh
./setup.sh
# OR Manual
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

#### 3. Frontend Applications

Repeat these steps for `end-user`, `shop`, and `admin` directories:

**End User App** (Port 3000):

```bash
cd end-user
npm install
npm run dev
```

**Shop App** (Port 3001 - Check package.json scripts or next.config.ts if port differs, otherwise it may auto-assign):

```bash
cd shop
npm install
npm run dev
```

**Admin App** (Port 3002 - Check configuration):

```bash
cd admin
npm install
npm run dev
```

---

## 📊 Performance Testing (k6)

We use **k6** (integrated with InfluxDB & Grafana) to stress test the API.

### Option 1: Run with Docker (Recommended)

This method sets up the full monitoring stack (k6, InfluxDB, Grafana).

1.  **Navigate to testing directory**:

    ```bash
    cd k6-testing
    ```

2.  **Run the Test Stack**:
    ```bash
    docker-compose up
    ```
    - **Grafana Dashboard**: `http://localhost:3000` (Login: `admin`/`admin`)
      > **Note**: Port 3000 is also used by the End User app. Ensure it's free before running this, or configure a different port in `docker-compose.yml`.

### Option 2: Run Manually (CLI)

1.  **Install k6**: [Installation Guide](https://grafana.com/docs/k6/latest/set-up/install-k6/)
2.  **Run Script**:
    ```bash
    cd k6-testing
    k6 run scripts/load-test.js
    ```

---

## 📚 Documentation

- **Database Schema**: [View Database Documentation](docs/db.md)
- **API Documentation**: Available via Postman Collection (if provided) or see `backend/routes/api.php`.

---

## 👥 Contributors

| STT | MSSV     | Họ và Tên            | Github                                                |
| :-- | :------- | :------------------- | :---------------------------------------------------- |
| 1   | 22520880 | Nguyễn Viết Anh Minh | [vamnguyen](https://github.com/vamnguyen)             |
| 2   | 22521028 | Tô Hoàng Nhật        | [piemanscharf95](https://github.com/piemanscharf95)   |
| 3   | 23520224 | Đinh Khánh Đăng      | [DinhKhanhDang27](https://github.com/DinhKhanhDang27) |
| 4   | 23520507 | Trần Ngọc Quỳnh Hoa  | [nhims79](https://github.com/nhims79)                 |
| 5   | 23520884 | Nguyễn Minh Long     | [oolongc2](https://github.com/oolongc2)               |
| 6   | 23521121 | Huỳnh Lâm Tâm Như    | [NhuHuynh-252](https://github.com/NhuHuynh-252)       |
| 7   | 23521124 | Nguyễn Bảo Như       | [ray1130](https://github.com/ray1130)                 |
