"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useUserProvider } from "./userprovider";
import { authClient } from "@/lib/auth-client";

const Sidebar = () => {
  // ✅ Lazy initializer reads from localStorage once
  const [showsidebar, setShowSidebar] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("sidebarOpen");
      return stored ? stored === "true" : true; // default true
    }
    return true;
  });

  const pathname = usePathname();
  const { getUserdata } = useUserProvider();
  const data = getUserdata();

  // ✅ Persist whenever it changes
  useEffect(() => {
    localStorage.setItem("sidebarOpen", String(showsidebar));
  }, [showsidebar]);

  const links = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Posts", href: "/admin/posts" },
    { label: "Users", href: "/admin/users" },
    { label: "Categories", href: "/admin/categories" },
    { label: "Create Post", href: "/admin/editor" },
    ...(data.role === 1
      ? [{ label: "Create User", href: "/admin/users/create" }]
      : []),
  ];

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.href = "/";
  };

  return (
    <div
      className={`lg:h-screen ${
        showsidebar ? "h-screen" : ""
      } absolute lg:relative p-4 rounded-lg bg-zinc-100 z-50`}
    >
      {showsidebar && (
        <div className="w-fit">
          <ul className="px-5 py-3 flex flex-col space-y-2 *:hover:bg-sky-100 *:hover:cursor-pointer *:p-1 *:rounded-lg">
            {links.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className={pathname === href ? "bg-sky-100" : ""}
              >
                <li>
                  <button className="w-full text-left cursor-pointer">
                    {label}
                  </button>
                </li>
              </a>
            ))}
            <li>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
      <button
        onClick={() => setShowSidebar(!showsidebar)}
        className="cursor-pointer absolute top-2 right-0"
      >
        {showsidebar ? <ChevronLeft /> : <ChevronRight />}
      </button>
    </div>
  );
};

export default Sidebar;
