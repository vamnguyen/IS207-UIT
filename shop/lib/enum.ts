export enum ProductStatus {
  IN_STOCK = "Còn hàng",
  RENTING = "Đang cho thuê",
  MAINTENANCE = "Bảo trì",
  SUSPEND = "Tạm ngưng",
  DISCONTINUE = "Ngừng kinh doanh",
  OUT_OF_STOCK = "Hết hàng",
}

export enum Role {
  CUSTOMER = "customer",
  SHOP = "shop",
  ADMIN = "admin",
}

export enum PaymentMethod {
  CASH = "cash",
  BANK_TRANSFER = "bank_transfer",
  CARD = "card",
}

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
  RETURNED = "returned",
}

export enum OrderEvidenceType {
  SEND_PACKAGE = "send_package",
  RECEIVE_PACKAGE = "receive_package",
  RETURN_PACKAGE = "return_package",
  RECEIVE_RETURN = "receive_return",
}

export enum PaymentStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
}

export enum UploadFolder {
  PRODUCT_IMAGES = "product-images",
  CATEGORY_IMAGES = "category-images",
  EVIDENCES = "evidences",
}
