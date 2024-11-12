"use client";

import { useMutation } from "@tanstack/react-query";
import { Loader2Icon, UserXIcon } from "lucide-react";
import React from "react";
import { Button } from "~/components/ui/button";
import { useBreakpoints } from "~/hooks/use-breakpoint";
import {
  ClerkUser,
  updateClerkUserPrivateMetadata,
} from "~/server/actions/clerk";

const RejectUserButton = ({ user }: { user: ClerkUser }) => {
  const rejectUser = useMutation({
    mutationFn: () =>
      updateClerkUserPrivateMetadata({
        clerkId: user.clerkId,
        newPrivateMetadata: { rejected: true, approved: false },
      }),
  });

  const { isSm } = useBreakpoints();

  return (
    <Button
      size={isSm ? "icon" : "sm"}
      onClick={() => rejectUser.mutate()}
      disabled={rejectUser.isPending}
      variant="destructive"
    >
      {rejectUser.isPending ? (
        <Loader2Icon className="animate-spin" />
      ) : (
        <UserXIcon />
      )}
      {!isSm && "Reject"}
    </Button>
  );
};

export default RejectUserButton;
