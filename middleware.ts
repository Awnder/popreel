import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { createRouteLoader } from "next/dist/client/route-loader";

// See https://clerk.com/docs/references/nextjs/clerk-middleware for more information about configuring your Middleware

const isProtectedRoute = createRouteMatcher(['/upload(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect() 
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
