import type { Weekday } from "../types.ts";

export function formatDate(date: Date): string {
  return date.toLocaleString("et-EE");
}

export function startOfDay(dateString: string) {
  const date = new Date(dateString);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function endOfDay(dateString: string) {
  const date = new Date(dateString);
  date.setHours(23, 59, 59, 999);
  return date;
}

/**
 * Generates earliest date with specific weekday and time
 **/
export function generateDate(
  startingFrom: Date,
  weekday: Weekday,
  time: string,
): Date {
  const result = new Date(startingFrom);

  const daysToAdd = (weekday + 1 - startingFrom.getDay() + 7) % 7;
  result.setDate(result.getDate() + daysToAdd); // result now matches expected weekday

  const [hours, minutes] = time.split(":").map(Number);
  result.setHours(hours, minutes, 0, 0);

  if (result < startingFrom) {
    result.setDate(result.getDate() + 7);
  }

  return result;
}

/**
 * Generates dates with specific weekday and time in given ranges.
 * Date range start and end are both inclusive.
 **/
export function generateDatesWithinRanges(
  dateRanges: [Date, Date][],
  weekday: Weekday,
  time: string,
): Date[] {
  return dateRanges.flatMap((dateRange) => {
    const [start, end] = dateRange;
    const maybeMatchingDate: Date = generateDate(start, weekday, time);

    const result: Date[] = [];
    while (maybeMatchingDate >= start && maybeMatchingDate <= end) {
      result.push(new Date(maybeMatchingDate)); // Clone value, so we don't add the same instance several times
      maybeMatchingDate.setDate(maybeMatchingDate.getDate() + 7);
    }
    return result;
  });
}

/**
 * Returns date with format matching example: 20250901T143000
 **/
export function toIcsDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    date.getFullYear() +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    pad(date.getSeconds())
  );
}
