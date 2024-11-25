"use client";

import { Loader2Icon, OctagonXIcon } from "lucide-react";
import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { PickContext } from "~/app/picks/[eventCode]/_components/context";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { H3, H4 } from "~/components/ui/typography";
import { submitPickForEvent } from "~/db/queries/picks";
import { fetchTeamsForEvent } from "~/server/http/frc-events";

import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Separator } from "~/components/ui/separator";
import { useRouter } from "next/navigation";

const PickSubmission = () => {
  const { user } = useUser();
  const router = useRouter();

  const { event, categories, teamSelections, categorySelections } =
    useContext(PickContext);

  const teamFetcher = useQuery({
    queryKey: ["teams", event.eventCode],
    queryFn: async () => {
      const teams = await fetchTeamsForEvent(event.eventCode);
      return teams;
    },
  });

  const filteredTeams = teamFetcher.data?.filter(
    (team) => teamSelections[team.teamNumber]
  );

  const filteredCategories = categories.filter(
    (category) => categorySelections[category.id]
  );

  const submitPickSchema = z.object({
    teamNumbers: z.array(z.string()).length(event.numberOfTeamPicks, {
      message: `Select ${event.numberOfTeamPicks} teams`,
    }),
    categoryIds: z.array(z.string()).length(event.numberOfCategoryPicks, {
      message: `Select ${event.numberOfCategoryPicks} categories`,
    }),
    displayName: z.string(),
  });

  const submitPickForm = useForm<z.infer<typeof submitPickSchema>>({
    reValidateMode: "onSubmit",
    resolver: zodResolver(submitPickSchema),
    defaultValues: {
      teamNumbers: Object.keys(teamSelections).filter(
        (teamNumber) => teamSelections[teamNumber]
      ),
      categoryIds: Object.keys(categorySelections).filter(
        (categoryId) => categorySelections[categoryId]
      ),
      displayName: event.Pick[0]?.displayName ?? "",
    },
  });

  const pickSubmissionMutation = useMutation({
    mutationFn: (formData: z.infer<typeof submitPickSchema>) =>
      submitPickForEvent({
        ...formData,
        categories: filteredCategories.map((category) => category.text),
        userId: user!.id,
        userFullname: user!.firstName + user!.lastName,
        eventId: event.id,
      }),
  });

  const handlePickSubmission = async (
    data: z.infer<typeof submitPickSchema>
  ) => {
    try {
      await pickSubmissionMutation.mutateAsync(data);
      router.push("/dashboard");
      toast.success("Picks submitted successfully!");
    } catch (e) {
      const error = e as Error;
      toast.error(error.message);
    }
  };

  const displayName = submitPickForm.watch("displayName");

  return (
    <>
      <H3>Summary</H3>
      {Object.keys(submitPickForm.formState.errors).length > 0 &&
        submitPickForm.formState.errors && (
          <Alert variant="destructive">
            <OctagonXIcon />
            <AlertTitle>Please correct the errors below:</AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside">
                {Object.entries(submitPickForm.formState.errors).map(
                  (entry) => (
                    <li key={entry[0]}>{entry[1].message}</li>
                  )
                )}
              </ul>
            </AlertDescription>
          </Alert>
        )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <H4>Teams</H4>
          {filteredTeams?.length === 0 || !filteredTeams ? (
            <p>No teams selected</p>
          ) : (
            filteredTeams.map((team) => (
              <p
                key={`team-${team.teamNumber}`}
              >{`${team.teamNumber} - ${team.nameShort}`}</p>
            ))
          )}
        </div>
        <div className="flex flex-col gap-2">
          <H4>Categories</H4>
          {filteredCategories?.length === 0 || !filteredCategories ? (
            <p>No categories selected</p>
          ) : (
            filteredCategories.map((category, index) => (
              <React.Fragment key={`${category.id}-${index}`}>
                <p>{category.text}</p>
                {index !== filteredCategories.length - 1 && <Separator />}
              </React.Fragment>
            ))
          )}
        </div>
      </div>
      <Form {...submitPickForm}>
        <form
          onSubmit={submitPickForm.handleSubmit(handlePickSubmission)}
          className="flex flex-col gap-4"
        >
          <FormField
            name="displayName"
            control={submitPickForm.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display name (optional)</FormLabel>
                <Input
                  {...field}
                  disabled={event.isSubmissionClosed}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length > 200) {
                      return;
                    }
                    field.onChange(value);
                  }}
                  placeholder="Enter a display name..."
                />
                <FormDescription>{`${
                  200 - displayName.length
                } characters remaining`}</FormDescription>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={
              submitPickForm.formState.isSubmitting || event.isSubmissionClosed
            }
            className="max-w-fit"
          >
            {submitPickForm.formState.isSubmitting && (
              <Loader2Icon className="animate-spin" />
            )}
            Submit picks
          </Button>
        </form>
      </Form>
    </>
  );
};

export default PickSubmission;
