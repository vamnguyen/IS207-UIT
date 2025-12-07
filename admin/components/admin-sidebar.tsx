import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Settings, 
  FileText,
  Tag,
  MessageSquare,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import Link from "next/link";
import UserMenu from './user-menu';

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  badge?: number;
  href?: string; // thêm href nếu cần
}

export function AdminSidebar() {
  const [activeItem, setActiveItem] = useState('Dashboard');

  const menuItems: MenuItem[] = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: "/dashboard" },
    { icon: <Users size={20} />, label: 'Người dùng', href: "/users" },
    { icon: <Package size={20} />, label: 'Sản phẩm', href: "/products"},
    { icon: <ShoppingCart size={20} />, label: 'Đơn hàng', href: "/orders"},
    { icon: <Tag size={20} />, label: 'Danh mục', href: "/categories" },
    // { icon: <BarChart3 size={20} />, label: 'Thống kê' },
    // { icon: <FileText size={20} />, label: 'Báo cáo' },
    // { icon: <MessageSquare size={20} />, label: 'Tin nhắn', badge: 3 },
    // { icon: <Settings size={20} />, label: 'Cài đặt' },
  ];

  return (
    <aside className="w-72 bg-[#1f1f1f] text-white flex flex-col shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-[#2c6c24]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#7aa520] flex items-center justify-center">
            <span className="text-xl">
              <img src="/logo.png"></img>
            </span>
          </div>
          <div>
            <h2 className="text-lg text-[#e8eabc]">Matcha Admin</h2>
            <p className="text-xs text-[#cddd77]">Bảng điều khiển</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <Link key={item.label} href={item.href ?? "#"}> 
            <button
              key={item.label}
              onClick={() => setActiveItem(item.label)}
              className={`
                w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg
                transition-all duration-200 group
                ${activeItem === item.label 
                  ? 'bg-gradient-to-r from-[#2c6c24] to-[#7aa520] text-white shadow-lg' 
                  : 'text-[#e8eabc] hover:bg-[#2c6c24]/30 hover:text-white'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <span className={`
                  ${activeItem === item.label ? 'text-[#cddd77]' : 'text-[#7aa520]'}
                `}>
                  {item.icon}
                </span>
                <span className="text-sm">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.badge && (
                  <span className="bg-[#cddd77] text-[#1f1f1f] text-xs px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
                {activeItem === item.label && (
                  <ChevronRight size={16} className="text-[#cddd77]" />
                )}
              </div>
            </button>
            </Link>
          ))}
        </div>
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-[#2c6c24]">
        <UserMenu />
      </div>
    </aside>
  );
}
