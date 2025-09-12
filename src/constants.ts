import type { TimeSchedule, Trimester } from "./types.ts";
import { endOfDay, startOfDay } from "./utils/date-utils.ts";

export const TRIMESTERS: [Trimester, Trimester, Trimester] = [
  {
    number: 1,
    period: [startOfDay("2025-09-01"), endOfDay("2025-11-28")],
    holidays: [[startOfDay("2025-10-20"), endOfDay("2025-10-26")]],
  },
  {
    number: 2,
    period: [startOfDay("2025-12-01"), endOfDay("2026-03-06")],
    holidays: [
      [startOfDay("2025-12-22"), endOfDay("2026-01-04")],
      [startOfDay("2026-02-23"), endOfDay("2026-03-01")],
    ],
  },
  {
    number: 3,
    period: [startOfDay("2026-03-09"), endOfDay("2026-06-09")],
    holidays: [[startOfDay("2026-04-13"), endOfDay("2026-04-19")]],
  },
];

const primarySchoolSchedule: TimeSchedule = [
  ["08:00", "08:45"],
  ["09:00", "09:45"],
  ["09:55", "10:40"],
  ["11:05", "11:50"],
  ["12:00", "12:45"],
  ["12:55", "13:40"],
  ["13:50", "14:35"],
  ["14:45", "15:30"],
  ["15:40", "16:25"],
];

const middleSchoolSchedule: TimeSchedule = [
  ["08:00", "08:45"],
  ["09:00", "09:45"],
  ["09:55", "10:40"],
  ["10:50", "11:35"],
  ["12:00", "12:45"],
  ["12:55", "13:40"],
  ["13:50", "14:35"],
  ["14:45", "15:30"],
  ["15:40", "16:25"],
];

const highSchoolSchedule: TimeSchedule = [
  ["08:00", "08:45"],
  ["09:00", "09:45"],
  ["09:55", "10:40"],
  ["10:50", "11:35"],
  ["11:45", "12:30"],
  ["12:55", "13:40"],
  ["13:50", "14:35"],
  ["14:45", "15:30"],
  ["15:40", "16:25"],
];

export const CLASS_SCHEDULES: Record<string, TimeSchedule> = {
  "1A": primarySchoolSchedule,
  "1B": primarySchoolSchedule,
  "1C": primarySchoolSchedule,
  "1D": primarySchoolSchedule,
  "2A": primarySchoolSchedule,
  "2B": primarySchoolSchedule,
  "2C": primarySchoolSchedule,
  "3A": primarySchoolSchedule,
  "3B": primarySchoolSchedule,
  "3C": primarySchoolSchedule,
  "3D": primarySchoolSchedule,
  "4A": primarySchoolSchedule,
  "4B": primarySchoolSchedule,
  "5A": middleSchoolSchedule,
  "5B": middleSchoolSchedule,
  "5C": middleSchoolSchedule,
  "5D": middleSchoolSchedule,
  "5E": middleSchoolSchedule,
  "6A": middleSchoolSchedule,
  "6B": middleSchoolSchedule,
  "6C": middleSchoolSchedule,
  "7A": middleSchoolSchedule,
  "7B": middleSchoolSchedule,
  "8S": middleSchoolSchedule,
  "8A": middleSchoolSchedule,
  "8B": middleSchoolSchedule,
  "9A": middleSchoolSchedule,
  "9B": middleSchoolSchedule,
  "9C": middleSchoolSchedule,
  "9D": middleSchoolSchedule,
  "10A": highSchoolSchedule,
  "10B": highSchoolSchedule,
  "10C": highSchoolSchedule,
  "11A": highSchoolSchedule,
  "11B": highSchoolSchedule,
  "11C": highSchoolSchedule,
  "12": highSchoolSchedule,
};

// ["1A", "1B", ...]
export const CLASSES: string[] = Object.keys(CLASS_SCHEDULES);

export const TIMEZONE = "Europe/Tallinn";
