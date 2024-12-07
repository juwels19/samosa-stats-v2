import { Pick } from "@prisma/client";
import React from "react";
import EventCard from "~/components/common/event-card";
import PageHeading from "~/components/common/page-heading";
import {
  EventCodeWithPickCounts,
  getNumberOfPicksForEachEvent,
} from "~/db/queries/events";
import {
  getPicksForOverallLeaderboard,
  PicksForOverallLeaderboard,
} from "~/db/queries/picks";
import { getActiveSeason } from "~/db/queries/seasons";

export const metadata = {
  title: "Leaderboard",
  description: "The main samosa stats leaderboard page",
};

const MainLeaderboardPage = async () => {
  const currentSeasonPromise = getActiveSeason();
  const picksForOverallLeaderboardPromise: Promise<
    PicksForOverallLeaderboard[]
  > = getPicksForOverallLeaderboard();
  const numberOfPicksForEachEventPromise: Promise<EventCodeWithPickCounts[]> =
    getNumberOfPicksForEachEvent();

  const [currentSeason, picksForOverallLeaderboard, numberOfPicksForEachEvent] =
    await Promise.all([
      currentSeasonPromise,
      picksForOverallLeaderboardPromise,
      numberOfPicksForEachEventPromise,
    ]);

  const scoresForUser: {
    [key: string]: {
      totalPoints: number;
      bonusPoints: number;
      fullName: string;
      displayName?: string | null;
    };
  } = {};

  const computePointsForPick = (
    pick: Pick,
    eventCode: string
  ): [number, number] => {
    let totalPoints = 0;
    let bonusPoints = 0;
    if (pick.rank === 1) {
      totalPoints += 3;
    } else if (pick.rank === 2) {
      totalPoints += 2;
    } else if (pick.rank === 3) {
      totalPoints += 1;
    }

    const numberOfPicksForEvent = numberOfPicksForEachEvent.find(
      (event) => event.eventCode === eventCode
    )!._count.Pick;

    if (pick.isRandom && pick.rank) {
      if (pick.rank <= 3) {
        bonusPoints = 1;
      } else if (pick.rank >= numberOfPicksForEvent - 3) {
        bonusPoints = -1;
      }
    }

    totalPoints += bonusPoints;

    return [totalPoints, bonusPoints];
  };

  picksForOverallLeaderboard.forEach((pick) => {
    const [totalPoints, bonusPoints] = computePointsForPick(
      pick,
      pick.Event.eventCode
    );
    if (pick.userId in scoresForUser && pick.score) {
      scoresForUser[pick.userId].totalPoints += totalPoints;
      scoresForUser[pick.userId].bonusPoints += bonusPoints;
      return;
    }
    scoresForUser[pick.userId] = {
      totalPoints,
      bonusPoints,
      displayName: pick.displayName,
      fullName: pick.userFullname,
    };
  });

  console.log(scoresForUser);

  return (
    <div className="w-full p-6 flex flex-col gap-4">
      <PageHeading label="Overall leaderboard" />

      <PageHeading label="Event specific results" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
        {currentSeason &&
          currentSeason.Event.length > 0 &&
          currentSeason.Event.map((event) => (
            <EventCard key={event.eventCode} event={event} type="leaderboard" />
          ))}
      </div>
    </div>
  );
};

export default MainLeaderboardPage;
