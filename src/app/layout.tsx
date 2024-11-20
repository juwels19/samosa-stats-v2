import type { Metadata } from "next";
import "./globals.css";

import localFont from "next/font/local";

import { ClerkProvider } from "@clerk/nextjs";
import Providers from "~/providers";
import NavigationBar from "~/components/common/navigation/navigation-bar";
import { Toaster } from "sonner";
import Navigation from "~/components/common/navigation/navigation";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Samosa Stats",
    default: "Samosa Stats",
  },
  description: "Degenerate FRC fantasy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Providers>
            <div className="min-h-svh font-geistSans bg-slate-50 dark:bg-slate-950">
              <main className="flex flex-col w-full min-h-svh max-w-[1440px] mx-auto">
                {/* <NavigationBar /> */}
                <Navigation />
                <Toaster richColors position="top-right" closeButton />
                {children}
              </main>
            </div>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
