import { useState } from "react";

import { DashboardHeader } from "../../../components/user/DashboardHeader";
import { DashboardSidebar } from "../../../components/user/DashboardSidebar";
import { WelcomeBanner } from "../../../components/user/WelcomeBanner";
import { UpcomingClassCard } from "../../../components/user/UpcomingClassCard";
import { QuickActions } from "../../../components/user/QuickActions";
import { WeeklyClasses } from "../../../components/user/WeeklyClasses";
import { RecommendedRecordedClasses } from "../../../components/user/RecommendedRecordedClasses";
import { DashboardFooter } from "../../../components/user/DashboardFooter";

export function UserDashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F8F3EE]">
      {/* Sidebar desktop */}
      <div className="fixed left-0 top-0 z-40 hidden h-screen lg:block">
        <DashboardSidebar />
      </div>

      {/* Sidebar móvil */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="absolute inset-0 bg-black/30"
            onClick={() => setIsSidebarOpen(false)}
          />

          <div className="relative z-10 h-full w-[260px] max-w-[85vw]">
            <DashboardSidebar />
          </div>
        </div>
      )}

      {/* MAIN */}
      <main className="min-h-screen overflow-x-hidden lg:ml-[260px]">
        {/* CONTENIDO */}
        <div className="p-5 lg:p-8">
          <div className="mb-4 flex items-center justify-between lg:justify-end">
            {/* Hamburguesa móvil */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-2xl text-white lg:hidden"
            >
              ☰
            </button>

            <DashboardHeader />
          </div>

          <WelcomeBanner />
          <UpcomingClassCard />
          <QuickActions />
          <WeeklyClasses />
          <RecommendedRecordedClasses />
        </div>

        {/* FOOTER */}
        <DashboardFooter />
      </main>
    </div>
  );
}