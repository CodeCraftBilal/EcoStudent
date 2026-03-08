"use client";
import { Session, useSession } from "@/context/useSession";
import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/constants";
import { User, Settings, Home, LogOut, LayoutDashboard } from "lucide-react";
import Link from "next/link"; // Add this import
import { redirect } from "next/navigation";

type ProfileDropDownProps = {
  closeAllMenus: () => void;
};

export default function ProfileDropDown({
  closeAllMenus
}: ProfileDropDownProps) {
  // Define your links dynamically
  const menuLinks = [
    {
      href: "/dashboard/profile",
      icon: <User className="w-4 h-4" />,
      label: "My Profile",
    },
    {
      href: "/dashboard",
      icon: <LayoutDashboard className="w-4 h-4" />,
      label: "Dashboard",
    },
    {
      href: "/dashboard/settings",
      icon: <Settings className="w-4 h-4" />,
      label: "Settings",
    },
    {
      href: "/",
      icon: <Home className="w-4 h-4" />,
      label: "Back to Website",
      className: "border-t border-gray-100 mt-2 pt-2",
    },
  ];
  const { session, setSession } = useSession();

    const handleLogout = async () => {
      const res = await authFetch(`${BACKEND_URL}/auth/signout`, {
        method: 'Get'
      });
  
      if(!res.ok) {
        console.log(`server res: ${res.status} ${res.statusText}`)
        return;
      }
      const result = await res.json()
      setSession(null)
      console.log(result);
      console.log('logout succfull', result)
      redirect('/auth/signin');
    }

  return (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
      <div className="px-4 py-2 border-b border-gray-100">
        <div className="text-sm font-medium text-gray-900">
          {session?.userName}
        </div>
        <div className="text-xs text-gray-500">{session?.email}</div>
      </div>

      {/* Dynamically render menu links */}
      {menuLinks.map((link, index) => (
        <div key={index} className={link.className || ""}>
          <Link
            href={link.href}
            onClick={closeAllMenus}
            className="flex w-full items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {link.icon}
            <span>{link.label}</span>
          </Link>
        </div>
      ))}

      {/* Logout button */}
      <button
        onClick={async () => {
          closeAllMenus();
          await handleLogout();
        }}
        className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors mt-2"
      >
        <LogOut className="w-4 h-4" />
        <span>Sign Out</span>
      </button>
    </div>
  );
}