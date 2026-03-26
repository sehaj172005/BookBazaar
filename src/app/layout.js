import { Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "BookBazaar — Premium Student Marketplace",
  description:
    "The modern second-hand book marketplace for university students. Secure, transparent, and student-powered.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} min-h-full antialiased`}>
      <body className="bg-background">
        <AuthProvider>
          <div className="app-shell">
            {/* Desktop Navbar (Hidden on mobile via internal logic) */}
            <Navbar />
            
            <main className="main-content">
              {children}
            </main>
            
            {/* Mobile Bottom Nav (Usually hidden on desktop via CSS or JS) */}
            <div className="md:hidden">
               <BottomNav />
            </div>
          </div>
        </AuthProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              borderRadius: "20px",
              padding: "16px",
              fontSize: "14px",
              fontWeight: "600",
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            },
          }}
        />
      </body>
    </html>
  );
}
