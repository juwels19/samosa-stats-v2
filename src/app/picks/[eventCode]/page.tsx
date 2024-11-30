import PickTabs from "~/app/picks/[eventCode]/_components/pick-tabs";
import BlueAllianceLink from "~/components/common/external-links/blue-alliance";
import StatboticsLink from "~/components/common/external-links/statbotics";
import PageHeading from "~/components/common/page-heading";
import { getCategoriesForActiveSeason } from "~/db/queries/categories";
import { getEventByEventCode } from "~/db/queries/events";
import { ROUTES } from "~/lib/routes";

export const metadata = {
  title: "Submit Picks",
  description: "Page to make picks for an event",
};

const EventPickPage = async ({
  params,
}: {
  params: Promise<{ eventCode: string }>;
}) => {
  const eventCode = (await params).eventCode;

  const [event, categories] = await Promise.all([
    getEventByEventCode(eventCode),
    getCategoriesForActiveSeason(),
  ]);

  if (!event) return <div>Event not found</div>;

  return (
    <div className="w-full p-6 flex flex-col gap-4">
      {/* PAGE HEADING + EXTERNAL LINKS */}
      <div className="flex flex-row gap-4 justify-between">
        <PageHeading
          label={`${eventCode.slice(0, 4)} - ${
            event.displayName || event.name
          }`}
          hasBackButton
          backButtonHref={ROUTES.DASHBOARD}
        />
        <div className="flex flex-col md:flex-row gap-2 items-start">
          <StatboticsLink event={event} />
          <BlueAllianceLink event={event} />
        </div>
      </div>
      {/* TAB CONTENT */}
      <PickTabs event={event} categories={categories} />
    </div>
  );
};

export default EventPickPage;
