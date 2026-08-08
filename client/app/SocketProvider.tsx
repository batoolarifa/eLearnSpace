"use client";

import { useEffect } from "react";
import { socket } from "./lib/socket";

export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    

    socket.on("connect", () => {});

    return () => {
      socket.off("connect", () => {});
    };
  }, []);

  return <>{children}</>;
}