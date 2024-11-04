import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/nextjs";
import React from "react";
import { Skeleton } from "~/components/ui/skeleton";

const LoadableUserButton = () => {
  return (
    <>
      <ClerkLoading>
        <Skeleton className="rounded-full size-7" />
      </ClerkLoading>
      <ClerkLoaded>
        <UserButton />
      </ClerkLoaded>
    </>
  );
};

export default LoadableUserButton;
