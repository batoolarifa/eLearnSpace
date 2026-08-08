import React, { useState, useMemo } from "react";
import AdminSidebar from "./AdminSidebar";
import DashboardHeader from "./DashboardHeader";
import DashboardContent from "./DashboardContent";
import { useTheme } from "next-themes";

export default function AdminDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("dashboard");
  const { theme } = useTheme();
  const marginClass = useMemo(
    () => (collapsed ? "lg:ml-[90px]" : "lg:ml-[300px]"),
    [collapsed]
  );

  return (
    <div className={theme === "dark" ? "dark" : "light"}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        .elearn-root, .elearn-root * { font-family: 'Poppins', sans-serif; }
        .elearn-scrollbar::-webkit-scrollbar { width: 8px; }
        .elearn-scrollbar::-webkit-scrollbar-track { background: #0f172a; border-radius: 8px; }
        .elearn-scrollbar::-webkit-scrollbar-thumb { background: #10b981; border-radius: 8px; }
        .elearn-scrollbar::-webkit-scrollbar-thumb:hover { background: #059669; }
        button { -webkit-tap-highlight-color: transparent; }
        button:active { transform: scale(0.97); }
      `}</style>

      <div className="elearn-root min-h-screen bg-slate-50 transition-colors duration-300 dark:bg-[#0f172a]">
        <AdminSidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          active={active}
          setActive={setActive}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        <div className={`transition-all duration-300 ${marginClass}`}>
          <DashboardHeader
          onMenuClick={() => setMobileOpen(true)}
        />
          <DashboardContent theme={theme} />
        </div>
      </div>
    </div>
  );
}
