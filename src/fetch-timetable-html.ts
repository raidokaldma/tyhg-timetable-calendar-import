import type { Config } from "./types.ts";

export async function fetchTimetableHtml(config: Config): Promise<string> {
  const response = await fetch(config.timetableUrl, {
    headers: { "User-Agent": "github.com/raidokaldma/tyhg-timetable-calendar-import" },
  });
  if (!response.ok) {
    throw new Error(
      "Unexpected response from fetchTimetableHtml: " + response.status,
    );
  }
  const bytes = await response.arrayBuffer();
  return new TextDecoder("latin1").decode(bytes);
}
