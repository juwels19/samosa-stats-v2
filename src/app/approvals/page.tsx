import { InfoIcon } from "lucide-react";
import React, { Suspense } from "react";
import UserManagement from "~/app/approvals/_components/user-management";
import UserManagementLoading from "~/app/approvals/_components/user-management-loading";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { H2 } from "~/components/ui/typography";

const ApprovalPage = () => {
  return (
    <div className="w-full p-6 flex flex-col gap-4">
      <H2>Approvals</H2>
      <Alert variant="info">
        <InfoIcon className="size-5" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          You cannot update your own admin role.
        </AlertDescription>
      </Alert>
      <Suspense fallback={<UserManagementLoading />}>
        <UserManagement />
      </Suspense>
    </div>
  );
};

export default ApprovalPage;
