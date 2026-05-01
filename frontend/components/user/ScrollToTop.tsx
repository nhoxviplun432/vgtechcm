"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    requestAnimationFrame(() => {
      const el = document.querySelector<HTMLElement>(".user-scroll-container");
      if (el) el.scrollTop = 0;
    });
  }, [pathname]);

  return null;
}