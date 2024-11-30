import { currentUser } from "@clerk/nextjs/server";
import { InfoIcon } from "lucide-react";
import React from "react";
import EventCard from "~/components/common/event-card";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { H2, H3 } from "~/components/ui/typography";
import { getAllEventsAndPicksForUser } from "~/db/queries/events";

export const metadata = {
  title: "Dashboard",
  description: "Samosa stats dashboard page",
};

const DashboardPage = async () => {
  const user = await currentUser();
  const events = await getAllEventsAndPicksForUser(user!.id);
  const openEvents = events.filter(
    (event) => !event.isComplete && !event.isOngoing
  );
  const closedEvents = events.filter(
    (event) => event.isComplete && !event.isOngoing
  );
  const ongoingEvents = events.filter(
    (event) => event.isOngoing && !event.isComplete
  );

  return (
    <div className="w-full p-6 flex flex-col gap-4">
      <H2>Dashboard</H2>
      {ongoingEvents.length > 0 && (
        <>
          <H3>Ongoing Events</H3>
          <Alert variant="info">
            <InfoIcon />
            <AlertTitle>{`You're in luck!`}</AlertTitle>
            <AlertDescription>
              {`Late submissions are ALLOWED for ongoing events... However they must be RANDOM.`}
            </AlertDescription>
          </Alert>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
            {ongoingEvents.map((event) => (
              <EventCard key={event.eventCode} event={event} />
            ))}
          </div>
        </>
      )}
      <H3>Open Events</H3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
        {openEvents.map((event) => (
          <EventCard key={event.eventCode} event={event} />
        ))}
      </div>
      {closedEvents.length > 0 && (
        <>
          <H3>Closed Events</H3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
            {closedEvents.map((event) => (
              <EventCard key={event.eventCode} event={event} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
