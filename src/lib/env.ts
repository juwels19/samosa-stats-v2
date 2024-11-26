import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    CLERK_SECRET_KEY: z.string(),
    DATABASE_URL: z.string().url(),
    DIRECT_URL: z.string().url(),
    FRC_EVENTS_USERNAME: z.string(),
    FRC_EVENTS_API_TOKEN: z.string(),
    DISCORD_WEBHOOK_URL: z.string().url(),
    NODE_ENV: z.enum(["development", "test", "production"]),
  },
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
  },
  // For Next.js >= 13.4.4, you only need to destructure client variables:
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,
    FRC_EVENTS_USERNAME: process.env.FRC_EVENTS_USERNAME,
    FRC_EVENTS_API_TOKEN: process.env.FRC_EVENTS_API_TOKEN,
    DISCORD_WEBHOOK_URL: process.env.DISCORD_WEBHOOK_URL,
  },
});
