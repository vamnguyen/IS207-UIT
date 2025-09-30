import type { Category, Product, User } from "./types";

export const mockCategories: Category[] = [
  {
    id: "1",
    category_name: "Thiết bị điện tử",
    description: "Laptop, máy ảnh, thiết bị âm thanh",
    image_url:
      "https://www.codrey.com/wp-content/uploads/2017/12/Consumer-Electronics-1.png",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    category_name: "Đồ gia dụng",
    description: "Bàn ghế, tủ kệ, đồ trang trí",
    image_url:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/cozy-living-room-iHk2Ew5to47IVzWqnBQ9oR1OXtskbT.png",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    category_name: "Thể thao & Giải trí",
    description: "Xe đạp, dụng cụ thể thao, game",
    image_url:
      "https://hanoitoplist.com/wp-content/uploads/2020/06/360-sport-hanoitoplist.jpg",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "4",
    category_name: "Thời trang",
    description: "Quần áo, phụ kiện, túi xách",
    image_url:
      "https://js0fpsb45jobj.vcdn.cloud/storage/upload/media/phu-kien-thoi-trang-nu-la-gi-1.jpg",
    created_at: "2024-01-01T00:00:00Z",
  },
];

export const mockProducts: Product[] = [
  {
    id: "1",
    product_name: 'MacBook Pro 16" M3',
    description:
      "Laptop cao cấp cho công việc và sáng tạo. Chip M3 mạnh mẽ, màn hình Retina sắc nét.",
    price_per_day: 150000,
    stock: 3,
    category_id: "1",
    image_url:
      "https://macstores.vn/wp-content/uploads/2023/12/macbook-pro-16-inch-m3-pro-2023-36gb-ram-512gb-ssd-baterrylife.jpg",
    images: [
      "https://macstores.vn/wp-content/uploads/2023/12/macbook-pro-16-inch-m3-pro-2023-36gb-ram-512gb-ssd-baterrylife.jpg",
      "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/2023_10_31_638343385630241729_macbook-pro-16-m3-2023-cover-2.jpg",
      "https://ttcenter.com.vn/uploads/photos/1699435159_2365_188768642a9da91b6d6a34770e7df2f9.jpg",
    ],
    status: "available",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    product_name: "Canon EOS R5",
    description:
      "Máy ảnh mirrorless chuyên nghiệp. Cảm biến 45MP, quay video 8K.",
    price_per_day: 200000,
    stock: 2,
    category_id: "1",
    image_url:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/canon-camera-professional-V8p64Wm9yG9mVa9lZlsplv70JFwnpy.jpg",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/canon-camera-professional-V8p64Wm9yG9mVa9lZlsplv70JFwnpy.jpg",
      "https://zshop.vn/images/thumbnails/624/460/detailed/87/1594279759_IMG_1384513.jpg",
      "https://bizweb.dktcdn.net/thumb/grande/100/507/659/products/canon-eos-r5-body-2.png?v=1708151447607",
    ],
    status: "available",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    product_name: "Bàn làm việc gỗ tự nhiên",
    description:
      "Bàn làm việc cao cấp từ gỗ sồi tự nhiên. Kích thước 120x60cm.",
    price_per_day: 50000,
    stock: 5,
    category_id: "2",
    image_url:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/wooden-desk-natural-xGLZMFVpumd4LfQ0D4egYqse6PaI53.jpg",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/wooden-desk-natural-xGLZMFVpumd4LfQ0D4egYqse6PaI53.jpg",
      "https://metawood.vn/wp-content/uploads/2024/07/DSCF9858.jpg",
      "https://noithatthaibinh.com/wp-content/uploads/2023/09/ban-lam-viec-go-tu-nhien-1m4-2961-1.jpg",
    ],
    status: "available",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "4",
    product_name: "Xe đạp thể thao Giant",
    description: "Xe đạp thể thao cao cấp, khung nhôm nhẹ, 21 tốc độ.",
    price_per_day: 80000,
    stock: 4,
    category_id: "3",
    image_url:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/mountain-bike-sports-3dnrZO059SDrqmMUAcrCm22ShNcZxK.jpg",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/mountain-bike-sports-3dnrZO059SDrqmMUAcrCm22ShNcZxK.jpg",
      "https://giant.vn/wp-content/uploads/2024/01/2024_Escape1Disc_SnowDrift.jpg",
    ],
    status: "available",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "5",
    product_name: "Váy dạ hội sang trọng",
    description:
      "Váy dạ hội thiết kế cao cấp, phù hợp cho các sự kiện quan trọng.",
    price_per_day: 120000,
    stock: 2,
    category_id: "4",
    image_url:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/elegant-evening-dress-FzGci270NqmjH5bQUZ7j65Hl6O66cP.png",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/elegant-evening-dress-FzGci270NqmjH5bQUZ7j65Hl6O66cP.png",
      "https://img.riodress.vn/2024/03/dam-da-hoi-1.jpg",
      "https://lamia.com.vn/storage/anh-seo/vay-du-tiec-sang.jpg",
      "https://mynoca.vn/wp-content/uploads/2022/07/dam-da-hoi-mau-do-sang-trong-6.jpg",
    ],
    status: "available",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "6",
    product_name: "Loa Bluetooth JBL",
    description: "Loa không dây chất lượng cao, âm thanh sống động.",
    price_per_day: 30000,
    stock: 8,
    category_id: "1",
    image_url:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/bluetooth-speaker-jbl-SsGkgeWyZqnBIScq0qjcKAXhhPWly5.jpg",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/bluetooth-speaker-jbl-SsGkgeWyZqnBIScq0qjcKAXhhPWly5.jpg",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_211_1__1.png",
      "https://danguitargiare.com/cdn/shop/products/colors-50221-1502135382-1280-1280-6500dccb-ac2e-44a4-a882-a9438b86020e_3905cf1903c0448b8b1cceb207ef8ce5_master_1200x1200.jpg?v=1663740343",
    ],
    status: "available",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
];

export const mockUser: User = {
  id: "1",
  name: "Nguyễn Văn An",
  email: "nguyen.van.an@email.com",
  role: "customer",
  created_at: "2024-01-01T00:00:00Z",
};
