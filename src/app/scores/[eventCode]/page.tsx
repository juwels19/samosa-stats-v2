import { InfoIcon } from "lucide-react";
import React from "react";
import ScoreEntryForm from "~/app/scores/_components/score-entry-form";
import PageHeading from "~/components/common/page-heading";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { getCategoryCountsForEvent } from "~/db/queries/categories";
import { getEventByEventCode } from "~/db/queries/events";
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
      <Alert variant="info">
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
    </div>
  );
};

export default EventScoreEntryPage;
