
'use client';

import React, { FC } from "react";
import Image from "next/image";
import avatarDefault from "../../../public/assets/avatar.jpg";
import { RiLockPasswordLine } from "react-icons/ri";
import { SiCoursera } from "react-icons/si";
import { AiOutlineLogout } from "react-icons/ai";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import Link from "next/link";

type Props = {
  user: any;
  active: number;
  avatar: string | null;
  setActive: (active: number) => void;
  logoutHandler: any;
};

const SideBarProfile: FC<Props> = ({
  user,
  active,
  avatar,
  setActive,
  logoutHandler,
}) => {
  const baseItem =
    "flex items-center gap-3 whitespace-nowrap px-4 py-3.5 cursor-pointer text-sm transition-colors duration-200 rounded-lg";
  const activeItem =
    "bg-emerald-50 text-emerald-700 font-semibold dark:bg-emerald-900/30 dark:text-emerald-400";
  const inactiveItem =
    "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800";

  return (
    <div
      className="
        flex w-full gap-1 overflow-x-auto p-2
        800:flex-col 800:gap-1 800:overflow-visible 800:p-3
      "
    >
      {/* My Account */}
      <div
        className={`${baseItem} ${active === 1 ? activeItem : inactiveItem}`}
        onClick={() => setActive(1)}
      >
        <Image
          src={user?.avatar?.url || avatar || avatarDefault}
          alt=""
          width={26}
          height={26}
          className="h-[26px] w-[26px] flex-shrink-0 rounded-full object-cover ring-2 ring-emerald-100 dark:ring-emerald-900/40"
        />
        <span className="font-poppins">My Account</span>
      </div>

      {/* Change Password */}
      <div
        className={`${baseItem} ${active === 2 ? activeItem : inactiveItem}`}
        onClick={() => setActive(2)}
      >
        <RiLockPasswordLine size={20} className="flex-shrink-0" />
        <span className="font-poppins">Change Password</span>
      </div>

      {/* Enrolled Courses */}
      <div
        className={`${baseItem} ${active === 3 ? activeItem : inactiveItem}`}
        onClick={() => setActive(3)}
      >
        <SiCoursera size={20} className="flex-shrink-0" />
        <span className="font-poppins">Enrolled Courses</span>
      </div>

      {/* Admin Dashboard */}
      {user?.role === "admin" && (
        <Link
          href="/admin"
          className={`${baseItem} ${active === 6 ? activeItem : inactiveItem}`}
          onClick={() => setActive(6)}
        >
          <MdOutlineAdminPanelSettings size={20} className="flex-shrink-0" />
          <span className="font-poppins">Admin Dashboard</span>
        </Link>
      )}

      {/* Logout */}
      <div
        className={`${baseItem} ${active === 4 ? activeItem : inactiveItem} 800:mt-2 800:border-t 800:border-slate-100 800:pt-4 dark:800:border-slate-800`}
        onClick={() => {
          setActive(4);
          logoutHandler();
        }}
      >
        <AiOutlineLogout size={20} className="flex-shrink-0" />
        <span className="font-poppins">Log Out</span>
      </div>
    </div>
  );
};

export default SideBarProfile;