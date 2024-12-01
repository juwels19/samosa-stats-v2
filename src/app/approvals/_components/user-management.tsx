import { approvedTableColumns } from "~/app/approvals/_components/table-columns/approved-table-columns";
import { pendingTableColumns } from "~/app/approvals/_components/table-columns/pending-table-columns";
import { rejectedTableColumns } from "~/app/approvals/_components/table-columns/rejected-table-columns";
import { DataTable } from "~/components/ui/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { getClerkUsers } from "~/server/actions/clerk";

import { currentUser } from "@clerk/nextjs/server";

const UserManagement = async () => {
  const users = await getClerkUsers();

  const signedInUser = await currentUser();

  const isSignedInUserApprover = signedInUser?.privateMetadata.approver;

  return (
    <Tabs defaultValue="approved">
      <TabsList className="w-full">
        <TabsTrigger className="grow" value="approved">
          Approved
        </TabsTrigger>
        {isSignedInUserApprover ? (
          <TabsTrigger className="grow" value="pending">
            Pending
          </TabsTrigger>
        ) : null}
        <TabsTrigger className="grow" value="rejected">
          Rejected
        </TabsTrigger>
      </TabsList>
      <TabsContent value="approved" className="mt-4">
        <DataTable
          columns={approvedTableColumns}
          data={users.filter((user) => !user.privateMetadata.rejected)}
        />
      </TabsContent>
      {isSignedInUserApprover ? (
        <TabsContent value="pending">
          <DataTable
            columns={pendingTableColumns}
            data={users.filter(
              (user) =>
                !user.privateMetadata.approved && !user.privateMetadata.rejected
            )}
          />
        </TabsContent>
      ) : null}
      <TabsContent value="rejected">
        <DataTable
          columns={rejectedTableColumns}
          data={users.filter((user) => user.privateMetadata.rejected)}
        />
      </TabsContent>
    </Tabs>
  );
};

export default UserManagement;
