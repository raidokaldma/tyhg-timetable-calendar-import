import { CLASS_SCHEDULES, TRIMESTERS } from "./constants.ts";
import type { Config, Trimester } from "./types.ts";

export function initConfig(className: string): Config {
  return {
    className,
    timetableUrl: `https://tyhg.edu.ee/tunniplaan/index_${className}.htm`,
    trimester: getCurrentTrimester(),
    timeSchedule: CLASS_SCHEDULES[className],
  };
}

function getCurrentTrimester(): Trimester {
  const trimester = TRIMESTERS.find(
    (trimester) => new Date() <= trimester.period[1],
  );
  if (!trimester) {
    throw new Error("Could not determine current trimester");
  }
  return trimester;
}
