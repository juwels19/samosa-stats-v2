import { currentUser } from "@clerk/nextjs/server";
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
      <CardHeader>
        <CardTitle className="flex justify-between gap-4">Events</CardTitle>
      </CardHeader>
      <CardContent className=""></CardContent>
    </Card>
  );
};

export default EventManagement;
