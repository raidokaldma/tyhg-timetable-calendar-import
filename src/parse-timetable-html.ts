import { JSDOM } from "jsdom";
import { chunkArray, uniqueBy } from "./utils/array-utils.ts";
import { formatDate } from "./utils/date-utils.ts";
import type { Config, Event, Weekday } from "./types.ts";
import { sortEvents } from "./sort-events.ts";

/** Parses horrendous timetable HTML and produces data for creating calendar events */
export function parseTimetableHtml(html: string, config: Config): Event[] {
  const jsdom = new JSDOM(html);

  const updatedAtString = jsdom.window.document.querySelector(
    "table tr:nth-child(2) > td:nth-child(3)",
  ).textContent;
  const updatedAt: Date = parseDate(updatedAtString!);

  const table: HTMLTableElement =
    jsdom.window.document.querySelector<HTMLTableElement>(
      "body > center > table",
    );
  const normalizedTable: HTMLTableCellElement[][] = normalizeTable(table);

  const events: Event[] = timetableToEvents(normalizedTable, updatedAt, config);
  return sortEvents(events);
}

/** Parses date, expected format: d.M.yyyy hh:mm */
function parseDate(str: string): Date {
  const [datePart, timePart] = str.split(" ");
  const [day, month, year] = datePart.split(".").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  const date = new Date(year, month - 1, day, hour, minute);
  if (isNaN(date.valueOf())) {
    throw new Error("Could not parse date from HTML: " + str);
  }

  return date;
}

/** Ensure each table cell with colspan and rowspan is broken into separate cells */
function normalizeTable(htmlTable: HTMLTableElement): HTMLTableCellElement[][] {
  const resultGrid: HTMLTableCellElement[][] = [];

  let rowIdx = 0;
  for (let tableRow of htmlTable.rows) {
    resultGrid[rowIdx] ??= []; // Ensure row exists

    let colIdx = 0;
    for (const tableCell of tableRow.cells) {
      // Skip, if any previous row had rowspan set, cell is already set
      while (resultGrid[rowIdx][colIdx] !== undefined) colIdx++;

      const rowspan = parseInt(tableCell.getAttribute("rowspan") || "1", 10);
      const colspan = parseInt(tableCell.getAttribute("colspan") || "1", 10);

      // Ensure each grid cell is assigned (even the ones calculated from colspan and rowspan)
      for (let r = 0; r < rowspan; r++) {
        for (let c = 0; c < colspan; c++) {
          resultGrid[rowIdx + r] ??= [];
          resultGrid[rowIdx + r][colIdx + c] = tableCell;
        }
      }

      colIdx += colspan;
    }
    rowIdx++;
  }

  return resultGrid;
}

function timetableToEvents(
  table: HTMLTableCellElement[][],
  updatedAt: Date,
  config: Config,
): Event[] {
  return (
    table
      // Every 2nd timetable row contains actual lessons
      .filter((_, idx) => idx % 2 !== 0)
      .flatMap((timetableRow: HTMLTableCellElement[], i) =>
        timetableRowToEvents(i, timetableRow, updatedAt, config),
      )
  );
}

function timetableRowToEvents(
  tableRowIdx: number,
  tableRowCells: HTMLTableCellElement[],
  updatedAt: Date,
  config: Config,
): Event[] {
  const tableCellCountPerWeekday = 12;
  const expectedTableCellCountPerRow = 1 + 5 * 12; // 1 index column, 5 weekdays with 12 cells each
  if (tableRowCells.length !== expectedTableCellCountPerRow) {
    throw new Error(
      `Expected exactly ${expectedTableCellCountPerRow} table cells, got ${tableRowCells.length} instead`,
    );
  }

  const tableRowCellsExceptFirst: HTMLTableCellElement[] =
    tableRowCells.slice(1); // Remove first column (index column)

  // array[weekday][12 table cells]
  const tableCellsByWeekDay: HTMLTableCellElement[][] = chunkArray(
    tableRowCellsExceptFirst,
    tableCellCountPerWeekday,
  );

  return tableCellsByWeekDay
    .map((tableCellsOfWeekday: HTMLTableCellElement[]) => {
      return tableCellsOfWeekday
        .flatMap((tableCell): Lesson[] =>
          toLessons(tableCell, updatedAt, config),
        )
        .filter(uniqueBy("name", "room"));
    })
    .flatMap((lessons, idxAsWeekday: Weekday): Event[] => {
      return lessons
        .map((lesson, idx) => {
          if (!lesson.name) return;
          return toEvent(
            lesson,
            tableRowIdx,
            idxAsWeekday,
            updatedAt,
            idx,
            config,
          );
        })
        .filter((e) => !!e);
    });
}

/** One table cell may contain info about multiple lessons */
function toLessons(
  tableCell: HTMLTableCellElement,
  updatedAt: Date,
  config: Config,
): Lesson[] {
  return [...tableCell.querySelectorAll("table tr")].flatMap((tr) => {
    const [lessonName, teacher, room] = [...tr.querySelectorAll("td")].map(
      (td) => td.textContent.trim(),
    );
    const description = [
      "Tund: " + lessonName,
      "Õpetaja: " + teacher,
      "Info seisuga: " + formatDate(updatedAt),
      config.timetableUrl,
    ]
      .filter((value) => !!value)
      .join("\n");
    return {
      name: lessonName.replace(/^[.*]+/, ""),
      room: room,
      description: description,
    };
  });
}

type Lesson = { name: string; room: string; description: string };
function toEvent(
  lesson: Lesson,
  timetableRowIdx: number,
  weekday: Weekday,
  updatedAt: Date,
  idx: number, // For distinguishing parallel lessons
  config: Config,
): Event {
  const [startTime, endTime] = config.timeSchedule[timetableRowIdx];
  return {
    uid: `tri-${config.trimester.number}-day-${weekday}-${timetableRowIdx}-${idx}`,
    startTime: startTime,
    endTime: endTime,
    title: lesson.name,
    description: lesson.description,
    room: lesson.room ?? "",
    weekday: weekday,
    updatedAt: updatedAt,
  };
}
