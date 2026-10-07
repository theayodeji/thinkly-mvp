export function preprocessMath(text: string): string {
  if (!text) return "";

  // Replace \[ ... \] with $$ ... $$
  let processed = text.replace(/\\\[([\s\S]*?)\\\]/g, (_, math) => `\n$$\n${math.trim()}\n$$\n`);

  // Replace \( ... \) with $ ... $
  processed = processed.replace(/\\\(([\s\S]*?)\\\)/g, (_, math) => `$${math.trim()}$`);

  return processed;
}
