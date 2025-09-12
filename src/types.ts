export type Weekday = 0 | 1 | 2 | 3 | 4; // Mon-Fri

/** string matching "hh:mm" */
export type Time =
  `${`${0 | 1}${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}` | `2${0 | 1 | 2 | 3}`}:${0 | 1 | 2 | 3 | 4 | 5}${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`;

export type Trimester = {
  number: 1 | 2 | 3;
  period: [Date, Date];
  // https://tyhg.edu.ee/oppetoo/koolivaheajad/
  holidays: [Date, Date][];
};

export type TimeSchedule = [Time, Time][];

export type Config = {
  className: string;
  timetableUrl: string;
  trimester: Trimester;
  // https://tyhg.edu.ee/oppetoo/tunniplaan/
  timeSchedule: TimeSchedule;
};

export type Event = {
  title: string;
  description: string;
  weekday: Weekday;
  room: string;
  startTime: string;
  endTime: string;
  updatedAt: Date;
  uid: string;
};
