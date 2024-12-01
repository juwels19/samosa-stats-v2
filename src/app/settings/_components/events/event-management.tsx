import { compareAsc, parseJSON } from "date-fns";
import { TriangleAlertIcon } from "lucide-react";
import EventCard from "~/components/common/event-card";
import NewEventForm from "~/app/settings/_components/events/new-event-form";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  ActiveSeasonWithEventsAndPicks,
  getActiveSeason,
} from "~/db/queries/seasons";

const EventManagement = async () => {
  const activeSeason: ActiveSeasonWithEventsAndPicks | null =
    await getActiveSeason();

  if (!activeSeason) return;

  return (
    <Card className="h-full">
      <CardHeader className="w-full">
        <CardTitle className="flex justify-between items-center gap-4">
          Events
          <NewEventForm activeSeason={activeSeason} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activeSeason.Event.length === 0 && (
          <Alert variant={"warning"}>
            <TriangleAlertIcon className="size-5" />
            <AlertTitle>No events found!</AlertTitle>
            <AlertDescription>
              There are no events setup for this season. Use the button above to
              add events!
            </AlertDescription>
          </Alert>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeSeason.Event.sort((a, b) =>
            compareAsc(parseJSON(a.startDate), parseJSON(b.startDate))
          ).map((event) => (
            <EventCard key={event.eventCode} event={event} type="admin" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventManagement;
