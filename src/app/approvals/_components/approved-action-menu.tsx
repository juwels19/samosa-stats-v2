"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import {
  Ellipsis,
  Loader2,
  ShieldIcon,
  UserPenIcon,
  UserXIcon,
} from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";
import {
  ClerkUser,
  updateClerkUserPrivateMetadata,
} from "~/server/actions/clerk";

export const ApprovedActionMenu = ({ user }: { user: ClerkUser }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { user: clerkUser } = useUser();

  const toggleAdminMutation = useMutation({
    mutationFn: () =>
      updateClerkUserPrivateMetadata({
        clerkId: user.clerkId,
        newPrivateMetadata: {
          ...user.privateMetadata,
          admin: !user.privateMetadata.admin,
        },
      }),
    onSuccess: () => {
      setIsDropdownOpen(false);
    },
  });

  const toggleApproverMutation = useMutation({
    mutationFn: () =>
      updateClerkUserPrivateMetadata({
        clerkId: user.clerkId,
        newPrivateMetadata: {
          ...user.privateMetadata,
          approver: !user.privateMetadata.approver,
        },
      }),
    onSuccess: () => {
      setIsDropdownOpen(false);
    },
  });

  const toggleAccessMutation = useMutation({
    mutationFn: () =>
      updateClerkUserPrivateMetadata({
        clerkId: user.clerkId,
        newPrivateMetadata: {
          rejected: true,
        },
      }),
    onSuccess: () => {
      setIsDropdownOpen(false);
    },
  });

  return (
    <DropdownMenu
      open={isDropdownOpen}
      onOpenChange={setIsDropdownOpen}
      modal={false}
    >
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" className="size-8">
          <Ellipsis
            className={cn(
              "size-5 transition-all",
              isDropdownOpen ? "rotate-90" : ""
            )}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={!clerkUser || user.clerkId === clerkUser.id}
          onClick={(e) => {
            e.preventDefault();
            toggleAdminMutation.mutate();
          }}
        >
          {toggleAdminMutation.isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <ShieldIcon />
          )}
          Toggle Admin
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault();
            toggleApproverMutation.mutate();
          }}
        >
          {toggleApproverMutation.isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <UserPenIcon />
          )}
          Toggle Approver
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault();
            toggleAccessMutation.mutate();
          }}
        >
          {toggleAccessMutation.isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <UserXIcon color="red" />
          )}
          Revoke Access
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
