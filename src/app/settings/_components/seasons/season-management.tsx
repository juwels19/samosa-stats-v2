import { CircleCheckIcon, TriangleAlertIcon } from "lucide-react";
import React from "react";
import NewSeasonForm from "~/app/settings/_components/seasons/new-season-form";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { getAllSeasons } from "~/db/queries/seasons";

import { currentUser } from "@clerk/nextjs/server";

const SeasonManagement = async () => {
  const [allSeasons, signedInUser] = await Promise.all([
    getAllSeasons(),
    currentUser(),
  ]);

  const isSignedInUserAdmin = signedInUser?.privateMetadata.admin as boolean;

  const activeSeason = allSeasons.find((season) => season.isActive);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex justify-between gap-4">Season</CardTitle>
      </CardHeader>
      <CardContent>
        {allSeasons.length === 0 && (
          <Alert variant="warning" className="mb-4">
            <TriangleAlertIcon />
            <AlertTitle>No seasons found!</AlertTitle>
            <AlertDescription className="text-center text-balance">{`Click "Start new season" to get started. ${
              isSignedInUserAdmin ? "" : "Let an admin to start the new season."
            }`}</AlertDescription>
          </Alert>
        )}
        {!activeSeason ? (
          <Alert variant="warning" className="mb-4">
            <TriangleAlertIcon />
            <AlertTitle>No active season!</AlertTitle>
            <AlertDescription>Please start a season below!</AlertDescription>
          </Alert>
        ) : (
          <Alert variant="success" className="mb-4">
            <CircleCheckIcon />
            <AlertTitle className="mb-0 mt-[2px]">
              {activeSeason.gameName} is the current active season!
            </AlertTitle>
            <AlertDescription>
              This season will apply for all settings on this page.
            </AlertDescription>
          </Alert>
        )}
        <NewSeasonForm isAdmin={isSignedInUserAdmin} />
      </CardContent>
    </Card>
  );
};

export default SeasonManagement;
