export function extractTextBetweenTags(html: string, tag: string): string {
  const regex = new RegExp(`<${tag}[^>]*>(.*?)<\/${tag}>`, 's');
  const match = html.match(regex);
  return match ? match[1].trim() : '';
}

export function extractTextByClass(html: string, className: string, index: number = 0): string {
  const regex = new RegExp(`<[^>]*class=[^>]*${className}[^>]*>(.*?)<\/`, 'g');
  const matches = [...html.matchAll(regex)];
  return matches[index] ? matches[index][1].trim() : '';
}

export function extractTextById(html: string, id: string): string {
  const regex = new RegExp(`<[^>]*id="${id}"[^>]*>(.*?)<\/`, 's');
  const match = html.match(regex);
  return match ? match[1].trim() : '';
}

export function extractAllListItems(html: string): string[] {
  const regex = /<li class="list-group-item"[^>]*>[\s\S]*?<\/li>/g;
  return html.match(regex) || [];
}

export function extractTableRows(html: string): string[] {
  const regex = /<tr>[\s\S]*?<\/tr>/g;
  return html.match(regex) || [];
}

export function extractTableColumns(row: string): string[] {
  const regex = /<td[^>]*>([\s\S]*?)<\/td>/g;
  const matches = [...row.matchAll(regex)];
  return matches.map(match => match[1].replace(/<[^>]*>/g, '').trim());
}

export function extractAttributeValue(html: string, attribute: string): string {
  const regex = new RegExp(`${attribute}="([^"]*)"`, 'i');
  const match = html.match(regex);
  return match ? match[1] : '';
}

export function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

export function extractRequestVerificationToken(html: string): string {
  const regex = /<input[^>]*name=["']__RequestVerificationToken["'][^>]*value=["']([^"']+)["'][^>]*>/i;
  const match = html.match(regex);
  return match ? match[1] : '';
}