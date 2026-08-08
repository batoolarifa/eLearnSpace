"use client";

import { useEffect } from "react";
import OrderAnalytics from "../../components/Admin/Analytics/OrderAnalytics";

export default function Page() {
  useEffect(() => {
    document.title = "Order Analytics • eLearnSpace";
  }, []);

  return <OrderAnalytics />;
}