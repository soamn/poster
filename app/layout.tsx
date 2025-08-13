import type { Metadata } from "next";
import "./globals.css";
import { NotificationProvider } from "./components/notification";
import Sidebar from "./components/sidebar";

export const metadata: Metadata = {
  title: "Poster",
  description: "Poster Application runs as a common backend",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className=" antialiased ">
        <NotificationProvider>{children}</NotificationProvider>
      </body>
    </html>
  );
}
