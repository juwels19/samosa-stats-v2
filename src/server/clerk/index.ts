import { createClerkClient } from "@clerk/backend";

import { env } from "~/lib/env";

declare global {
  // var must be used for globally scoped variables
  // eslint-disable-next-line no-var
  var clerkClient: typeof createClerkClient;
}

const clerkClient =
  global.clerkClient ||
  createClerkClient({
    secretKey: env.CLERK_SECRET_KEY,
  });

if (env.NODE_ENV === "development") {
  global.clerkClient = clerkClient;
}

export default clerkClient;
