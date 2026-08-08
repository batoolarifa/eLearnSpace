"use client";

import { useEffect } from "react";
import EditFAQ from "../../components/Admin/Customization/EditFAQ";

 const Page = () => {
  useEffect(() => {
    document.title = "Edit FAQ • eLearnSpace";
  }, []);

  return <EditFAQ />;
}

export default Page;