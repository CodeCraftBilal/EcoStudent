import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import TopLoader from "@/components/topLoader";
import SessionProvider from "@/context/useSession";
import InfiniteScrollProvider from "@/providers/InfiniteScrollProvider";
import { SocketProvider } from "@/context/useSocket";
import { NotificationProvider } from "@/context/useNotification";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ecosutdent - A platform for students to share and discover resources",
  description: "A platform for students to share and discover resources.",
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "Ecosutdent - A platform for students to share and discover resources",
    description: "A platform for students to share and discover resources.",
    url: "https://ecostudent.bilalkhan.online",
    images: [
      {
        url: "https://ecostudent.bilalkhan.online/ogimg.png", // link to OG image
        width: 2816,
        height: 1536,
        alt: "Ecosutdent Logo",
      },
    ],
    siteName: "Ecosutdent",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <SocketProvider>
            <NotificationProvider>

            <InfiniteScrollProvider>
              <TopLoader />
              <Navbar />
              {children}
            </InfiniteScrollProvider>
            </NotificationProvider>
          </SocketProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
