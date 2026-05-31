import { useState } from "react";

import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

export function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F8F3EE]">
      <div className="fixed left-0 top-0 z-40 hidden h-screen lg:block">
        <AdminSidebar />
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="absolute inset-0 bg-black/30"
            onClick={() => setIsSidebarOpen(false)}
          />

          <div className="relative z-10 h-full w-[260px] max-w-[85vw]">
            <AdminSidebar />
          </div>
        </div>
      )}

      <main className="min-h-screen lg:ml-[260px]">
        <div className="p-5 lg:p-8">
          <AdminHeader onOpenSidebar={() => setIsSidebarOpen(true)} />
          {children}
        </div>

        <footer className="border-t border-[#E8DDD3] py-5 text-center text-sm text-[#6F5645]">
          © 2026 Bella Pilates. Todos los derechos reservados.
        </footer>
      </main>
    </div>
  );
}