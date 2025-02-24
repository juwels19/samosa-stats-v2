"use server";

import axios from "axios";
import { format, parseJSON, addDays } from "date-fns";
import { env } from "~/lib/env";

export type DiscordEmbedType = {
  title: string;
  description: string;
};

const discordWebhookUrl = env.DISCORD_WEBHOOK_URL;
const embedColor = "6316287";

const sendDiscordMessage = async (
  embed: DiscordEmbedType,
  messageHeader: string
) => {
  const body = {
    content: `🚨Samosa Stats ${messageHeader}🚨 <@1226682262070890587>`,
    embeds: [{ ...embed, color: embedColor }],
  };

  await axios.post(discordWebhookUrl, body);
};

export const sendEventSubmissionReminder = async ({
  eventName,
  eventStartDate,
  eventCode,
}: {
  eventName: string;
  eventStartDate: string;
  eventCode: string;
}) => {
  const embed = {
    title: `Reminder to submit your picks for ${eventName}!`,
    description: `Login to Samosa Stats and submit your picks!\n\nSubmissions will close at 9AM Eastern Time on ${format(
      addDays(parseJSON(eventStartDate), 1),
      "MMMM do"
    )}.\n\n[samosastats.com/picks/${eventCode}](https://samosastats.com/picks/${eventCode})`,
  };
  await sendDiscordMessage(embed, "Pick Submission Reminder");
};

export const sendEventSubmissionsClosedMessage = async ({
  eventName,
}: {
  eventName: string;
}) => {
  const embed = {
    title: `GATES ARE NOW CLOSED FOR ${eventName}!`,
    description:
      "If you didn't submit your picks, too bad...\n\n[samosastats.com](https://samosastats.com)",
  };
  await sendDiscordMessage(embed, "Event Submissions CLOSED");
};
