import type { Metadata } from "next";
import "@/app/globals.css";
import { NotificationProvider } from "../../components/notification";
import Sidebar from "../../components/sidebar";
import { authClient } from "@/lib/auth-client";
import Header from "../../components/header";
import { UserProvider } from "../../components/userprovider";

export const metadata: Metadata = {
  title: "Poster",
  description: "Poster Application runs as a common backend",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <NotificationProvider>
        <UserProvider>
          <div className="flex flex-row w-full">
            <Sidebar />
            <div className="flex-1 mt-5 lg:m-0">{children}</div>
          </div>
        </UserProvider>
      </NotificationProvider>
    </>
  );
}
