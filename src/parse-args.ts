import { CLASSES } from "./constants.ts";

export function parseArgs(): { className: string } {
  const className = process.argv.at(2); // [path to node executable, path to file, 1st arg]
  if (!className || !CLASSES.includes(className)) {
    console.log(
      "Usage: src/app.ts <class>\n\n<class> must be one of the following:\n" +
        CLASSES.join(", "),
    );
    process.exit(1);
  }
  return { className };
}
