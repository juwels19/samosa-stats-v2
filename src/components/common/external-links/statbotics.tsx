import Image from "next/image";
import { Event } from "@prisma/client";
import React from "react";
import { Button } from "~/components/ui/button";
import { EventWithPicks } from "~/db/queries/events";

const StatboticsLink = ({ event }: { event: Event | EventWithPicks }) => {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={`https://statbotics.io/event/${event?.eventCode}`}
    >
      <Button
        size="icon"
        className="bg-white hover:bg-white dark:hover:bg-white"
      >
        <Image
          src="/statbotics.svg"
          alt="Statbotics logo"
          width={30}
          height={30}
        />
      </Button>
    </a>
  );
};

export default StatboticsLink;
