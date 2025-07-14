export function toBase64(str: string): string {
  return Buffer.from(str, 'utf-8').toString('base64');
}

export function fromBase64(encoded: string | null | undefined): string {
  return encoded ? Buffer.from(encoded, 'base64').toString('utf-8') : '';
}