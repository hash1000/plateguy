import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "./providers";
import { persistor, store } from "@/lib/store";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";

export const metadata: Metadata = {
  title: "PlateGuy | Premium 3D & 4D Number Plates UK",
  description:
    "Buy premium 3D Gel, 4D Acrylic, Neon, Bubble and custom number plates. DVLA registered. Free UK delivery. Road legal. Based in Leeds.",
  keywords:
    "number plates, 4D number plates, 3D number plates, custom number plates, UK number plates, neon plates, bubble plates",
  openGraph: {
    title: "PlateGuy | Premium Number Plates UK",
    description:
      "Premium 3D & 4D number plates. DVLA registered. Free delivery. Road legal.",
    type: "website",
    url: "https://plateguy.co.uk",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-brand-black text-white font-body antialiased" suppressHydrationWarning>
        <Providers> {/* ✅ USE THIS */}
          <AnnouncementBar />
          <Navbar />

          <main>{children}</main>

          <Toaster />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
