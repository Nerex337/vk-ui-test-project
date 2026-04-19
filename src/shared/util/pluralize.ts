export function pluralize(count: number, words: string[]): string {
  count = Math.floor(count);
  count = Math.abs(count) % 100;
  const remainder = count % 10;
  if (count > 10 && count < 20) {
    return words[2];
  }

  if (remainder > 1 && remainder < 5) {
    return words[1];
  }
  if (remainder === 1) {
    return words[0];
  }

  return words[2];
}

export const APPLICATION_PLURALS = ["заявка", "заявки", "заявок"];