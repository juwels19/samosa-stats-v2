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

const sendDiscordMessage = async (embed: DiscordEmbedType) => {
  const body = {
    content: "🚨Samosa Stats Submission Reminder🚨 @here",
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
  await sendDiscordMessage(embed);
};
