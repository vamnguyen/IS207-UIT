import {
  LayoutDashboard,
  Users,
  FolderTree,
  Package,
  ShoppingCart,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import UserMenu from "@/components/user-menu";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Người dùng", href: "/users", icon: Users },
  { name: "Danh mục", href: "/categories", icon: FolderTree },
  { name: "Sản phẩm", href: "/products", icon: Package },
  { name: "Đơn hàng", href: "/orders", icon: ShoppingCart },
  { name: "Bình luận", href: "/comments", icon: MessageSquare },
];

export default function Sidebar() {
  return (
    <aside className="w-64 border-r bg-card flex flex-col">
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-bold">Admin ReRent</h1>
      </div>
      <nav className="space-y-1 p-4 flex-1 overflow-auto">
        {navigation.map((item) => (
          <Link key={item.name} href={item.href}>
            <Button variant="ghost" className="w-full justify-start gap-3">
              <item.icon className="h-5 w-5" />
              {item.name}
            </Button>
          </Link>
        ))}
      </nav>
      <div className="border-t p-4">
        <UserMenu />
      </div>
    </aside>
  );
}
