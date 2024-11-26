"use client";

import { BellRingIcon } from "lucide-react";
import { motion } from "motion/react";
import React from "react";
import { Button } from "~/components/ui/button";
import { EventWithPicks } from "~/db/queries/events";
import { sendEventSubmissionReminder } from "~/server/http/discord";

const NotificationButton = ({ event }: { event: EventWithPicks }) => {
  const bellIconVariants = {
    default: { rotate: 0 },
    hover: { rotate: [0, -10, 10, -10, 0] },
  };

  const sendNotification = async () => {
    await sendEventSubmissionReminder({
      eventName: event.displayName ?? event.name,
      eventStartDate: event.startDate,
      eventCode: event.eventCode,
    });
  };

  return (
    <Button
      asChild
      size="sm"
      variant="link"
      onClick={() => {
        sendNotification();
      }}
    >
      <motion.button type="button" initial="default" whileHover="hover">
        <motion.div variants={bellIconVariants}>
          <BellRingIcon className="!size-4" />
        </motion.div>
        Notify
      </motion.button>
    </Button>
  );
};

export default NotificationButton;
