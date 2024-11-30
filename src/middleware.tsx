import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

const isAdminRoute = createRouteMatcher(["/scores(.*)", "/settings(.*)"]);

const isApproverRoute = createRouteMatcher(["/approvals"]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    const userRole = (await auth()).sessionClaims?.metadata.role;
    if (
      (isApproverRoute(request) && userRole !== "admin") ||
      userRole !== "admin"
    ) {
      const url = new URL("/dashboard?error=unauthorized", request.url);
      return NextResponse.redirect(url);
    }

    if (isAdminRoute(request) && userRole !== "admin") {
      const url = new URL("/dashboard?error=unauthorized", request.url);
      return NextResponse.redirect(url);
    }
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
