import {
  beforeEach,
  describe,
  it,
  type Mock,
  snapshot,
  type TestContext,
} from "node:test";
import { readFile } from "node:fs/promises";

// By default, multiline string is serialized with JSON.stringify(),
// and snapshot value becomes a single line of JSON string, which is very hard to diff.
// Using custom serializer for snapshots, that keeps multiline string as-is, so that diffing is straightforward.
snapshot.setDefaultSnapshotSerializers([(value: string) => value]);

describe("application", () => {
  beforeEach((c: TestContext) => {
    c.mock.module("../src/fetch-timetable-html.ts", {
      namedExports: {
        fetchTimetableHtml: () =>
          readFile("test/fixtures/index_6A.html", "latin1"),
      },
    });

    // mock console.log
    c.mock.method(console, "log", () => undefined);
  });

  function getConsoleLog(): string {
    const call = (console.log as Mock<(arg: string) => void>).mock.calls[0];
    return call?.arguments[0];
  }

  it("generates calendar events from fetched HTML", async (t) => {
    process.argv.push("6A"); // Emulate application first argument
    await import("../src/app.ts"); // Run the application
    t.assert.snapshot(getConsoleLog());
  });
});
