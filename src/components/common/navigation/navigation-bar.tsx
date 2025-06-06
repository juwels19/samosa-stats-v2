"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import LoadableUserButton from "~/components/common/loadable-user-button";
import { ThemeSwitcher } from "~/components/common/theme-switcher";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/navbar";
import { ROUTES } from "~/lib/routes";

const logo = "/SS_logo.png";

const menuItems = [{ label: "Dashboard", href: ROUTES.DASHBOARD }];

const adminMenuItems = [
  { label: "Approvals", href: ROUTES.APPROVALS },
  { label: "Leaderboard", href: ROUTES.LEADERBOARD },
  { label: "Scores", href: ROUTES.SCORES },
  { label: "Settings", href: ROUTES.SETTINGS },
];

const NavigationBar = ({
  clerkUserMetadata,
}: {
  clerkUserMetadata: {
    admin?: boolean;
    approver?: boolean;
    approved?: boolean;
    rejected?: boolean;
  } | null;
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  if (!pathname) return null;

  return (
    <Navbar
      isBlurred
      className="bg-slate-50/50 dark:bg-slate-950/50"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      maxWidth="full"
    >
      <NavbarContent>
        {pathname !== "/" && (
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="md:hidden"
          />
        )}
        <NavbarBrand>
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={logo}
              alt="Samosa stats logo"
              width={50}
              height={50}
              className="rounded-lg"
            />

            <p className="font-bold text-inherit text-lg md:text-xl tracking-tight">
              Samosa Stats
            </p>
          </Link>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent
        justify="center"
        className="hidden md:inline-flex flex-row gap-2"
      >
        {pathname !== "/" &&
          clerkUserMetadata?.approved &&
          menuItems.map((menuItem) => (
            <Link key={`nav-item-${menuItem.href}`} href={menuItem.href}>
              <NavbarItem
                isActive={pathname.includes(menuItem.href)}
                className={cn(
                  "p-2 rounded-md hover:bg-slate-200 hover:dark:bg-slate-800",
                  pathname.includes(menuItem.href) &&
                    "bg-slate-200 dark:bg-slate-800"
                )}
              >
                {menuItem.label}
              </NavbarItem>
            </Link>
          ))}
        {clerkUserMetadata?.admin &&
        clerkUserMetadata?.approved &&
        pathname !== "/"
          ? adminMenuItems.map((menuItem) => (
              <Link
                key={`admin-nav-item-${menuItem.href}`}
                href={menuItem.href}
              >
                <NavbarItem
                  isActive={pathname.includes(menuItem.href)}
                  className={cn(
                    "p-2 rounded-md hover:bg-slate-200 hover:dark:bg-slate-800",
                    pathname.includes(menuItem.href) &&
                      "bg-slate-200 dark:bg-slate-800"
                  )}
                >
                  {menuItem.label}
                </NavbarItem>
              </Link>
            ))
          : null}
      </NavbarContent>
      <NavbarContent justify="end" className="gap-2">
        <NavbarItem>
          <ThemeSwitcher />
        </NavbarItem>
        <SignedIn>
          <NavbarItem className="flex flex-col justify-center">
            <LoadableUserButton />
          </NavbarItem>
        </SignedIn>
        <SignedOut>
          <NavbarItem>
            <SignInButton>
              <Button>Sign In</Button>
            </SignInButton>
          </NavbarItem>
        </SignedOut>
      </NavbarContent>
      <NavbarMenu className="bg-slate-50 dark:bg-gray-950">
        {pathname !== "/" &&
          clerkUserMetadata?.approved &&
          menuItems.map((item, index) => (
            <NavbarMenuItem
              key={`${item}-${index}`}
              isActive={pathname.includes(item.href)}
            >
              <Link
                color={
                  index === 2
                    ? "primary"
                    : index === menuItems.length - 1
                    ? "danger"
                    : "foreground"
                }
                className={cn(
                  "px-2 py-1 rounded-md",
                  pathname.includes(item.href) &&
                    "bg-slate-200 dark:bg-slate-800"
                )}
                href={item.href}
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        {clerkUserMetadata?.admin &&
        pathname !== "/" &&
        clerkUserMetadata?.approved
          ? adminMenuItems.map((item, index) => (
              <NavbarMenuItem
                key={`${item}-${index}`}
                isActive={pathname.includes(item.href)}
              >
                <Link
                  color={
                    index === 2
                      ? "primary"
                      : index === menuItems.length - 1
                      ? "danger"
                      : "foreground"
                  }
                  className={cn(
                    "px-2 py-1 rounded-md",
                    pathname.includes(item.href) &&
                      "bg-slate-200 dark:bg-slate-800"
                  )}
                  href={item.href}
                >
                  {item.label}
                </Link>
              </NavbarMenuItem>
            ))
          : null}
      </NavbarMenu>
    </Navbar>
  );
};

export default NavigationBar;
