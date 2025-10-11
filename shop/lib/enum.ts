export enum ProductStatus {
  IN_STOCK = "Còn hàng",
  RENTING = "Đang cho thuê",
  MAINTENANCE = "Bảo trì",
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
  ACTIVE = "active",
  RETURNED = "returned",
  CANCELLED = "cancelled",
}

export enum PaymentStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
}

export enum UploadFolder {
  PRODUCT_IMAGES = "product-images",
  CATEGORY_IMAGES = "category-images",
}
