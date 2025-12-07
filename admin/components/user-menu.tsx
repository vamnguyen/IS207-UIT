"use client";

import Cookies from "js-cookie";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser, logout } from "@/services/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserMenu() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    staleTime: Infinity,
  });

  const handleLogout = async () => {
    await logout();

    queryClient.removeQueries({ queryKey: ["user"] });

    Cookies.remove("auth_token");
    router.push("/login");
  };

  if (isLoading) {
    return <Skeleton className="h-10 w-full rounded-md" />;
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="block text-center text-sm font-medium text-primary hover:underline"
      >
        Đăng nhập
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="bg-[#2c6c24]/20 rounded-lg p-4 mb-3">
        <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 hover:bg-muted focus:outline-none">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar_url || ""} alt={user.name} />
             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#cddd77] to-[#7aa520] flex items-center justify-center">
              <span className="text-[#1f1f1f]">
                <AvatarFallback>
                  {user.name?.charAt(0).toUpperCase() ?? "U"}
                </AvatarFallback>
              </span>
             </div>
          </Avatar>
          <div className="text-left">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.role}</p>
          </div>
        </button>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleLogout} className="text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
