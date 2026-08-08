"use client";

import { useEffect } from "react";
import Invoices from "../../components/Admin/Order/Invoices";

 const Page = () => {
  useEffect(() => {
    document.title = "All Invoices • eLearnSpace";
  }, []);

  return <Invoices />;
}

export default Page;