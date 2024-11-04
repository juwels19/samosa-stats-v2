"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "~/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { Skeleton } from "~/components/ui/skeleton";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <Skeleton className="size-9" />;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => (theme === "light" ? setTheme("dark") : setTheme("light"))}
      aria-label="Toggle theme"
    >
      <Sun className="hidden dark:block" />
      <Moon className="block dark:hidden" />
    </Button>
  );
}
