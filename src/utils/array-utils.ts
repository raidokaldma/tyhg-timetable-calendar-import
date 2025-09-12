/**
 * Splits array into chunks
 **/
export function chunkArray<T>(arr: T[], size: number): T[][] {
  return Array.from(
    { length: Math.ceil(arr.length / size) },
    (_: T, i: number): T[] => arr.slice(i * size, i * size + size),
  );
}

/**
 * Predicate for array.filter(), filters out duplicate values.
 **/
export function uniqueBy<Item, Key extends keyof Item>(
  ...keys: Key[]
): (item: Item) => boolean {
  const uniqueItems: Item[] = [];

  return (item: Item): boolean => {
    const alreadyExists: boolean = uniqueItems.some((uniqueItem) =>
      keys.every((key) => uniqueItem[key] === item[key]),
    );
    if (alreadyExists) {
      return false;
    }
    uniqueItems.push(item);
    return true;
  };
}
