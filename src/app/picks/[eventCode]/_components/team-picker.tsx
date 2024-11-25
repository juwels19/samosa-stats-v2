"use client";

import { useContext } from "react";
import { Button } from "~/components/ui/button";
import { fetchTeamsForEvent } from "~/server/http/frc-events";

import { Progress } from "@nextui-org/progress";
import { useQuery } from "@tanstack/react-query";
import { cn } from "~/lib/utils";
import { PickContext } from "~/app/picks/[eventCode]/_components/context";
import { XIcon } from "lucide-react";

const TeamPicker = () => {
  const { teamSelections, setTeamSelections, event } = useContext(PickContext);

  const teamSelectionCount = Object.entries(teamSelections).filter(
    (entry) => entry[1] === true
  ).length;

  const teamFetcher = useQuery({
    queryKey: ["teams", event.eventCode],
    queryFn: async () => {
      const teams = await fetchTeamsForEvent(event.eventCode);
      return teams;
    },
  });

  if (teamFetcher.isLoading || !teamFetcher.data) return <div>Loading...</div>;

  return (
    <>
      <div className="flex flex-row justify-between items-end gap-4">
        <Progress
          label={`${teamSelectionCount} / ${event.numberOfTeamPicks} teams selected`}
          color={
            teamSelectionCount !== event.numberOfTeamPicks
              ? "primary"
              : "success"
          }
          value={(teamSelectionCount / event.numberOfTeamPicks) * 100}
        />
        <Button variant="destructive" onClick={() => setTeamSelections({})}>
          <XIcon />
          Clear
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="flex flex-col gap-2">
          {teamFetcher.data
            .slice(0, Math.ceil(teamFetcher.data.length / 2))
            .map((team, index) => (
              <Button
                variant="outline"
                key={team.teamNumber}
                disabled={
                  teamSelectionCount === event.numberOfTeamPicks &&
                  !teamSelections[team.teamNumber]
                }
                className={cn(
                  "block overflow-hidden whitespace-nowrap text-start text-ellipsis",
                  teamSelections[team.teamNumber]
                    ? "bg-green-200 hover:bg-green-300 dark:bg-green-800 dark:hover:bg-green-900"
                    : "bg-transparent dark:bg-transparent",
                  index % 2 === 0 ? "md:col-start-1" : "md:col-start-2"
                )}
                onClick={() => {
                  if (teamSelections[team.teamNumber] === undefined) {
                    setTeamSelections({
                      ...teamSelections,
                      [team.teamNumber]: true,
                    });
                  } else {
                    setTeamSelections({
                      ...teamSelections,
                      [team.teamNumber]: !teamSelections[team.teamNumber],
                    });
                  }
                }}
              >
                {`${team.teamNumber} - ${team.nameShort}`}
              </Button>
            ))}
        </div>
        <div className="flex flex-col gap-2">
          {teamFetcher.data
            .slice(Math.ceil(teamFetcher.data.length / 2))
            .map((team, index) => (
              <Button
                variant="outline"
                key={team.teamNumber}
                disabled={
                  teamSelectionCount === event.numberOfTeamPicks &&
                  !teamSelections[team.teamNumber]
                }
                className={cn(
                  "block overflow-hidden whitespace-nowrap text-start text-ellipsis",
                  teamSelections[team.teamNumber]
                    ? "bg-green-200 hover:bg-green-300 dark:bg-green-800 dark:hover:bg-green-900"
                    : "bg-transparent dark:bg-transparent",
                  index % 2 === 0 ? "md:col-start-1" : "md:col-start-2"
                )}
                onClick={() => {
                  if (teamSelections[team.teamNumber] === undefined) {
                    setTeamSelections({
                      ...teamSelections,
                      [team.teamNumber]: true,
                    });
                  } else {
                    setTeamSelections({
                      ...teamSelections,
                      [team.teamNumber]: !teamSelections[team.teamNumber],
                    });
                  }
                }}
              >
                {`${team.teamNumber} - ${team.nameShort}`}
              </Button>
            ))}
        </div>
      </div>
    </>
  );
};

export default TeamPicker;
