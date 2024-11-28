"use client";

import { InfoIcon } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import MultiSelector, { Option } from "~/components/ui/multi-selector";
import { Skeleton } from "~/components/ui/skeleton";
import { EventWithPicks } from "~/db/queries/events";
import { fetchTeamsForEvent } from "~/server/http/frc-events";

import { zodResolver } from "@hookform/resolvers/zod";
import { Category } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

const ScoreEntryForm = ({
  event,
  allCategories,
}: {
  event: EventWithPicks;
  allCategories: Category[];
}) => {
  const scoresFormSchema = z.object(
    Object.fromEntries(
      allCategories.map((category) => [
        `category-${category.id}`,
        z
          .string()
          .array()
          .nonempty({ message: "Please select at least one team" }), // This makes it so that the array must have at least one element
      ])
    )
  );

  const scoresForm = useForm<z.infer<typeof scoresFormSchema>>({
    mode: "all",
    reValidateMode: "onChange",
    resolver: zodResolver(scoresFormSchema),
    defaultValues: Object.fromEntries(
      allCategories.map((category) => [`category-${category.id}`, []])
    ),
  });

  const teamFetcher = useQuery({
    queryKey: ["teams", event.eventCode],
    queryFn: async () => {
      const teams = await fetchTeamsForEvent(event.eventCode);
      return teams;
    },
  });

  if (teamFetcher.isLoading)
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-48 md:w-72 lg:w-96 mt-2" />
          <Skeleton className="h-10 w-1/2" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-48 md:w-72 lg:w-96 mt-2" />
          <Skeleton className="h-10 w-1/2" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-48 md:w-72 lg:w-96 mt-2" />
          <Skeleton className="h-10 w-1/2" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-48 md:w-72 lg:w-96 mt-2" />
          <Skeleton className="h-10 w-1/2" />
        </div>
      </div>
    );

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

  return (
    <Form {...scoresForm}>
      <form
        className="w-full"
        onSubmit={scoresForm.handleSubmit((values) => console.log(values))}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {allCategories.map((category) => (
            <FormField
              key={`form-field-${category.id}`}
              name={`category-${category.id}`}
              control={scoresForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{category.text}</FormLabel>
                  <MultiSelector
                    onChange={(options) =>
                      field.onChange([...options.map((option) => option.value)])
                    }
                    options={selectorDropdownOptions}
                    selectFirstItem={false}
                    placeholder="Select team(s)..."
                    hidePlaceholderWhenSelected
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default ScoreEntryForm;
