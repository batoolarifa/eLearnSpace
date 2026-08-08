"use client";

import { useEffect } from "react";
import AllUsers from "../../components/Admin/Users/AllUsers";

export default function Page() {
  useEffect(() => {
    document.title = "Teams • eLearnSpace";
  }, []);

  return <AllUsers isTeam = {true} />;
}