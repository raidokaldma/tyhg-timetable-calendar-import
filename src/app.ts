import { fetchTimetableHtml } from "./fetch-timetable-html.ts";
import { parseTimetableHtml } from "./parse-timetable-html.ts";
import { parseArgs } from "./parse-args.ts";
import { initConfig } from "./config.ts";
import { toIcsEvents } from "./to-ics-events.ts";
import type { Config, Event } from "./types.ts";

async function main() {
  const { className } = parseArgs();
  const config: Config = initConfig(className);
  const timetableHtml: string = await fetchTimetableHtml(config);
  const events: Event[] = parseTimetableHtml(timetableHtml, config);
  const icsEvents: string = toIcsEvents(events, config);

  console.log(icsEvents);
}

await main();
