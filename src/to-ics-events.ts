import type { Config, Event } from "./types.ts";
import {
  generateDate,
  generateDatesWithinRanges,
  toIcsDate,
} from "./utils/date-utils.ts";
import { TIMEZONE } from "./constants.ts";

export function toIcsEvents(events: Event[], config: Config): string {
  return [
    `BEGIN:VCALENDAR`,
    `VERSION:2.0`,
    `PRODID:-//-//NONSGML v1.0//EN`,
    `X-WR-CALNAME:TÜG ${config.className}`,
    `X-WR-TIMEZONE:${TIMEZONE}`,
    `${events.map((event) => toIcsEvent(event, config)).join("\n")}`,
    `END:VCALENDAR`,
  ].join("\n");
}

const toIcsEvent = (event: Event, config: Config): string => {
  const [periodStart, periodEnd] = config.trimester.period;
  const start: Date = generateDate(periodStart, event.weekday, event.startTime);
  const end: Date = generateDate(periodStart, event.weekday, event.endTime);

  const excludedTimestamps: Date[] = generateDatesWithinRanges(
    config.trimester.holidays,
    event.weekday,
    event.startTime,
  );

  return [
    `BEGIN:VEVENT`,
    `UID:${event.uid}`,
    `DTSTAMP;TZID=${TIMEZONE}:${toIcsDate(event.updatedAt)}`,
    `DTSTART;TZID=${TIMEZONE}:${toIcsDate(start)}`,
    `DTEND;TZID=${TIMEZONE}:${toIcsDate(end)}`,
    `RRULE:FREQ=WEEKLY;UNTIL=${toIcsDate(periodEnd)}`,
    `EXDATE;TZID=${TIMEZONE}:${excludedTimestamps.map(toIcsDate).join(",")}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${escapeNewlines(event.description)}`,
    `LOCATION:${event.room}`,
    `URL:${config.timetableUrl}`,
    `END:VEVENT`,
  ].join("\n");
};

function escapeNewlines(text: string) {
  return text.replaceAll(/\n/g, "\\n");
}
