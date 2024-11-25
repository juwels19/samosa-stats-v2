"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Event } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon, SquarePenIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { updateEvent } from "~/db/queries/events";

const EditEventForm = ({ event }: { event: Event }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const editEventSchema = z.object({
    numTeamPicks: z
      .number({ required_error: "Number of team picks is required" })
      .min(1),
    numCategoryPicks: z
      .number({ required_error: "Number of category picks is required" })
      .min(1),
    displayName: z.string(),
  });

  const editEventForm = useForm<z.infer<typeof editEventSchema>>({
    mode: "all",
    reValidateMode: "onChange",
    resolver: zodResolver(editEventSchema),
    values: {
      numTeamPicks: event.numberOfTeamPicks,
      numCategoryPicks: event.numberOfCategoryPicks,
      displayName: event?.displayName ?? "",
    },
  });

  const editEventMutation = useMutation({
    mutationFn: (updateData: {
      eventData: {
        eventCode: string;
        numTeamPicks: number;
        numCategoryPicks: number;
        displayName: string;
      };
    }) => updateEvent(updateData),
  });

  const handleUpdateClick = async (values: z.infer<typeof editEventSchema>) => {
    try {
      await editEventMutation.mutateAsync({
        eventData: {
          eventCode: event.eventCode,
          numTeamPicks: values.numTeamPicks,
          numCategoryPicks: values.numCategoryPicks,
          displayName: values.displayName,
        },
      });
      toast.success("Event updated successfully!");
      setIsDialogOpen(false);
    } catch (e) {
      const error = e as Error;
      toast.error(error.message);
    }
  };

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={() => setIsDialogOpen(!isDialogOpen)}
    >
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <SquarePenIcon className="!size-4" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...editEventForm}>
          <form onSubmit={editEventForm.handleSubmit(handleUpdateClick)}>
            <DialogHeader>
              <DialogTitle>Editing {event.name}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              {/* # TEAM PICKS */}
              <FormField
                control={editEventForm.control}
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
                control={editEventForm.control}
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
            <FormField
              name="displayName"
              control={editEventForm.control}
              render={({ field }) => (
                <FormItem className="space-y-1 mb-4">
                  <FormLabel>Display Name</FormLabel>
                  <Input {...field} placeholder="Enter a display name..." />
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={editEventMutation.isPending}>
                {editEventMutation.isPending && (
                  <Loader2Icon className="animate-spin" />
                )}
                Update
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditEventForm;
