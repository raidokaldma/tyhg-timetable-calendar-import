import type { Event } from "./types.js";

/** Sorts events by weekday and start time */
export function sortEvents(events: Event[]): Event[] {
  return events.toSorted(
    (event1, event2) =>
      event1.weekday - event2.weekday ||
      event1.startTime.localeCompare(event2.startTime),
  );
}
