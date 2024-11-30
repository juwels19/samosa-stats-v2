"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Season } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { parse } from "date-fns";
import { Loader2Icon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { createEvent } from "~/db/queries/events";
import { closeEvent, closeEventSubmission } from "~/server/actions/trigger";
import { fetchEventByYearAndCode } from "~/server/http/frc-events";

const NewEventForm = ({ activeSeason }: { activeSeason: Season | null }) => {
  const [isFetchingEnabled, setIsFetchingEnabled] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const newEventSchema = z.object({
    eventCode: z
      .string({ required_error: "Event code is required" })
      .refine((val) => val.length > 0, {
        message: "Event code is required",
      }),
    numTeamPicks: z
      .number({ required_error: "Number of team picks is required" })
      .min(1),
    numCategoryPicks: z
      .number({ required_error: "Number of category picks is required" })
      .min(1),
    eventName: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    displayName: z.string(),
  });

  const newEventForm = useForm<z.infer<typeof newEventSchema>>({
    mode: "all",
    reValidateMode: "onChange",
    resolver: zodResolver(newEventSchema),
    values: {
      eventCode: "",
      numTeamPicks: 8,
      numCategoryPicks: 5,
      eventName: "",
      startDate: "",
      endDate: "",
      displayName: "",
    },
  });

  const eventCodeToFetch = newEventForm.watch("eventCode");

  const eventFetcher = useQuery({
    queryKey: ["events", activeSeason!.year, eventCodeToFetch],
    queryFn: async () => {
      const data = await fetchEventByYearAndCode(
        activeSeason!.year.toString(),
        eventCodeToFetch
      );
      setIsFetchingEnabled(false);
      return data;
    },
    enabled: isFetchingEnabled,
    retry: false,
  });

  useEffect(() => {
    if (eventFetcher.error) {
      toast.error(eventFetcher.error.message);
      setIsFetchingEnabled(false);
      return;
    }
    newEventForm.setValue("eventName", eventFetcher.data?.name ?? undefined);
    newEventForm.setValue(
      "startDate",
      new Date(eventFetcher.data?.dateStart).toDateString()
    );
    newEventForm.setValue(
      "endDate",
      new Date(eventFetcher.data?.dateEnd).toDateString()
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventFetcher.data, eventFetcher.error]);

  const newEventMutation = useMutation({
    mutationFn: (newEvent: {
      eventData: {
        seasonId: number;
        seasonYear: number;
        eventCode: string;
        eventName: string;
        startDate: string;
        endDate: string;
        displayName: string;
        numTeamPicks: number;
        numCategoryPicks: number;
      };
    }) => createEvent(newEvent),
  });

  const handleFormSubmit = async (values: z.infer<typeof newEventSchema>) => {
    setIsLoading(true);
    try {
      const newEvent = await newEventMutation.mutateAsync({
        eventData: {
          seasonId: activeSeason!.id,
          seasonYear: activeSeason!.year,
          eventCode: values.eventCode,
          eventName: values.eventName,
          displayName: values.displayName,
          startDate: parse(
            values.startDate,
            "EEE MMM dd yyyy",
            new Date()
          ).toISOString(),
          endDate: parse(
            values.endDate,
            "EEE MMM dd yyyy",
            new Date()
          ).toISOString(),
          numTeamPicks: values.numTeamPicks,
          numCategoryPicks: values.numCategoryPicks,
        },
      });
      if (newEvent?.data.newEvent) {
        // These are just triggers to auto close the event submission and event
        await closeEventSubmission({ event: newEvent?.data.newEvent });
        await closeEvent({ event: newEvent?.data.newEvent });
      }
      toast.success(
        `${newEvent?.data.newEvent.eventCode} was created successfully!`
      );
      setIsDialogOpen(false);
    } catch (e) {
      const error = e as Error;
      toast.error(error.message);
    }
    setIsLoading(false);
  };

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={() => {
        newEventForm.reset();
        setIsDialogOpen(!isDialogOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button>Add event</Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...newEventForm}>
          <form
            onSubmit={newEventForm.handleSubmit(handleFormSubmit)}
            className="flex flex-col gap-4"
          >
            <DialogHeader>
              <DialogTitle>Add event</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              {/* EVENT CODE */}
              <FormField
                control={newEventForm.control}
                name="eventCode"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="inline-flex gap-1 items-center">
                      Event code{" "}
                      <FormDescription>(excluding the year)</FormDescription>
                    </FormLabel>
                    <div className="flex">
                      <Input
                        {...field}
                        placeholder="Ex: onnew"
                        className="rounded-e-none focus-visible:z-10"
                      />
                      <Button
                        className="rounded-s-none"
                        variant="secondary"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsFetchingEnabled(true);
                        }}
                      >
                        {eventFetcher.isFetching && (
                          <Loader2Icon className="animate-spin size-4" />
                        )}
                        Fetch event
                      </Button>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="displayName"
                control={newEventForm.control}
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Display name</FormLabel>
                    <Input {...field} placeholder="Enter a display name..." />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                {/* TEAM PICKS */}
                <FormField
                  control={newEventForm.control}
                  name="numTeamPicks"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Number of teams</FormLabel>
                      <Input
                        {...field}
                        type="number"
                        onChange={(e) => {
                          const valueAsNumber = parseInt(e.target.value);
                          if (
                            (e.target.value && valueAsNumber < 1) ||
                            isNaN(valueAsNumber)
                          ) {
                            return;
                          }
                          field.onChange(parseInt(e.target.value));
                        }}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* CATEGORY PICKS */}
                <FormField
                  control={newEventForm.control}
                  name="numCategoryPicks"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Number of categories</FormLabel>
                      <Input
                        {...field}
                        type="number"
                        onChange={(e) => {
                          const valueAsNumber = parseInt(e.target.value);
                          if (
                            (e.target.value && valueAsNumber < 1) ||
                            isNaN(valueAsNumber)
                          ) {
                            return;
                          }
                          field.onChange(parseInt(e.target.value));
                        }}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Separator />
              <div>
                <DialogTitle>Event details</DialogTitle>
                <DialogDescription>
                  These fields will auto-populate.
                </DialogDescription>
              </div>
              <div className="flex flex-col gap-2 -mt-2">
                {/* EVENT NAME */}
                <FormField
                  control={newEventForm.control}
                  name="eventName"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="inline-flex gap-1 items-center">
                        Event name
                      </FormLabel>
                      <Input {...field} readOnly />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  {/* START DATE */}
                  <FormField
                    control={newEventForm.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="inline-flex gap-1 items-center">
                          Start date
                        </FormLabel>
                        <Input {...field} readOnly />
                      </FormItem>
                    )}
                  />
                  {/* END DATE */}
                  <FormField
                    control={newEventForm.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="inline-flex gap-1 items-center">
                          End date
                        </FormLabel>
                        <Input {...field} readOnly />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={newEventMutation.isPending || isLoading}
              >
                {(newEventMutation.isPending || isLoading) && (
                  <Loader2Icon className="animate-spin size-3" />
                )}
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewEventForm;
