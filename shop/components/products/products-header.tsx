"use client";

export function ProductsHeader() {
  return (
    <div className="space-y-6 mb-8">
      {/* Page Title */}
      <div className="space-y-2">
        <h1 className="text-3xl lg:text-4xl font-bold text-balance">
          Tất cả sản phẩm
        </h1>
        <p className="text-lg text-muted-foreground text-pretty">
          Khám phá hàng nghìn sản phẩm chất lượng cao với giá thuê hợp lý
        </p>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Hiển thị <span className="font-medium">6</span> trong tổng số{" "}
          <span className="font-medium">6</span> sản phẩm
        </p>
      </div>
    </div>
  );
}
