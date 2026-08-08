"use client";

import { useEffect, useState } from "react";
import { useLoadUserQuery } from "../../redux/features/api/apiSlice";
import Loader from "../components/Loader/Loader";

export default function Custom({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { isLoading } = useLoadUserQuery({});

  if (!mounted) return null;

  if (isLoading) return <Loader />;

  return <>{children}</>;
}