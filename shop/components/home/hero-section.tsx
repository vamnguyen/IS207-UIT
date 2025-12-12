import React from "react";

export function HeroSection() {
  return (
    <section className="border-b" style={{ backgroundColor: "#e8eabc" }}>
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-16 pt-10 md:flex-row md:items-center">
        {/* LEFT */}
        <div className="md:w-1/2">
          {/* Badge */}
          <p
            className="mb-3 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium shadow-sm"
            style={{
              backgroundColor: "#cddd77",
              color: "#2c6c24",
              border: "1px solid rgba(44,108,36,0.15)",
            }}
          >
            • Hơn 10.000+ đơn thuê mỗi tháng
          </p>

          {/* Title */}
          <h1
            className="mb-4 text-4xl font-bold leading-tight tracking-tight md:text-5xl"
            style={{ color: "#1f1f1f" }}
          >
            Nền tảng giúp bạn{" "}
            <span style={{ color: "#2c6c24" }}>cho thuê thiết bị sự kiện</span>{" "}
            dễ dàng
          </h1>

          <p className="mb-6 text-sm md:text-base" style={{ color: "#374151" }}>
            Dành cho nhà cung cấp âm thanh, ánh sáng, LED, sân khấu, backdrop…
            Đăng thiết bị, nhận đơn, quản lý lịch thuê minh bạch – nhanh gọn.
          </p>

          {/* THAY FORM TÌM KIẾM (Ô TRẮNG) BẰNG CTA CHO NGƯỜI CHO THUÊ */}
          <div className="mt-6 space-y-4">
            <div
              className="rounded-2xl border px-5 py-4"
              style={{
                backgroundColor: "#f1f5e8",
                borderColor: "rgba(44,108,36,0.25)",
              }}
            >
              <p className="text-sm font-medium" style={{ color: "#2c6c24" }}>
                Bạn đang sở hữu thiết bị sự kiện?
              </p>
              <p className="mt-1 text-sm" style={{ color: "#374151" }}>
                Đăng thiết bị âm thanh/ánh sáng/LED/sân khấu để tiếp cận khách
                thuê nhanh hơn và tối ưu công suất cho thuê.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row"></div>

            <p className="text-xs" style={{ color: "#6b7280" }}>
              Hỗ trợ tạo báo giá • Quản lý lịch thuê • Giảm trống lịch thiết bị.
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="md:w-1/2">
          <div className="relative overflow-hidden rounded-3xl bg-white shadow-md">
            <div
              className="h-64 bg-cover bg-center md:h-72"
              style={{
                backgroundImage:
                  "url('https://images.pexels.com/photos/167491/pexels-photo-167491.jpeg?auto=compress&cs=tinysrgb&w=1400')",
              }}
            />

            <div className="space-y-2 px-5 py-4">
              <p className="text-xs font-semibold" style={{ color: "#2c6c24" }}>
                Dành cho nhà cung cấp
              </p>
              <p className="text-sm font-semibold" style={{ color: "#111827" }}>
                Nhận đơn thuê âm thanh & ánh sáng cho sự kiện
              </p>
              <p className="text-xs" style={{ color: "#6b7280" }}>
                Lịch rõ ràng • Báo giá nhanh • Theo dõi trạng thái đơn thuê
              </p>
            </div>

            <div
              className="absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-medium shadow"
              style={{ backgroundColor: "#ffffffcc", color: "#2c6c24" }}
            >
              Được nhiều nhà cung cấp tin dùng
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
