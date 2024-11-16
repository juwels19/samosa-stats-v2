import { currentUser } from "@clerk/nextjs/server";
import NewEventForm from "~/app/settings/_components/events/new-event-form";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { getActiveSeason } from "~/db/queries/seasons";

const EventManagement = async () => {
  const [activeSeason, signedInUser] = await Promise.all([
    getActiveSeason(),
    currentUser(),
  ]);

  console.log(activeSeason);
  console.log(signedInUser);

  return (
    <Card className="h-full">
      <CardHeader className="w-full">
        <CardTitle className="flex justify-between items-center gap-4">
          Events
          <NewEventForm activeSeason={activeSeason} />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row"></CardContent>
    </Card>
  );
};

export default EventManagement;
