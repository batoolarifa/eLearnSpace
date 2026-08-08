"use client";

import { useEffect } from "react";
import AllCourses from "../../components/Admin/Course/AllCourses";

export default function Page() {
  useEffect(() => {
    document.title = "All Courses • eLearnSpace";
  }, []);

  return <AllCourses />;
}