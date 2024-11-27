import { Event } from "@prisma/client";
import React from "react";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { EventWithPicks } from "~/db/queries/events";

const BlueAllianceLink = ({ event }: { event: Event | EventWithPicks }) => {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={`https://thebluealliance.com/event/${event?.eventCode}`}
    >
      <Button
        size="icon"
        className="bg-[#44519b] dark:bg-[#44519b] hover:dark:bg-[#44519b] hover:bg-[#44519b]"
      >
        <Image
          src="https://www.thebluealliance.com/images/tba_lamp.svg"
          alt="The Blue Alliance logo"
          width={15}
          height={15}
        />
      </Button>
    </a>
  );
};

export default BlueAllianceLink;
