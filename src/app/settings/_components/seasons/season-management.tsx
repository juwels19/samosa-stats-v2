import { currentUser } from "@clerk/nextjs/server";
import { TriangleAlertIcon } from "lucide-react";
import React from "react";
import NewSeasonButton from "~/app/settings/_components/seasons/new-season-button";
import { AlertDescription } from "~/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { getAllSeasons } from "~/db/queries/seasons";

const SeasonManagement = async () => {
  const [allSeasons, signedInUser] = await Promise.all([
    getAllSeasons(),
    currentUser(),
  ]);

  const isSignedInUserAdmin = signedInUser?.privateMetadata.admin as boolean;

  // const activeSeason = allSeasons.find((season) => season.isActive);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex justify-between gap-4">
          Season
          <NewSeasonButton isAdmin={isSignedInUserAdmin} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {allSeasons.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-2">
            <TriangleAlertIcon className="text-orange-500 size-10" />
            <span className="font-semibold text-xl">No seasons found!</span>
            <AlertDescription className="text-center text-balance">{`Click "Start new season" to get started. ${
              isSignedInUserAdmin ? "" : "Let an admin to start the new season."
            }`}</AlertDescription>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default SeasonManagement;
