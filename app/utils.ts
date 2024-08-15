import { useMatches } from "@remix-run/react";
import { DateTime } from 'luxon';
import { useMemo } from "react";

import type { User } from "~/models/user.server";

const DEFAULT_REDIRECT = "/";
const USER_TIME_ZONE = 'America/New_York';

// Get the start and end of the current week
export function getWeekRange() {
  const now = DateTime.now().setZone('America/New_York');
  
  // Adjust startOfWeek to Monday
  const startOfWeek = now.startOf('week').plus({ days: 1 });

  // If today is Sunday, move to previous Monday
  if (now.weekday === 7) {
    startOfWeek.minus({ days: 7 });
  }
  
  const endOfWeek = startOfWeek.plus({ days: 6 }); // End of Sunday

  return {
    startOfWeek: startOfWeek.toJSDate(),
    endOfWeek: endOfWeek.toJSDate()
  };
}

// Convert server date to user's time zone and format as MM/DD/YYYY
export function formatDateToUserTimeZone(date: Date | string): string {
  let dateTime;
  if (typeof date === 'string') {
    dateTime = DateTime.fromISO(date, { zone: 'utc' });
  } else {
    dateTime = DateTime.fromJSDate(date, { zone: 'utc' });
  }

  return dateTime.setZone(USER_TIME_ZONE).toFormat('MM/dd/yyyy');
}

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(
  to: FormDataEntryValue | string | null | undefined,
  defaultRedirect: string = DEFAULT_REDIRECT,
) {
  if (!to || typeof to !== "string") {
    return defaultRedirect;
  }

  if (!to.startsWith("/") || to.startsWith("//")) {
    return defaultRedirect;
  }

  return to;
}

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(
  id: string,
): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id],
  );
  return route?.data as Record<string, unknown>;
}

function isUser(user: unknown): user is User {
  return (
    user != null &&
    typeof user === "object" &&
    "email" in user &&
    typeof user.email === "string"
  );
}

export function useOptionalUser(): User | undefined {
  const data = useMatchesData("root");
  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}

export function useUser(): User {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead.",
    );
  }
  return maybeUser;
}

export function validateEmail(email: unknown): email is string {
  return typeof email === "string" && email.length > 3 && email.includes("@");
}
