"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "~/components/ui/input";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchSeasonInfoByYear } from "~/server/http/frc-events";
import { createSeason } from "~/db/queries/seasons";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

const NewSeasonForm = ({ isAdmin }: { isAdmin: boolean }) => {
  const newSeasonFormSchema = z.object({
    year: z
      .number({
        required_error: "Year is required",
        invalid_type_error: "Year must be a number",
      })
      .lte(
        new Date().getFullYear() + 1,
        `Year must be less than or equal to ${new Date().getFullYear() + 1}`
      )
      .gte(2021, "Year must be greater than 2020"),
    name: z.string().optional(),
  });

  const newSeasonForm = useForm<z.infer<typeof newSeasonFormSchema>>({
    mode: "all",
    reValidateMode: "onChange",
    resolver: zodResolver(newSeasonFormSchema),
  });

  const newSeasonMutation = useMutation({
    mutationFn: (newSeason: { year: number; gameName: string }) =>
      createSeason(newSeason),
  });

  const yearToFetch = newSeasonForm.watch("year");

  const seasonFetcher = useQuery({
    queryKey: ["seasons", yearToFetch],
    queryFn: async () => {
      const data = await fetchSeasonInfoByYear(yearToFetch.toString());
      newSeasonForm.setValue("name", data.gameName);
      return data;
    },
    enabled: yearToFetch !== undefined,
  });

  const onFormSubmit = async (values: z.infer<typeof newSeasonFormSchema>) => {
    try {
      await newSeasonMutation.mutateAsync({
        year: values.year,
        gameName: newSeasonForm.getValues("name") ?? "no name listed",
      });
      toast.success("Season created successfully!");
    } catch (e) {
      const error = e as Error;
      toast.error(error.message);
    }
  };

  return (
    <Form {...newSeasonForm}>
      <form
        onSubmit={newSeasonForm.handleSubmit(onFormSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={newSeasonForm.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year</FormLabel>
              <FormControl>
                <Input
                  placeholder="Calendar year"
                  {...field}
                  onChange={(e) => {
                    if (e.target.value === "") {
                      newSeasonForm.setValue("year", 0, {
                        shouldValidate: true,
                      });
                      return;
                    }
                    newSeasonForm.setValue("year", parseInt(e.target.value), {
                      shouldValidate: true,
                    });
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={newSeasonForm.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter a year above..."
                  value={seasonFetcher.data?.gameName ?? ""}
                  disabled
                />
              </FormControl>
              <FormDescription className="text-sm align-middle flex flex-row">
                This is an auto-populated field.
              </FormDescription>
            </FormItem>
          )}
        />
        <Button
          disabled={newSeasonMutation.isPending || !isAdmin}
          type="submit"
        >
          {newSeasonMutation.isPending && (
            <Loader2Icon className="animate-spin" />
          )}
          Start season!
        </Button>
      </form>
    </Form>
  );
};

export default NewSeasonForm;
