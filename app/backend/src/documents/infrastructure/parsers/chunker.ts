/**
 * Split text into overlapping chunks.
 * ~500 tokens ≈ 2000 chars. Overlap: 200 chars.
 */
export function chunkText(
  text: string,
  chunkSize = 2000,
  overlap = 200,
): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end).trim());
    start += chunkSize - overlap;
  }

  return chunks.filter((c) => c.length > 50); // discard tiny trailing chunks
}
