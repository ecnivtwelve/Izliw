export function extractAmount(amount: string): number {
  return parseFloat(amount.replace(',', '.').replace('€', '').trim());
}