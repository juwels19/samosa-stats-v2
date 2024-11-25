"use client";

import { Category } from "@prisma/client";
import React, { useState } from "react";
import CategoryPicker from "~/app/picks/[eventCode]/_components/category-picker";
import { PickContext } from "~/app/picks/[eventCode]/_components/context";
import PickSubmission from "~/app/picks/[eventCode]/_components/pick-submission";
import TeamPicker from "~/app/picks/[eventCode]/_components/team-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { EventWithPicks } from "~/db/queries/events";

const PickTabs = ({
  event,
  categories,
}: {
  event: EventWithPicks;
  categories: Category[];
}) => {
  const parsedPickData = event.Pick.map((pick) => JSON.parse(pick.answersJSON));

  const [teamSelections, setTeamSelections] = useState(
    parsedPickData.length > 0
      ? Object.fromEntries(
          parsedPickData[0]?.teams.map((teamNumber: string) => [
            teamNumber,
            true,
          ])
        )
      : {}
  );

  const [categorySelections, setCategorySelections] = useState(
    event?.Pick[0]?.Categories.length > 0
      ? Object.fromEntries(
          event.Pick[0].Categories.map((category: Category) => [
            category.id,
            true,
          ])
        )
      : {}
  );

  return (
    <PickContext.Provider
      value={{
        teamSelections,
        setTeamSelections,
        categorySelections,
        setCategorySelections,
        categories,
        event,
      }}
    >
      <Tabs
        defaultValue={event.isSubmissionClosed ? "submit" : "teams"}
        className="w-full"
      >
        <div className="w-full flex flex-row justify-center md:justify-start">
          <TabsList>
            <TabsTrigger value="teams" disabled={event.isSubmissionClosed}>
              Teams
            </TabsTrigger>
            <TabsTrigger value="categories" disabled={event.isSubmissionClosed}>
              Categories
            </TabsTrigger>
            <TabsTrigger value="submit">Submit</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="teams" className="w-full flex flex-col gap-4">
          <TeamPicker />
        </TabsContent>
        <TabsContent value="categories" className="w-full flex flex-col gap-4">
          <CategoryPicker />
        </TabsContent>
        <TabsContent value="submit" className="w-full flex flex-col gap-4">
          <PickSubmission />
        </TabsContent>
      </Tabs>
    </PickContext.Provider>
  );
};

export default PickTabs;
