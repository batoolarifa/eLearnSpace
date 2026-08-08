"use client";

import { useEffect } from "react";
import CreateCourse from "../../components/Admin/Course/CreateCourse";

export default function Page() {
  useEffect(() => {
    document.title = "Create Course • eLearnSpace";
  }, []);

  return <CreateCourse />;
}