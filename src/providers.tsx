"use client";

import { ThemeProvider } from "next-themes";
import { NextUIProvider } from "@nextui-org/react";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <NextUIProvider>
      <ThemeProvider attribute="class">{children}</ThemeProvider>
    </NextUIProvider>
  );
};

export default Providers;
