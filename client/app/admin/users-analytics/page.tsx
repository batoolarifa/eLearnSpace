"use client";

import { useEffect } from "react";
import UserAnalytics from "../../components/Admin/Analytics/UserAnalytics";

export default function Page() {
  useEffect(() => {
    document.title = "User Analytics • eLearnSpace";
  }, []);

  return <UserAnalytics />;
}