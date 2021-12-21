export const commonLetter = (
  strings: string[],
  pos: number,
  onEqual: string
): string => {
  const amounts: Record<string, number> = {};
  strings.forEach((str) => {
    amounts[str.charAt(pos)] = amounts[str.charAt(pos)]
      ? amounts[str.charAt(pos)] + 1
      : 1;
  });

  let high = 0;
  let highChar = onEqual;
  Object.entries(amounts).forEach(([key, num]) => {
    if (num > high) {
      high = num;
      highChar = key;
    } else if (num === high) {
      highChar = onEqual;
    }
  });

  return highChar;
};
