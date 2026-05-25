export function parsePdf(buffer: Buffer): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfParse = require('pdf-parse') as (
    buf: Buffer,
  ) => Promise<{ text: string }>;
  return pdfParse(buffer).then((data) => data.text);
}
