import Image from "next/image";
import PickTabs from "~/app/picks/[eventCode]/_components/pick-tabs";
import PageHeading from "~/components/common/page-heading";
import { Button } from "~/components/ui/button";
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
            event?.displayName ?? event!.name
          }`}
          hasBackButton
          backButtonHref={ROUTES.DASHBOARD}
        />
        <div className="flex flex-col md:flex-row gap-2 items-start">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`https://statbotics.io/event/${event?.eventCode}`}
          >
            <Button
              size="icon"
              className="bg-white hover:bg-white dark:hover:bg-white"
            >
              <Image
                src="/statbotics.svg"
                alt="Statbotics logo"
                width={30}
                height={30}
              />
            </Button>
          </a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`https://thebluealliance.com/event/${event?.eventCode}`}
          >
            <Button
              size="icon"
              className="bg-[#44519b] dark:bg-[#44519b] hover:dark:bg-[#44519b] hover:bg-[#44519b]"
            >
              <Image
                src="https://www.thebluealliance.com/images/tba_lamp.svg"
                alt="The Blue Alliance logo"
                width={15}
                height={15}
              />
            </Button>
          </a>
        </div>
      </div>
      {/* TAB CONTENT */}
      <PickTabs event={event} categories={categories} />
    </div>
  );
};

export default EventPickPage;
