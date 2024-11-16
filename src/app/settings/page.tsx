import React, { Suspense } from "react";
import UserManagementLoading from "~/app/settings/_components/users/user-management-loading";
import UserManagement from "~/app/settings/_components/users/user-management";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { H2 } from "~/components/ui/typography";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { InfoIcon } from "lucide-react";
import SeasonManagementLoading from "~/app/settings/_components/seasons/season-management-loading";
import SeasonManagement from "~/app/settings/_components/seasons/season-management";
import EventManagement from "~/app/settings/_components/events/event-management";
import EventManagementLoading from "~/app/settings/_components/events/event-management-loading";

export const metadata = {
  title: "Settings",
  description: "Samosa stats settings page",
};

// Need this to be a server component so we can render loading states and stream data
const AdminPage = () => {
  return (
    <div className="w-full p-6 flex flex-col gap-4">
      <H2>Settings</H2>
      <Alert variant="info">
        <InfoIcon className="size-5" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          Approvers can <span className="font-semibold">ONLY </span>
          approve, reject, or revoke user access.
        </AlertDescription>
      </Alert>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Season management */}
        <Suspense fallback={<SeasonManagementLoading />}>
          <SeasonManagement />
        </Suspense>

        {/* User management */}
        <Card>
          <CardHeader>
            <CardTitle>User management</CardTitle>
            <CardDescription>
              <span className="font-semibold">NOTE:</span> You cannot update
              your own admin role.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<UserManagementLoading />}>
              <UserManagement />
            </Suspense>
          </CardContent>
        </Card>

        {/* Event management */}
        <div className="md:col-span-2">
          <Suspense fallback={<EventManagementLoading />}>
            <EventManagement />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
