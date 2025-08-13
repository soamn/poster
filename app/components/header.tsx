"use client";
import { authClient } from "@/lib/auth-client";
import { User } from "better-auth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";

const Header = () => {
  const [user, setUser] = useState<User>();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  useEffect(() => {
    authClient.getSession().then((session) => {
      setUser(session.data?.user);
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.href = "/";
  };

  return (
    <header className="bg-zinc-100 p-3 rounded m-5 flex justify-between items-center shadow">
      <div className="text-lg font-semibold">{user?.name}</div>

      {user && (
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 focus:outline-none"
          >
            <img
              src={user.image || "https://placehold.co/400"}
              alt={user.name || "User"}
              className="w-10 h-10 rounded-full border border-gray-300"
            />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <button
                onClick={() => router.push(`/admin/users/${user.id}`)}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
