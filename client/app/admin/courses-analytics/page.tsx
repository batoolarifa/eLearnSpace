"use client";

import { useEffect } from "react";
import CourseAnalytics from "../../components/Admin/Analytics/CourseAnalytics";

export default function Page() {
  useEffect(() => {
    document.title = "Course Analytics • eLearnSpace";
  }, []);

  return <CourseAnalytics />;
}