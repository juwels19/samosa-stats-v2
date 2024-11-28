import { TriangleAlertIcon } from "lucide-react";
import React from "react";
import EventCard from "~/components/common/event-card";
import PageHeading from "~/components/common/page-heading";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { getEventsReadyForScoring } from "~/db/queries/events";

export const metadata = {
  title: "Scores",
  description: "Landing page for score submissions",
};

const ScoresLandingPage = async () => {
  const eventsToScore = await getEventsReadyForScoring();

  return (
    <div className="w-full p-6 flex flex-col gap-4">
      <PageHeading label="Submit scores" />
      {eventsToScore.length === 0 ? (
        <Alert variant="warning">
          <TriangleAlertIcon />
          <AlertTitle>
            Check back later when there are any events ready for scoring!
          </AlertTitle>
          <AlertDescription>
            Events are considered ready to score when they are closed for
            submission and completed.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
          {eventsToScore.map((event) => (
            <EventCard key={event.eventCode} event={event} type="scoring" />
          ))}
        </div>
      )}
    </div>
  );
};

export default ScoresLandingPage;
