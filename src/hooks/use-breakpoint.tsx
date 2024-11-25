"use client";

import { useState, useEffect, useLayoutEffect } from "react";

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => window.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
}

export function useBreakpoints() {
  const [isClient, setIsClient] = useState(false);

  const breakpoints = {
    isSm: useMediaQuery("(max-width: 640px"),
    isMd: useMediaQuery("(min-width: 641px) and (max-width: 768px)"),
    isLg: useMediaQuery("(min-width: 769px) and (max-width: 1024px)"),
    isXl: useMediaQuery("(min-width: 1025px) and (max-width: 1280px)"),
    is2Xl: useMediaQuery("(min-width: 1281px)"),
    active: "SSR",
  };

  useLayoutEffect(() => {
    if (typeof window !== "undefined") setIsClient(true);
  }, []);

  if (isClient && breakpoints.isSm) breakpoints.active = "sm";
  if (isClient && breakpoints.isMd) breakpoints.active = "md";
  if (isClient && breakpoints.isLg) breakpoints.active = "lg";
  if (isClient && breakpoints.isXl) breakpoints.active = "xl";
  if (isClient && breakpoints.is2Xl) breakpoints.active = "2xl";

  return breakpoints;
}
