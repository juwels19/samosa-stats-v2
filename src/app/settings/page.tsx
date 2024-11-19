import React, { Suspense } from "react";
import { H2 } from "~/components/ui/typography";
import SeasonManagementLoading from "~/app/settings/_components/seasons/season-management-loading";
import SeasonManagement from "~/app/settings/_components/seasons/season-management";
import EventManagement from "~/app/settings/_components/events/event-management";
import EventManagementLoading from "~/app/settings/_components/events/event-management-loading";
import CategoryManagement from "~/app/settings/_components/categories/category-management";
import CategoryManagementLoading from "~/app/settings/_components/categories/category-management-loading";

export const metadata = {
  title: "Settings",
  description: "Samosa stats settings page",
};

// Need this to be a server component so we can render loading states and stream data
const SettingsPage = () => {
  return (
    <div className="w-full p-6 flex flex-col gap-4">
      <H2>Settings</H2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Season management */}
        <Suspense fallback={<SeasonManagementLoading />}>
          <SeasonManagement />
        </Suspense>

        <Suspense fallback={<CategoryManagementLoading />}>
          <CategoryManagement />
        </Suspense>

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

export default SettingsPage;
