"use client";

import { useMutation } from "@tanstack/react-query";
import { Loader2Icon, UserCheckIcon } from "lucide-react";
import React from "react";
import { Button } from "~/components/ui/button";
import { useBreakpoints } from "~/hooks/use-breakpoint";
import {
  ClerkUser,
  updateClerkUserPrivateMetadata,
} from "~/server/actions/clerk";

const ApproveUserButton = ({ user }: { user: ClerkUser }) => {
  const approveUser = useMutation({
    mutationFn: () =>
      updateClerkUserPrivateMetadata({
        clerkId: user.clerkId,
        newPrivateMetadata: { approved: true },
      }),
  });

  const { isSm } = useBreakpoints();

  return (
    <Button
      size={isSm ? "icon" : "sm"}
      onClick={() => approveUser.mutate()}
      disabled={approveUser.isPending}
    >
      {approveUser.isPending ? (
        <Loader2Icon className="animate-spin" />
      ) : (
        <UserCheckIcon />
      )}
      {!isSm && "Approve"}
    </Button>
  );
};

export default ApproveUserButton;
