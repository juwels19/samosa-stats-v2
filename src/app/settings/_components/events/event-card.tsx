"use client";

import { Event } from "@prisma/client";
import { parseJSON } from "date-fns";
import { BellRingIcon } from "lucide-react";
import { motion } from "motion/react";
import React from "react";
import EditEventForm from "~/app/settings/_components/events/edit-event-form";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

const EventCard = ({ event }: { event: Event }) => {
  const bellIconVariants = {
    default: { rotate: 0 },
    hover: { rotate: [0, -10, 10, -10, 0] },
  };

  return (
    <Card>
      <CardHeader>
        {/* overflow-hidden text-ellipsis whitespace-nowrap */}
        <CardTitle className="text-balance">{event.name}</CardTitle>
        <CardDescription>
          <span className="font-semibold">{event.eventCode}</span>
          <br />
          {parseJSON(event.startDate).toDateString()} -{" "}
          {parseJSON(event.endDate).toDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 ">
          <div className="flex flex-row gap-2">
            <span className="font-semibold">Teams to pick:</span>
            <span>{event.numberOfTeamPicks}</span>
          </div>
          <div className="flex flex-row gap-2">
            <span className="font-semibold">Categories to pick:</span>
            <span>{event.numberOfCategoryPicks}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full flex flex-row justify-between">
          <Button asChild size="sm" variant="link">
            <motion.button type="button" initial="default" whileHover="hover">
              <motion.div variants={bellIconVariants}>
                <BellRingIcon className="!size-4" />
              </motion.div>
              Notify
            </motion.button>
          </Button>
          <EditEventForm event={event} />
        </div>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
