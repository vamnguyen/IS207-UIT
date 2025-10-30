# Tài liệu CSDL

Ngày cập nhật: 2025-10-30\
Dự án: IS207 – Hệ thống thương mại điện tử (Laravel + Next.js)

## Tổng quan cơ sở dữ liệu

| Bảng                   | Mục đích                 | Ghi chú                                  |
| ---------------------- | ------------------------ | ---------------------------------------- |
| users                  | Lưu thông tin người dùng | Role, địa chỉ, thông tin Stripe          |
| password_reset_tokens  | Token đặt lại mật khẩu   | Hỗ trợ quên mật khẩu                     |
| sessions               | Phiên đăng nhập          | Theo dõi hoạt động phiên                 |
| personal_access_tokens | Token truy cập cá nhân   | Dùng cho API/Auth                        |
| categories             | Danh mục sản phẩm        | Có image_url                             |
| products               | Sản phẩm                 | FK category_id, shop_id; trạng thái enum |
| comments               | Bình luận sản phẩm       | Hỗ trợ cây bình luận + edited flag       |
| orders                 | Đơn hàng                 | Trạng thái enum, địa chỉ                 |
| order_items            | Mục trong đơn hàng       | Liên kết sản phẩm và đơn hàng            |
| payments               | Thanh toán               | Phương thức + trạng thái                 |
| carts                  | Giỏ hàng                 | Gắn với user (nullable)                  |
| cart_items             | Mục trong giỏ            | Số lượng + thời gian thuê + tổng tiền    |
| subscriptions          | Gói đăng ký (Stripe)     | Trạng thái, thời gian dùng thử           |
| subscription_items     | Mục trong gói            | stripe_product/price + meter fields      |
| cache                  | Cache hệ thống           | Khóa-giá trị                             |
| cache_locks            | Khóa cache               | Điều phối lock                           |
| jobs                   | Hàng đợi công việc       | Queue + payload                          |
| job_batches            | Lô công việc             | Theo dõi batch jobs                      |
| failed_jobs            | Công việc lỗi            | Lưu trace khi fail                       |

## Chi tiết schema

### users

| Cột               | Kiểu                            | Null | Default  | Ràng buộc/Ghi chú |
| ----------------- | ------------------------------- | ---- | -------- | ----------------- |
| id                | bigIncrements                   | No   |          | PK                |
| name              | string                          | No   |          |                   |
| email             | string                          | No   |          | unique            |
| email_verified_at | timestamp                       | Yes  |          |                   |
| password          | string                          | No   |          |                   |
| role              | enum('customer','shop','admin') | No   | customer |                   |
| address           | string                          | Yes  |          |                   |
| remember_token    | string(100)                     | Yes  |          |                   |
| stripe_id         | string                          | Yes  |          | index             |
| pm_type           | string                          | Yes  |          |                   |
| pm_last_four      | string(4)                       | Yes  |          |                   |
| trial_ends_at     | timestamp                       | Yes  |          |                   |
| created_at        | timestamp                       | Yes  |          |                   |
| updated_at        | timestamp                       | Yes  |          |                   |

### password_reset_tokens

| Cột        | Kiểu      | Null | Default | Ràng buộc/Ghi chú |
| ---------- | --------- | ---- | ------- | ----------------- |
| email      | string    | No   |         | PK                |
| token      | string    | No   |         |                   |
| created_at | timestamp | Yes  |         |                   |

### sessions

| Cột           | Kiểu       | Null | Default | Ràng buộc/Ghi chú    |
| ------------- | ---------- | ---- | ------- | -------------------- |
| id            | string     | No   |         | PK                   |
| user_id       | foreignId  | Yes  |         | index, FK (users.id) |
| ip_address    | string(45) | Yes  |         |                      |
| user_agent    | text       | Yes  |         |                      |
| payload       | longText   | No   |         |                      |
| last_activity | integer    | No   |         | index                |

### personal_access_tokens

| Cột            | Kiểu          | Null | Default | Ràng buộc/Ghi chú |
| -------------- | ------------- | ---- | ------- | ----------------- |
| id             | bigIncrements | No   |         | PK                |
| tokenable_type | string        | No   |         | morphs            |
| tokenable_id   | bigInteger    | No   |         | morphs            |
| name           | text          | No   |         |                   |
| token          | string(64)    | No   |         | unique            |
| abilities      | text          | Yes  |         |                   |
| last_used_at   | timestamp     | Yes  |         |                   |
| expires_at     | timestamp     | Yes  |         | index             |
| created_at     | timestamp     | Yes  |         |                   |
| updated_at     | timestamp     | Yes  |         |                   |

### categories

| Cột         | Kiểu          | Null | Default | Ràng buộc/Ghi chú |
| ----------- | ------------- | ---- | ------- | ----------------- |
| id          | bigIncrements | No   |         | PK                |
| name        | string        | No   |         |                   |
| slug        | string        | No   |         | unique            |
| description | string        | Yes  |         |                   |
| image_url   | string        | Yes  |         |                   |
| created_at  | timestamp     | Yes  |         |                   |
| updated_at  | timestamp     | Yes  |         |                   |

### products

| Cột         | Kiểu                                       | Null | Default  | Ràng buộc/Ghi chú                    |
| ----------- | ------------------------------------------ | ---- | -------- | ------------------------------------ |
| id          | bigIncrements                              | No   |          | PK                                   |
| name        | string                                     | No   |          |                                      |
| slug        | string                                     | No   |          | unique                               |
| description | text                                       | Yes  |          |                                      |
| price       | decimal(10,2)                              | No   |          |                                      |
| stock       | integer                                    | No   | 0        |                                      |
| image_url   | string                                     | Yes  |          |                                      |
| images      | json                                       | Yes  |          |                                      |
| status      | enum('Còn hàng','Đang cho thuê','Bảo trì') | No   | Còn hàng |                                      |
| category_id | foreignId                                  | No   |          | FK → categories(id), cascadeOnDelete |
| shop_id     | foreignId                                  | No   |          | FK → users(id), cascadeOnDelete      |
| created_at  | timestamp                                  | Yes  |          |                                      |
| updated_at  | timestamp                                  | Yes  |          |                                      |

### comments

| Cột        | Kiểu            | Null | Default | Ràng buộc/Ghi chú                  |
| ---------- | --------------- | ---- | ------- | ---------------------------------- |
| id         | bigIncrements   | No   |         | PK                                 |
| content    | text            | No   |         |                                    |
| user_id    | foreignId       | No   |         | FK → users(id), cascadeOnDelete    |
| product_id | foreignId       | Yes  |         | FK → products(id), cascadeOnDelete |
| left       | unsignedInteger | No   | 0       | Nested set                         |
| right      | unsignedInteger | No   | 0       | Nested set                         |
| parent_id  | foreignId       | Yes  |         | FK → comments(id), cascadeOnDelete |
| edited     | boolean         | No   | false   |                                    |
| edited_at  | timestamp       | Yes  |         |                                    |
| created_at | timestamp       | Yes  |         |                                    |
| updated_at | timestamp       | Yes  |         |                                    |

### orders

| Cột          | Kiểu                                                                       | Null | Default | Ràng buộc/Ghi chú               |
| ------------ | -------------------------------------------------------------------------- | ---- | ------- | ------------------------------- |
| id           | bigIncrements                                                              | No   |         | PK                              |
| user_id      | foreignId                                                                  | No   |         | FK → users(id), cascadeOnDelete |
| start_date   | date                                                                       | No   |         |                                 |
| end_date     | date                                                                       | No   |         |                                 |
| total_amount | decimal(10,2)                                                              | No   |         |                                 |
| status       | enum('pending','confirmed','processing','shipped','delivered','cancelled') | No   | pending | enum cuối cùng (đã cập nhật)    |
| address      | string                                                                     | Yes  |         |                                 |
| created_at   | timestamp                                                                  | Yes  |         |                                 |
| updated_at   | timestamp                                                                  | Yes  |         |                                 |

### order_items

| Cột        | Kiểu          | Null | Default | Ràng buộc/Ghi chú                  |
| ---------- | ------------- | ---- | ------- | ---------------------------------- |
| id         | bigIncrements | No   |         | PK                                 |
| order_id   | foreignId     | No   |         | FK → orders(id), cascadeOnDelete   |
| product_id | foreignId     | No   |         | FK → products(id), cascadeOnDelete |
| quantity   | integer       | No   |         |                                    |
| price      | decimal(10,2) | No   |         | Đơn giá tại thời điểm đặt          |
| days       | integer       | No   |         | Số ngày thuê                       |
| subtotal   | decimal(10,2) | No   |         |                                    |
| created_at | timestamp     | Yes  |         |                                    |
| updated_at | timestamp     | Yes  |         |                                    |

### payments

| Cột            | Kiểu                                 | Null | Default | Ràng buộc/Ghi chú                |
| -------------- | ------------------------------------ | ---- | ------- | -------------------------------- |
| id             | bigIncrements                        | No   |         | PK                               |
| order_id       | foreignId                            | No   |         | FK → orders(id), cascadeOnDelete |
| payment_method | enum('cash','bank_transfer','card')  | No   | cash    |                                  |
| amount         | decimal(10,2)                        | No   |         |                                  |
| status         | enum('pending','completed','failed') | No   | pending |                                  |
| created_at     | timestamp                            | Yes  |         |                                  |
| updated_at     | timestamp                            | Yes  |         |                                  |

### carts

| Cột        | Kiểu          | Null | Default | Ràng buộc/Ghi chú               |
| ---------- | ------------- | ---- | ------- | ------------------------------- |
| id         | bigIncrements | No   |         | PK                              |
| user_id    | foreignId     | Yes  |         | FK → users(id), cascadeOnDelete |
| created_at | timestamp     | Yes  |         |                                 |
| updated_at | timestamp     | Yes  |         |                                 |

### cart_items

| Cột         | Kiểu          | Null | Default | Ràng buộc/Ghi chú                  |
| ----------- | ------------- | ---- | ------- | ---------------------------------- |
| id          | bigIncrements | No   |         | PK                                 |
| cart_id     | foreignId     | No   |         | FK → carts(id), cascadeOnDelete    |
| product_id  | foreignId     | No   |         | FK → products(id), cascadeOnDelete |
| quantity    | integer       | No   |         |                                    |
| start_date  | date          | No   |         |                                    |
| end_date    | date          | No   |         |                                    |
| days        | integer       | No   |         |                                    |
| total_price | decimal(10,2) | No   |         |                                    |
| created_at  | timestamp     | Yes  |         |                                    |
| updated_at  | timestamp     | Yes  |         |                                    |

### subscriptions

| Cột           | Kiểu          | Null | Default | Ràng buộc/Ghi chú             |
| ------------- | ------------- | ---- | ------- | ----------------------------- |
| id            | bigIncrements | No   |         | PK                            |
| user_id       | foreignId     | No   |         | index(user_id, stripe_status) |
| type          | string        | No   |         |                               |
| stripe_id     | string        | No   |         | unique                        |
| stripe_status | string        | No   |         |                               |
| stripe_price  | string        | Yes  |         |                               |
| quantity      | integer       | Yes  |         |                               |
| trial_ends_at | timestamp     | Yes  |         |                               |
| ends_at       | timestamp     | Yes  |         |                               |
| created_at    | timestamp     | Yes  |         |                               |
| updated_at    | timestamp     | Yes  |         |                               |

### subscription_items

| Cột              | Kiểu          | Null | Default | Ràng buộc/Ghi chú                    |
| ---------------- | ------------- | ---- | ------- | ------------------------------------ |
| id               | bigIncrements | No   |         | PK                                   |
| subscription_id  | foreignId     | No   |         | index(subscription_id, stripe_price) |
| stripe_id        | string        | No   |         | unique                               |
| stripe_product   | string        | No   |         |                                      |
| stripe_price     | string        | No   |         |                                      |
| meter_id         | string        | Yes  |         |                                      |
| quantity         | integer       | Yes  |         |                                      |
| meter_event_name | string        | Yes  |         |                                      |
| created_at       | timestamp     | Yes  |         |                                      |
| updated_at       | timestamp     | Yes  |         |                                      |

### cache

| Cột        | Kiểu       | Null | Default | Ràng buộc/Ghi chú |
| ---------- | ---------- | ---- | ------- | ----------------- |
| key        | string     | No   |         | PK                |
| value      | mediumText | No   |         |                   |
| expiration | integer    | No   |         |                   |

### cache_locks

| Cột        | Kiểu    | Null | Default | Ràng buộc/Ghi chú |
| ---------- | ------- | ---- | ------- | ----------------- |
| key        | string  | No   |         | PK                |
| owner      | string  | No   |         |                   |
| expiration | integer | No   |         |                   |

### jobs

| Cột          | Kiểu                | Null | Default | Ràng buộc/Ghi chú |
| ------------ | ------------------- | ---- | ------- | ----------------- |
| id           | bigIncrements       | No   |         | PK                |
| queue        | string              | No   |         | index             |
| payload      | longText            | No   |         |                   |
| attempts     | unsignedTinyInteger | No   |         |                   |
| reserved_at  | unsignedInteger     | Yes  |         |                   |
| available_at | unsignedInteger     | No   |         |                   |
| created_at   | unsignedInteger     | No   |         |                   |

### job_batches

| Cột            | Kiểu       | Null | Default | Ràng buộc/Ghi chú |
| -------------- | ---------- | ---- | ------- | ----------------- |
| id             | string     | No   |         | PK                |
| name           | string     | No   |         |                   |
| total_jobs     | integer    | No   |         |                   |
| pending_jobs   | integer    | No   |         |                   |
| failed_jobs    | integer    | No   |         |                   |
| failed_job_ids | longText   | No   |         |                   |
| options        | mediumText | Yes  |         |                   |
| cancelled_at   | integer    | Yes  |         |                   |
| created_at     | integer    | No   |         |                   |
| finished_at    | integer    | Yes  |         |                   |

### failed_jobs

| Cột        | Kiểu          | Null | Default    | Ràng buộc/Ghi chú |
| ---------- | ------------- | ---- | ---------- | ----------------- |
| id         | bigIncrements | No   |            | PK                |
| uuid       | string        | No   |            | unique            |
| connection | text          | No   |            |                   |
| queue      | text          | No   |            |                   |
| payload    | longText      | No   |            |                   |
| exception  | longText      | No   |            |                   |
| failed_at  | timestamp     | No   | useCurrent |                   |

## Quan hệ chính (ER tóm tắt)

| Từ bảng       | Đến bảng           | Kiểu quan hệ | Ghi chú                |
| ------------- | ------------------ | ------------ | ---------------------- |
| users         | orders             | 1–N          | user_id                |
| users         | carts              | 1–N          | user_id (nullable)     |
| users         | products           | 1–N          | shop_id                |
| users         | comments           | 1–N          | user_id                |
| categories    | products           | 1–N          | category_id            |
| products      | comments           | 1–N          | product_id             |
| orders        | order_items        | 1–N          | order_id               |
| products      | order_items        | 1–N          | product_id             |
| carts         | cart_items         | 1–N          | cart_id                |
| products      | cart_items         | 1–N          | product_id             |
| orders        | payments           | 1–N          | order_id               |
| subscriptions | subscription_items | 1–N          | subscription_id        |
| comments      | comments           | 1–N (cây)    | parent_id + left/right |

---
