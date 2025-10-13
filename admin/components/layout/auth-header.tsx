import Image from "next/image";
import Logo from "@/public/logo.png";
import Link from "next/link";

export function AuthHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src={Logo}
              alt="Logo"
              width={60}
              height={60}
              className="aspect-auto"
            />
          </Link>
        </div>
      </div>
    </header>
  );
}
