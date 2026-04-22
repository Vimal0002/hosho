import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/app/context/AuthContext";
import { ThemeProvider } from "@/app/providers";
import ScrollToTop from "@/app/components/ScrollToTop";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "ElectroMinds — AI Electronics Shopping Assistant",
  description: "Shop electronics with our AI assistant",
};

import { CartProvider } from "@/app/context/CartContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.variable}>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              {children}
              <ScrollToTop />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

