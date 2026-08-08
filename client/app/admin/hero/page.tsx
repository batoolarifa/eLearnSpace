"use client";

import { useEffect } from "react";
import EditHero from "../../components/Admin/Customization/EditHero";

 const Page = () => {
  useEffect(() => {
    document.title = "Edit Hero • eLearnSpace";
  }, []);

  return <EditHero />;
}

export default Page;