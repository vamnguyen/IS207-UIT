import React from "react";

export const metadata = {
  title: "Điều khoản sử dụng - ReRent",
  description: "Điều khoản và điều kiện sử dụng dịch vụ cho thuê tại ReRent.",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Điều khoản sử dụng
          </h1>
          <p className="text-muted-foreground text-lg">
            Cập nhật lần cuối: {new Date().toLocaleDateString("vi-VN")}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-gray dark:prose-invert max-w-none space-y-8 text-foreground">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">
              1. Giới thiệu
            </h2>
            <p className="leading-7">
              Chào mừng bạn đến với ReRent. Khi truy cập website và sử dụng dịch
              vụ cho thuê của chúng tôi, bạn đồng ý tuân thủ các Điều khoản và
              Điều kiện này. Vui lòng đọc kỹ trước khi thực hiện giao dịch.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">
              2. Tài khoản & Thành viên
            </h2>
            <p className="leading-7">
              Để sử dụng một số tính năng, bạn cần tạo tài khoản. Bạn chịu trách
              nhiệm bảo mật thông tin tài khoản và mật khẩu. Bạn đồng ý chịu
              trách nhiệm cho mọi hoạt động diễn ra dưới tài khoản của mình.
              ReRent có quyền khóa tài khoản nếu phát hiện vi phạm.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">
              3. Sản phẩm & Dịch vụ
            </h2>
            <p className="leading-7">
              ReRent cung cấp dịch vụ cho thuê các sản phẩm thời trang, thiết bị
              và phụ kiện. Chúng tôi nỗ lực hiển thị chính xác hình ảnh và mô tả
              sản phẩm. Tuy nhiên, do đặc thù hàng cho thuê, sản phẩm thực tế có
              thể có độ hao mòn tự nhiên nhỏ nhưng vẫn đảm bảo công năng sử
              dụng.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">
              4. Đặt hàng & Thanh toán
            </h2>
            <ul className="list-disc pl-6 space-y-2 leading-7">
              <li>
                <strong>Giá thuê:</strong> Được niêm yết rõ ràng trên từng sản
                phẩm, tính theo đơn vị thời gian (ngày/tuần).
              </li>
              <li>
                <strong>Đặt cọc:</strong> Khách hàng cần đặt cọc một khoản tiền
                (hoặc tài sản đảm bảo) tương ứng với giá trị sản phẩm trước khi
                nhận hàng. Tiền cọc sẽ được hoàn trả sau khi kết thúc hợp đồng
                thuê.
              </li>
              <li>
                <strong>Thanh toán:</strong> Chấp nhận thanh toán qua thẻ tín
                dụng, chuyển khoản ngân hàng hoặc ví điện tử.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">
              5. Chính sách Đổi trả & Hoàn tiền
            </h2>
            <p className="leading-7">
              Vì đặc thù dịch vụ cho thuê, chúng tôi áp dụng chính sách nghiêm
              ngặt về tình trạng sản phẩm khi hoàn trả:
            </p>
            <ul className="list-disc pl-6 space-y-2 leading-7">
              <li>
                <strong>Tình trạng nguyên vẹn:</strong> Sản phẩm phải được hoàn
                trả trong tình trạng nguyên vẹn như khi nhận. Không rách, hỏng
                hóc, biến dạng hoặc thay đổi kết cấu.
              </li>
              <li>
                <strong>Vệ sinh:</strong> Khách hàng vui lòng giữ gìn vệ sinh
                sản phẩm. Đối với các vết bẩn thông thường, ReRent sẽ hỗ trợ xử
                lý. Tuy nhiên, với các vết bẩn không thể tẩy rửa (mực, hóa
                chất,...) hoặc hư hại vĩnh viễn, khách hàng sẽ phải bồi thường.
              </li>
              <li>
                <strong>Bồi thường hư hại:</strong> Trong trường hợp làm mất
                hoặc hư hỏng sản phẩm, khách hàng có trách nhiệm bồi thường dựa
                trên giá trị thị trường của sản phẩm hoặc chi phí sửa chữa thực
                tế.
              </li>
              <li>
                <strong>Trả muộn:</strong> Việc trả sản phẩm muộn hơn thời gian
                thỏa thuận sẽ chịu phí phạt trễ hạn tương ứng với đơn giá thuê
                theo ngày cộng thêm phí quản lý (nếu có).
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">
              6. Sở hữu trí tuệ
            </h2>
            <p className="leading-7">
              Toàn bộ nội dung trên website bao gồm văn bản, hình ảnh, logo, và
              phần mềm đều là tài sản của ReRent hoặc các bên cấp phép, được bảo
              vệ bởi luật sở hữu trí tuệ.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">
              7. Giới hạn trách nhiệm
            </h2>
            <p className="leading-7">
              ReRent không chịu trách nhiệm cho bất kỳ thiệt hại gián tiếp nào
              phát sinh từ việc sử dụng dịch vụ, bao gồm nhưng không giới hạn ở
              việc mất dữ liệu, gián đoạn kinh doanh hoặc tổn thất lợi nhuận.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">
              8. Liên hệ
            </h2>
            <p className="leading-7">
              Nếu bạn có bất kỳ thắc mắc nào về Điều khoản sử dụng, vui lòng
              liên hệ với chúng tôi:
            </p>
            <div className="bg-muted p-6 rounded-lg space-y-3">
              <div className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-phone"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span className="font-medium">1900 1234</span>
              </div>
              <div className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-mail"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <span className="font-medium">support@rerent.vn</span>
              </div>
              <div className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-map-pin"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span className="font-medium">123 Nguyễn Huệ, Q1, TP.HCM</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
