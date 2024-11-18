"use client";

import { ClerkUser } from "~/server/actions/clerk";
import { ColumnDef } from "@tanstack/react-table";
import { User } from "@nextui-org/user";
import ApproveUserButton from "~/app/approvals/_components/approve-user-button";

export const rejectedTableColumns: ColumnDef<ClerkUser>[] = [
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
    id: "actions",
    cell: ({ row }) => (
      <div className="flex justify-end">
        <ApproveUserButton user={row.original} />
      </div>
    ),
  },
];
