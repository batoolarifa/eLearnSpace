"use client";

import { useEffect } from "react";
import EditCategories from "../../components/Admin/Customization/EditCategories";

 const Page = () => {
  useEffect(() => {
    document.title = "Edit Categories • eLearnSpace";
  }, []);

  return <EditCategories />;
}

export default Page;