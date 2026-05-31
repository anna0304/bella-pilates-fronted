import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { ScrollToTopButton } from "../components/ui/ScrollToTopButton";

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <main>
        <Outlet />
      </main>

      <Footer />

      <ScrollToTopButton />
    </div>
  );
}