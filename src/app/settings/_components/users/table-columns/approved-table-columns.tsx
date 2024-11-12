"use client";

import { ClerkUser } from "~/server/actions/clerk";
import { ColumnDef } from "@tanstack/react-table";
import { User } from "@nextui-org/user";
import { CheckIcon, XIcon } from "lucide-react";
import { ApprovedActionMenu } from "~/app/settings/_components/users/approved-action-menu";

export const approvedTableColumns: ColumnDef<ClerkUser>[] = [
  {
    accessorKey: "fullName",
    header: "Name",
    cell: ({ row }) => (
      <User
        className="[&>span]:shrink-0"
        avatarProps={{ src: row.original.imageUrl }}
        name={row.original.fullName}
      />
    ),
  },
  {
    accessorKey: "privateMetadata.admin",
    header: "Admin",
    cell: ({ row }) => (
      <div className="flex justify-center min-[470px]:justify-start">
        {row.original.privateMetadata.admin ? (
          <span>
            <CheckIcon className="size-5 text-green-800 dark:text-green-600" />
          </span>
        ) : (
          <span>
            <XIcon className="size-5 text-red-800 dark:text-red-600" />
          </span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "privateMetadata.approver",
    header: "Approver",
    cell: ({ row }) => (
      <div className="flex justify-center min-[470px]:justify-start">
        {row.original.privateMetadata.approver ? (
          <span>
            <CheckIcon className="size-5 text-green-800 dark:text-green-600" />
          </span>
        ) : (
          <span>
            <XIcon className="size-5 text-red-800 dark:text-red-600" />
          </span>
        )}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex justify-end">
        <ApprovedActionMenu user={row.original} />
      </div>
    ),
  },
];
