"use client";

import React from "react";
import { Menu } from "lucide-react";
import { ThemeSwitcher } from "../../../utils/ThemeSwitcher";
import NotificationDropdown from "./NotificationDropdown";

type DashboardHeaderProps = {
  onMenuClick : any
}

export default function DashboardHeader({ onMenuClick } : DashboardHeaderProps) {

  


  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200/80 bg-white/80 px-5 py-4 backdrop-blur-md dark:border-white/[0.08] dark:bg-[#0f172a]/80 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-slate-100 lg:hidden dark:text-gray-400 dark:hover:bg-[#1e293b]"
        >
          <Menu size={20} />
        </button>

      </div>

      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 transition-colors hover:bg-slate-100 dark:border-white/[0.08] dark:hover:bg-[#1e293b]">
          <ThemeSwitcher />
        </div>

        <NotificationDropdown />

      </div>
    </header>
  );
}