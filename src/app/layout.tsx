import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ZEBRA - Facturación",
  description: "Sistema de facturación sencillo para pymes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${montserrat.className} antialiased bg-zebra-light`}>
        {/* Header móvil */}
        <header className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-zebra-border z-50 px-4 py-3">
          <h1 className="text-xl font-bold text-zebra-primary">ZEBRA</h1>
        </header>

        <Sidebar />
        <MobileNav />

        <main className="lg:ml-64 min-h-screen p-4 lg:p-8 pt-16 lg:pt-8 pb-24 lg:pb-8">
          {children}
        </main>
      </body>
    </html>
  );
}
