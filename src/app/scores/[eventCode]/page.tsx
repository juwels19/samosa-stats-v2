import { InfoIcon } from "lucide-react";
import React from "react";
import RankingTable from "~/app/leaderboard/_components/event-ranking/event-ranking-table";
import ScoreEntryForm from "~/app/scores/_components/score-entry-form";
import TeamFrequencyBreakdown from "~/app/scores/_components/team-frequency-breakdown/team-frequency-breakdown";
import PageHeading from "~/components/common/page-heading";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { H3 } from "~/components/ui/typography";
import { getCategoryCountsForEvent } from "~/db/queries/categories";
import { getEventByEventCode } from "~/db/queries/events";
import { getTeamPickCountsForEvent } from "~/db/queries/picks";
import { ROUTES } from "~/lib/routes";

export const metadata = {
  title: "Score Entry",
  description: "Page so submit scores for an event",
};

const EventScoreEntryPage = async ({
  params,
}: {
  params: Promise<{ eventCode: string }>;
}) => {
  const eventCode = (await params).eventCode;

  const [event, seasonCategories] = await Promise.all([
    getEventByEventCode(eventCode),
    getCategoryCountsForEvent(eventCode),
  ]);

  const teamPickCount = await getTeamPickCountsForEvent(event!.id);

  if (!event)
    return (
      <Alert variant="destructive" className="mt-10">
        <InfoIcon />
        <AlertTitle>Something went wrong!</AlertTitle>
        <AlertDescription>
          Please reload the page and try again... Or talk to Julian.
        </AlertDescription>
      </Alert>
    );

  return (
    <div className="w-full p-6 flex flex-col gap-4">
      <PageHeading
        label={`Score entry for ${event?.displayName || event?.name}`}
        hasBackButton
        backButtonHref={ROUTES.SCORES}
      />
      <Alert variant="info" className="mb-2">
        <InfoIcon />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          To enter scores, select the winning team(s) from the dropdown for each
          category.
        </AlertDescription>
        <AlertDescription>
          NOTE: If a category name gets truncated, you can click on the name to
          see the full category.
        </AlertDescription>
      </Alert>
      <ScoreEntryForm event={event} categories={seasonCategories} />
      <div className="grid grid-cols-1 md:grid-cols-8 md:gap-8 items-stretch">
        <div className="md:col-span-2">
          <TeamFrequencyBreakdown data={teamPickCount} />
        </div>
        <div className="flex flex-col gap-4 md:col-span-6">
          <H3>Event ranking</H3>
          <RankingTable event={event} shouldShowLegend />
        </div>
      </div>
    </div>
  );
};

export default EventScoreEntryPage;
