"use client";

import { InfoIcon, Loader2Icon, OctagonXIcon } from "lucide-react";
import React, { useContext, useState } from "react";
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
import { getRandomInt } from "~/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";

const PickSubmission = () => {
  const [confirmRandomPickModalOpen, setConfirmRandomPickModalOpen] =
    useState(false);

  const { user } = useUser();

  const {
    event,
    categories,
    teamSelections,
    setTeamSelections,
    categorySelections,
    setCategorySelections,
  } = useContext(PickContext);

  const [userHasRandomPick, setUserHasRandomPick] = useState(
    event.Pick.length > 0 &&
      event.Pick.find((pick) => pick.isRandom) !== undefined
  );

  const eventHasPicks = event.Pick.length > 0;

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
    isRandom: z.boolean(),
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
      isRandom: false,
    },
  });

  const displayName = submitPickForm.watch("displayName");

  const pickSubmissionMutation = useMutation({
    mutationFn: (formData: z.infer<typeof submitPickSchema>) =>
      submitPickForEvent({
        ...formData,
        isRandom: formData.isRandom,
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
      toast.success("Picks submitted successfully!");
    } catch (e) {
      const error = e as Error;
      toast.error(error.message);
    }
  };

  const handleRandomPicks = async () => {
    if (!teamFetcher.data) return;

    const randomTeamsObj: { [key: string]: boolean } = {};

    for (let i = 0; i < event.numberOfTeamPicks; i++) {
      let randomInt = getRandomInt(0, teamFetcher.data.length - 1);

      if (!randomTeamsObj[teamFetcher.data[randomInt].teamNumber]) {
        randomTeamsObj[teamFetcher.data[randomInt].teamNumber] = true;
        continue;
      }
      // If we're here, then we've already picked this team
      while (randomTeamsObj[teamFetcher.data[randomInt].teamNumber]) {
        randomInt = getRandomInt(0, teamFetcher.data.length - 1);
      }
      randomTeamsObj[teamFetcher.data[randomInt].teamNumber] = true;
    }

    const randomTeamNumbers = Object.keys(randomTeamsObj).sort();

    const randomCategoriesObj: { [key: string]: boolean } = {};

    for (let i = 0; i < event.numberOfCategoryPicks; i++) {
      let randomInt = getRandomInt(0, categories.length - 1);

      if (!randomCategoriesObj[categories[randomInt].id]) {
        randomCategoriesObj[categories[randomInt].id] = true;
        continue;
      }
      // If we're here, then we've already picked this team
      while (randomCategoriesObj[categories[randomInt].id]) {
        randomInt = getRandomInt(0, categories.length - 1);
      }
      randomCategoriesObj[categories[randomInt].id] = true;
    }

    const randomCategoryIds = Object.keys(randomCategoriesObj).sort();

    submitPickForm.setValue("teamNumbers", randomTeamNumbers);
    submitPickForm.setValue("categoryIds", randomCategoryIds);
    submitPickForm.setValue("isRandom", true);

    await handlePickSubmission(submitPickForm.getValues());

    setTeamSelections(randomTeamsObj);
    setCategorySelections(randomCategoriesObj);
    setUserHasRandomPick(true);
    setConfirmRandomPickModalOpen(false);
  };

  const shouldAllowRandomPick = () => {
    if (userHasRandomPick) return false;
    if (!event.isSubmissionClosed) return true;
    if (event.isOngoing && !eventHasPicks) return true;
    return false;
  };

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
      {userHasRandomPick && (
        <Alert variant="info">
          <InfoIcon />
          <AlertTitle>Heads up! This is a random pick!</AlertTitle>
          <AlertDescription>
            You are not allowed to edit your picks even if this event is still
            open for submissions.
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
                  disabled={
                    event.isComplete ||
                    userHasRandomPick ||
                    (event.isSubmissionClosed && !userHasRandomPick)
                  }
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
          <div className="flex flex-row gap-4 justify-between md:justify-start">
            {!event.isSubmissionClosed && !userHasRandomPick && (
              <Button
                type="submit"
                disabled={pickSubmissionMutation.isPending}
                className="max-w-fit"
              >
                {pickSubmissionMutation.isPending && (
                  <Loader2Icon className="animate-spin" />
                )}
                Submit picks
              </Button>
            )}
            {shouldAllowRandomPick() && (
              <AlertDialog
                open={confirmRandomPickModalOpen}
                onOpenChange={setConfirmRandomPickModalOpen}
              >
                <AlertDialogTrigger asChild>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      setConfirmRandomPickModalOpen(true);
                    }}
                    className="max-w-fit"
                    variant="destructive"
                  >
                    {`I'm feeling lucky!`}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm random picks</AlertDialogTitle>
                    <AlertDialogDescription>
                      {`Are you sure you want to generate random picks for this
                      event? If you've already filled out selections and confirm, your choices will be lost but your display name will persist. You WILL NOT be able to change your picks if you
                      submit random picks.`}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      disabled={pickSubmissionMutation.isPending}
                      onClick={async (e) => {
                        e.preventDefault();
                        await handleRandomPicks();
                      }}
                    >
                      {pickSubmissionMutation.isPending && (
                        <Loader2Icon className="animate-spin" />
                      )}
                      Confirm
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </form>
      </Form>
    </>
  );
};

export default PickSubmission;
