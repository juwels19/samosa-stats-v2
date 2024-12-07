import React from "react";
import RankingTable from "~/app/leaderboard/_components/event-ranking/event-ranking-table";
import PageHeading from "~/components/common/page-heading";
import { H2 } from "~/components/ui/typography";
import { EventWithPicks, getEventByEventCode } from "~/db/queries/events";
import { ROUTES } from "~/lib/routes";

export const metadata = {
  title: "Event Results",
  description: "Event specific leaderboard page",
};

const EventSpecificLeaderboardPage = async ({
  params,
}: {
  params: Promise<{ eventCode: string }>;
}) => {
  const eventCode = (await params).eventCode;

  const event: EventWithPicks | null = await getEventByEventCode(eventCode);

  if (!event) return;

  return (
    <div className="w-full p-6 flex flex-col gap-4">
      <PageHeading
        label={`${event?.displayName || event?.name || eventCode} results`}
        hasBackButton
        backButtonHref={ROUTES.LEADERBOARD}
      />
      {event && (!event.isComplete || !event.Pick[0].score) ? (
        <div className="w-full flex flex-col items-center">
          <H2>Results are not ready yet!</H2>
          <H2>Check back later to see the results!</H2>
        </div>
      ) : (
        <RankingTable event={event} shouldShowLegend />
      )}
    </div>
  );
};

export default EventSpecificLeaderboardPage;
