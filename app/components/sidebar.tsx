"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUserProvider } from "./userprovider";
import { label } from "motion/react-client";

const Sidebar = () => {
  const [showsidebar, setShowSidebar] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { getUserdata } = useUserProvider();
  const data = getUserdata();

  const links = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Posts", href: "/admin/posts" },
    { label: "Users", href: "/admin/users" },
    { label: "Create ", href: "/admin/editor" },
    { label: "Categories", href: "/admin/categories" },
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
    <div className="h-screen relative w-fit  p-2  rounded-lg bg-zinc-100">
      <div className="w-40 " hidden={!showsidebar}>
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
        className="cursor-pointer absolute top-2 right-0"
      >
        {showsidebar ? <ChevronLeft /> : <ChevronRight />}
      </button>
    </div>
  );
};

export default Sidebar;
