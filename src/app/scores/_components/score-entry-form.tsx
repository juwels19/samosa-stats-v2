"use client";

import { InfoIcon, Loader2Icon } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import MultiSelector, { Option } from "~/components/ui/multi-selector";
import { EventWithPicks } from "~/db/queries/events";
import { fetchTeamsForEvent } from "~/server/http/frc-events";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { CategoriesWithPickCounts } from "~/db/queries/categories";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Input } from "~/components/ui/input";
import { toast } from "sonner";
import { setPickScoresForEvent } from "~/db/queries/picks";
import ScoreEntryFormLoading from "~/app/scores/_components/score-entry-form-loading";
import { H4 } from "~/components/ui/typography";

const ScoreEntryForm = ({
  event,
  categories,
  teamPickCount,
}: {
  event: EventWithPicks;
  categories: CategoriesWithPickCounts[];
  teamPickCount: { [key: number]: number };
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const teamFetcher = useQuery({
    queryKey: ["teams", event.eventCode],
    queryFn: async () => {
      const teams = await fetchTeamsForEvent(event.eventCode);
      return teams;
    },
  });

  const scoresFormSchema = z.object({
    ...Object.fromEntries(
      categories.map((category) => [
        `${category.id}`,
        z.object({
          teams: z
            .string()
            .array()
            .nonempty({ message: "Please select at least one team" }), // This makes it so that the array must have at least one element
          points: z.string().refine((value) => !/[a-zA-Z]/.test(value), {
            message: "Cannot contain letters",
          }),
        }),
      ])
    ),
  });

  const scoresForm = useForm<z.infer<typeof scoresFormSchema>>({
    mode: "all",
    reValidateMode: "onChange",
    resolver: zodResolver(scoresFormSchema),
    defaultValues: {
      ...Object.fromEntries(
        categories.map((category) => [
          `${category.id}`,
          { teams: [], points: "0" },
        ])
      ),
    },
  });

  if (teamFetcher.isLoading) return <ScoreEntryFormLoading />;

  if (!teamFetcher.data || teamFetcher.error)
    return (
      <Alert variant="destructive" className="mt-10">
        <InfoIcon />
        <AlertTitle>Something went wrong!</AlertTitle>
        <AlertDescription>
          Please reload the page and try again... Or talk to Julian.
        </AlertDescription>
      </Alert>
    );

  const selectorDropdownOptions: Option[] = teamFetcher.data.map((team) => ({
    value: team.teamNumber.toString(),
    label: `${team.teamNumber} - ${team.nameShort}`,
  }));

  const handleScoreSubmission = async (
    formValues: z.infer<typeof scoresFormSchema>
  ) => {
    setIsSubmitting(true);
    const teamScores = Object.fromEntries(
      teamFetcher.data.map((team) => [team.teamNumber, 0])
    );
    console.log(event.Pick);
    const pickIdsWithScores: {
      [key: string]: {
        score: number;
        uniqueness: number;
      };
    } = Object.fromEntries(
      event.Pick.map((pick) => [
        pick.id.toString(),
        { score: 0, uniqueness: 0 },
      ])
    );

    console.log(formValues);

    Object.entries(formValues).forEach(([, value]) => {
      const { teams, points } = value;
      teams.forEach((team) => {
        teamScores[team] += parseInt(points);
      });
    });

    console.log(teamScores);

    event.Pick.forEach((pick) => {
      const teams = JSON.parse(pick.answersJSON).teams;
      teams.forEach((team: number) => {
        pickIdsWithScores[pick.id.toString()].score += teamScores[team];
        pickIdsWithScores[pick.id.toString()].uniqueness += teamPickCount[team];
      });
    });

    console.log(pickIdsWithScores);

    const picksWithScoresArr: {
      pickId: string;
      score: number;
      uniqueness: number;
      rank: number;
    }[] = Object.entries(pickIdsWithScores)
      .map((item) => ({
        pickId: item[0],
        score: item[1].score,
        uniqueness: item[1].uniqueness,
        rank: 0,
      }))
      .sort((a, b) => b.score - a.score);

    let rank = 1; // Start ranking from 1

    // Iterate over the sorted array to assign ranks
    for (let i = 0; i < picksWithScoresArr.length; i++) {
      const isLastItem = i === picksWithScoresArr.length - 1;

      if (i === 0) {
        // If it's the first item, assign the rank
        picksWithScoresArr[i].rank = rank;
        rank++;
        continue;
      }

      if (picksWithScoresArr[i].score === picksWithScoresArr[i - 1].score) {
        if (
          picksWithScoresArr[i].uniqueness ===
          picksWithScoresArr[i - 1].uniqueness
        ) {
          // If uniqueness is the same, don't break the tie and each pick gets the same rank
          if (isLastItem) {
            picksWithScoresArr[i].rank = -1;
            picksWithScoresArr[i - 1].rank = -1;
          } else {
            picksWithScoresArr[i].rank = picksWithScoresArr[i - 1].rank;
          }

          continue;
        } else if (
          picksWithScoresArr[i].uniqueness >
          picksWithScoresArr[i - 1].uniqueness
        ) {
          // If the current pick has a HIGHER uniqueness (meaning they picked less unique teams), assign them the next rank
          if (isLastItem) {
            picksWithScoresArr[i].rank = -1;
          } else {
            picksWithScoresArr[i].rank = rank;
          }
        } else {
          // If the current pick has a LOWER uniqueness (meaning they picked more unique teams), switch the ranks of the two picks
          if (isLastItem) {
            picksWithScoresArr[i].rank = picksWithScoresArr[i - 1].rank;
            picksWithScoresArr[i - 1].rank = -1;
          } else {
            picksWithScoresArr[i].rank = picksWithScoresArr[i - 1].rank;
            picksWithScoresArr[i - 1].rank = rank;
          }
        }
        rank++;
        continue;
      }

      picksWithScoresArr[i].rank = isLastItem ? -1 : rank;
      rank++;
    }

    console.log("scores array", picksWithScoresArr);

    try {
      await setPickScoresForEvent(picksWithScoresArr, event.eventCode);

      toast.success(
        `Scores for ${event.displayName || event.name} submitted successfully!`
      );
    } catch (e) {
      const error = e as Error;
      toast.error(error.message);
    }
    setIsSubmitting(false);
  };

  return (
    <Form {...scoresForm}>
      <form
        className="w-full"
        onSubmit={scoresForm.handleSubmit(handleScoreSubmission)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 mb-6">
          <div className="col-span-1 md:col-span-2">
            <H4>Total picks: {event.Pick.length}</H4>
          </div>
          {categories.map((category) => (
            <div
              className="w-full flex flex-row gap-2 items-start"
              key={`team-and-score-entry-${category.id}`}
            >
              {/* TEAM SELECTOR */}
              <FormField
                name={`${category.id}.teams`}
                control={scoresForm.control}
                render={({ field }) => (
                  <FormItem className="w-2/3">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormLabel className="line-clamp-1">
                          {category.text}
                        </FormLabel>
                      </PopoverTrigger>
                      <PopoverContent sideOffset={5}>
                        {category.text}
                      </PopoverContent>
                    </Popover>
                    <MultiSelector
                      onChange={(options) =>
                        field.onChange([
                          ...options.map((option) => option.value),
                        ])
                      }
                      options={selectorDropdownOptions}
                      selectFirstItem={false}
                      placeholder="Select team(s)..."
                      hidePlaceholderWhenSelected
                    />
                    <FormDescription>{`${category._count.Picks} ${
                      category._count.Picks === 1 ? "person" : "people"
                    } chose this category`}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* SCORE ENTRY */}
              <FormField
                name={`${category.id}.points`}
                control={scoresForm.control}
                render={({ field }) => (
                  <FormItem className="flex flex-col justify-start w-1/3">
                    <FormLabel>Points</FormLabel>
                    <Input
                      {...field}
                      value={field.value?.toString() || ""}
                      className="bg-transparent dark:bg-black"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2Icon className="animate-spin" />}
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default ScoreEntryForm;
