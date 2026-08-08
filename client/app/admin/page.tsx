"use client";

import { useEffect } from "react";
import DashboardContent from "../components/Admin/sidebar/DashboardContent";
import { useTheme } from "next-themes";


export default function Page() {
    const { theme } = useTheme();
  useEffect(() => {
    document.title = "Admin Dashboard • eLearnSpace";
  }, []);

  return <DashboardContent  theme={theme}/>;
}


