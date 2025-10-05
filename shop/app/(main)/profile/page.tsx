import type { Metadata } from "next";
import { ProfileClient } from "@/components/profile/profile-client";

export const metadata: Metadata = {
  title: "Thông tin cá nhân",
  description: "Quản lý thông tin tài khoản cá nhân của bạn",
};

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Thông tin cá nhân</h1>
        <p className="text-muted-foreground">
          Quản lý thông tin tài khoản của bạn
        </p>
      </div>
      <ProfileClient />
    </div>
  );
}
