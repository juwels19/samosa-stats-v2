import { Pick } from "@prisma/client";
import React from "react";
import OverallRankingTable from "~/app/leaderboard/_components/overall-ranking/overall-ranking-table";
import EventCard from "~/components/common/event-card";
import PageHeading from "~/components/common/page-heading";
import { H3 } from "~/components/ui/typography";
import {
  EventCodeWithPickCounts,
  getNumberOfPicksForEachEvent,
} from "~/db/queries/events";
import {
  getPicksForOverallLeaderboard,
  PicksForOverallLeaderboard,
  getNumberOfRankingCountsPerUser,
} from "~/db/queries/picks";
import { getActiveSeason } from "~/db/queries/seasons";
import { RankingData } from "~/types/globals";

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
  const numberOfRankingCountsPerUserPromise = getNumberOfRankingCountsPerUser();

  const [
    currentSeason,
    picksForOverallLeaderboard,
    numberOfPicksForEachEvent,
    numberOfRankingCountsPerUser,
  ] = await Promise.all([
    currentSeasonPromise,
    picksForOverallLeaderboardPromise,
    numberOfPicksForEachEventPromise,
    numberOfRankingCountsPerUserPromise,
  ]);

  const scoresForUser: RankingData = {};

  // console.log(numberOfRankingCountsPerUser);

  const computePointsForPick = (
    pick: Pick,
    eventCode: string
  ): [number, number, number, string] => {
    let totalPoints = 0;
    let positiveBonusPoints = 0;
    let negativeBonusPoints = 0;
    let medal = "none";
    if (pick.rank === 1) {
      totalPoints += 3;
      medal = "gold";
    } else if (pick.rank === 2) {
      totalPoints += 2;
      medal = "silver";
    } else if (pick.rank === 3) {
      totalPoints += 1;
      medal = "bronze";
    }

    const numberOfPicksForEvent = numberOfPicksForEachEvent.find(
      (event) => event.eventCode === eventCode
    )!._count.Pick;

    if (pick.isRandom && pick.rank) {
      if (pick.rank <= 3) {
        positiveBonusPoints = 1;
      } else if (pick.rank >= numberOfPicksForEvent - 3) {
        negativeBonusPoints = -1;
      }
    }

    totalPoints += positiveBonusPoints;
    totalPoints += negativeBonusPoints;

    return [totalPoints, positiveBonusPoints, negativeBonusPoints, medal];
  };

  picksForOverallLeaderboard.forEach((pick) => {
    const [totalPoints, positiveBonusPoints, negativeBonusPoints, medal] =
      computePointsForPick(pick, pick.Event.eventCode);
    if (pick.userId in scoresForUser && pick.score) {
      scoresForUser[pick.userId].totalPoints += totalPoints;
      scoresForUser[pick.userId].positiveBonusPoints += positiveBonusPoints;
      scoresForUser[pick.userId].negativeBonusPoints += negativeBonusPoints;
      if (medal === "gold") {
        scoresForUser[pick.userId].medalCounts.gold += 1;
      } else if (medal === "silver") {
        scoresForUser[pick.userId].medalCounts.silver += 1;
      } else if (medal === "bronze") {
        scoresForUser[pick.userId].medalCounts.bronze += 1;
      }
      return;
    }

    scoresForUser[pick.userId] = {
      totalPoints,
      positiveBonusPoints,
      negativeBonusPoints,
      fullName: pick.userFullname,
      medalCounts: {
        gold: medal === "gold" ? 1 : 0,
        silver: medal === "silver" ? 1 : 0,
        bronze: medal === "bronze" ? 1 : 0,
      },
      rankCount: {
        ...numberOfRankingCountsPerUser[pick.userId],
      },
    };
  });

  const rankingData = Object.values(scoresForUser);

  return (
    <div className="w-full p-6 flex flex-col gap-4">
      {picksForOverallLeaderboard.length > 0 && (
        <>
          <PageHeading label="Overall leaderboard" />
          <OverallRankingTable rankingData={rankingData} />
        </>
      )}
      <PageHeading label="Event specific results" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
        {currentSeason && currentSeason.Event.length > 0 ? (
          <>
            {currentSeason.Event.map((event) => (
              <EventCard
                key={event.eventCode}
                event={event}
                type="leaderboard"
              />
            ))}
          </>
        ) : (
          <H3>Nothing to see here yet...</H3>
        )}
      </div>
    </div>
  );
};

export default MainLeaderboardPage;
