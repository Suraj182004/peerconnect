import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConnectionsProvider } from "@/contexts/ConnectionsContext";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "PeerConnect - Student Networking Platform",
  description: "Discover peers, build connections, and collaborate on projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-inter antialiased`}>
        <ConnectionsProvider>
          {children}
          <Toaster richColors position="top-right" />
        </ConnectionsProvider>
      </body>
    </html>
  );
}
