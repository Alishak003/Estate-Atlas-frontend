"use client";


import Image from "next/image";
import {  ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import man from "../../../public/19e045a1319fe4a16c9e6fb45244dd8f31af19d3.png";
import { useUser } from "@/app/context/UserContext";
import Cookies from 'js-cookie';
export default function Header() {

  const { user, loading, setUser } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const token = Cookies.get('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error("Logout failed");
       
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // Clear user data and token
     Cookies.remove("token");
    Cookies.remove("user");
      setUser(null);

      // Redirect to login page
      router.push("/auth/login");
    }
  };

  return (
    <header className="md:border-b md:bg-white px-4 py-3">
      <div className="flex items-center justify-end gap-4">
        {/* 🔔 Notification Button */}
        

        {/* 👤 User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2 py-1 h-auto">
              <div className="flex items-center gap-2">
                <div className="relative h-8 w-8 rounded-full overflow-hidden">
                  <Image src={man} alt="User Avatar" width={32} height={32} className="object-cover" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {loading ? "Loading..." : user?.first_name || "Guest"}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
