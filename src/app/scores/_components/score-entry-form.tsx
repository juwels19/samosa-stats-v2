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
}: {
  event: EventWithPicks;
  categories: CategoriesWithPickCounts[];
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
    const pickIdsWithScores: { [key: string]: number } = Object.fromEntries(
      event.Pick.map((pick) => [pick.id.toString(), 0])
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
        pickIdsWithScores[pick.id.toString()] += teamScores[team];
      });
    });

    console.log(pickIdsWithScores);

    const picksWithScoresArr: {
      pickId: string;
      score: number;
      rank: number;
    }[] = Object.entries(pickIdsWithScores)
      .map((item) => ({ pickId: item[0], score: item[1], rank: 0 }))
      .sort((a, b) => b.score - a.score);

    let rank = 1; // Start ranking from 1

    // Iterate over the sorted array to assign ranks
    for (let i = 0; i < picksWithScoresArr.length; i++) {
      if (i === 0) {
        // If it's the first item, assign the rank
        picksWithScoresArr[i].rank = rank;
        rank++;
        continue;
      }

      console.log(
        picksWithScoresArr[i].score === picksWithScoresArr[i - 1].score
      );

      if (picksWithScoresArr[i].score === picksWithScoresArr[i - 1].score) {
        picksWithScoresArr[i].rank = picksWithScoresArr[i - 1].rank;
        continue;
      }

      picksWithScoresArr[i].rank = rank;
      rank++;

      // if (picksWithScoresArr[i].score !== prevScore) {
      //   // If value has changed, assign the new rank
      //   rank += rankOffset - 1; // Offset to skip ranks for ties
      //   rankOffset = 1; // Reset the rank offset for the next unique value
      // } else {
      //   // If the value is the same as the previous, increment the rank offset
      //   rankOffset++;
      // }

      // // Assign the rank to the object
      // picksWithScoresArr[i].rank = rank;

      // // Update the previous value for tie comparison
      // prevScore = picksWithScoresArr[i].score;
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
