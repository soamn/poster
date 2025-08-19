"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useUserProvider } from "./userprovider";

const Sidebar = () => {
  const [showsidebar, setShowSidebar] = useState(true);
  const pathname = usePathname();
  const { getUserdata } = useUserProvider();
  const data = getUserdata();

  const links = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Posts", href: "/admin/posts" },
    { label: "Users", href: "/admin/users" },
    { label: "Categories", href: "/admin/categories" },
    { label: "Create Post", href: "/admin/editor" },
    ...(data.role === 1
      ? [
          {
            label: "Create User",
            href: "/admin/users/create",
          },
        ]
      : []),
  ];

  return (
    <div
      className={`lg:h-screen  ${
        showsidebar && "h-screen"
      } absolute   lg:relative   p-4  rounded-lg bg-zinc-100 z-50`}
    >
      <div className="w-fit" hidden={!showsidebar}>
        <ul className="px-5 py-3 flex flex-col space-y-2 *:hover:bg-sky-100 *:hover:cursor-pointer *:p-1 *:rounded-lg">
          {links.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className={`${pathname === href ? "bg-sky-100" : ""}`}
            >
              <li>
                <button className="w-full text-left cursor-pointer">
                  {label}
                </button>
              </li>
            </a>
          ))}
        </ul>
      </div>
      <button
        onClick={() => setShowSidebar(!showsidebar)}
        className="cursor-pointer absolute top-2   right-0"
      >
        {showsidebar ? <ChevronLeft /> : <ChevronRight />}
      </button>
    </div>
  );
};

export default Sidebar;
