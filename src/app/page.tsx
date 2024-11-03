import { ThemeSwitcher } from "~/components/common/theme-switcher";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-svh font-geistSans bg-slate-50 dark:bg-slate-950">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <ThemeSwitcher />
        This is the main page
      </main>
    </div>
  );
}
