export function parsePdf(buffer: Buffer): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfParse = require('pdf-parse');
  return pdfParse(buffer).then((data: { text: string }) => data.text);
}
