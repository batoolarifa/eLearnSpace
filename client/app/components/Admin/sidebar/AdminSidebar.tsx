import React, {useState} from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { NAV_SECTIONS } from "./data";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import avatarDefault from "../../../../public/assets/avatar.jpg";
import { signOut } from "next-auth/react";
import { useLogoutQuery } from "@/redux/features/auth/authApi";

type AdminSidebarProps = {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  active: string;
  setActive: (active:string) => void;
  mobileOpen: boolean;
  setMobileOpen: (mobileOpen: boolean) => void;
};

export default function AdminSidebar({
  collapsed,
  setCollapsed,
  active,
  setActive,
  mobileOpen,
  setMobileOpen,
}: AdminSidebarProps) {

  const { user } = useSelector((state: any) => state.auth);
  const [logout, setLogout] = useState(false);
  useLogoutQuery(undefined, {
  skip: !logout,
}); 

  const handleLogout = async () => {
    setLogout(true);
      await signOut({
        callbackUrl: "/",
      });
    };

  return (
    <>
      {/* mobile overlay */}
      <div
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen flex-col rounded-r-2xl border-r border-slate-200/80 bg-white shadow-[0_0_24px_rgba(0,0,0,0.04)] transition-all duration-300 ease-in-out dark:border-white/[0.08] dark:bg-[#111827] dark:shadow-none
        ${collapsed ? "lg:w-[90px]" : "lg:w-[300px]"}
        ${mobileOpen ? "w-[280px] translate-x-0" : "w-[280px] -translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Top: logo + collapse */}
        <div className="flex items-center justify-between px-5 pt-6">
          <div
            className={`flex items-center gap-2.5 overflow-hidden transition-all duration-300 ${
              collapsed ? "lg:w-0 lg:opacity-0" : "opacity-100"
            }`}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500 font-bold text-white">
              e
            </div>
            <span className="whitespace-nowrap font-semibold text-slate-900 dark:text-white">
              eLearnSpace
            </span>
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-gray-500 transition-colors duration-200 hover:bg-slate-100 lg:flex dark:border-white/[0.08] dark:text-gray-400 dark:hover:bg-[#1e293b]"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>

          <button
            onClick={() => setMobileOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 lg:hidden dark:text-gray-400"
          >
            <X size={18} />
          </button>
        </div>

        {/* Admin profile */}
        <div
          className={`mt-6 flex flex-col items-center ${
            collapsed ? "lg:px-2" : "px-5"
          }`}
        >
          <div className="relative">
            <div
              className={`overflow-hidden rounded-full bg-emerald-500 ring-4 ring-emerald-500/10 ${
                collapsed
                  ? "h-10 w-10"
                  : "h-16 w-16"
              }`}
            >
              <Image
                src={user?.avatar?.url || avatarDefault}
                alt="Admin profile"
                fill
                className="rounded-full object-cover"
              />
            </div>

            <span className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500 dark:border-[#111827]" />
          </div>

          <div
            className={`mt-3 text-center transition-all duration-300 ${
              collapsed ? "lg:hidden" : ""
            }`}
          >
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {user?.name}
            </p>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user?.role}
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="elearn-scrollbar mt-8 flex-1 space-y-6 overflow-y-auto px-3 pb-6">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              <p
                className={`mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-400 dark:text-gray-500 ${
                  collapsed ? "lg:hidden" : ""
                }`}
              >
                {section.label}
              </p>
                <ul className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = active === item.id;

                  return (
                    <li key={item.id}>
                      {item.id === "logout" ?
                      
                      ( 
                         <button type="button" 
                         onClick={async () => {
                           setMobileOpen(false); 
                           await handleLogout();
                           }} 
                        
                           title={collapsed ? item.label : undefined} 
                           className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200
                               ${collapsed ? "lg:justify-center" : ""} text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10`} > 
                               <Icon size={18} className="shrink-0" /> 
                               <span className={`whitespace-nowrap ${ collapsed ? "lg:hidden" : "" }`} > 
                                {item.label} </span> 
                                </button>
                     ) : (
                      <Link
                        href={item.path}
                        onClick={() => {
                          setActive(item.id);
                          setMobileOpen(false);
                        }}
                        title={collapsed ? item.label : undefined}
                        className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200
                        ${collapsed ? "lg:justify-center" : ""}
                        ${
                          isActive
                            ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/30"
                            : "text-gray-600 hover:bg-slate-100 dark:text-gray-300 dark:hover:bg-[#1e293b]"
                        }`}
                      >
                        <Icon size={18} className="shrink-0" />

                        <span
                          className={`whitespace-nowrap ${
                            collapsed ? "lg:hidden" : ""
                          }`}
                        >
                          {item.label}
                        </span>
                      </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
