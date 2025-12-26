export function extractChangedLines(diff: string) {
    return diff
      .split("\n")
      .filter(
        (line) =>
          line.startsWith("+") ||
          line.startsWith("-")
      )
      .slice(0, 300) // token safety
      .join("\n");
  }
  