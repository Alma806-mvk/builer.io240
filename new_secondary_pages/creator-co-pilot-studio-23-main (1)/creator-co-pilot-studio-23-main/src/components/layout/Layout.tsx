import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import BackgroundGlow from "@/components/BackgroundGlow";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <BackgroundGlow />
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
