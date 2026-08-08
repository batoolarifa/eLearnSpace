"use client";

import { useEffect } from "react";
import EditCourse from "../../../components/Admin/Course/EditCourse";

 const Page = () => {
  useEffect(() => {
    document.title = "Edit Course • eLearnSpace";
  }, []);

  return <EditCourse />;
}

export default Page;