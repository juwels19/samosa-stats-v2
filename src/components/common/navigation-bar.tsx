"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import LoadableUserButton from "~/components/common/loadable-user-button";
import { ThemeSwitcher } from "~/components/common/theme-switcher";
import { Button } from "~/components/ui/button";

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

const logo = "/SS_logo.png";

const menuItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Settings", href: "/settings" },
];

const NavigationBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Navbar
      isBlurred
      className="bg-slate-50/50 dark:bg-slate-950/50"
      onMenuOpenChange={setIsMenuOpen}
      maxWidth="full"
    >
      <NavbarContent>
        {/* <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        /> */}
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
      {/* <NavbarMenu className="bg-slate-50 dark:bg-gray-950">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              color={
                index === 2
                  ? "primary"
                  : index === menuItems.length - 1
                  ? "danger"
                  : "foreground"
              }
              className="w-full"
              href={item.href}
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu> */}
    </Navbar>
  );
};

export default NavigationBar;
