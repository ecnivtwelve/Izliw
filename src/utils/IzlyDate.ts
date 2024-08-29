export function extractDate(dateString: string, split: string = ' à '): Date {
  const [datePart, timePart] = dateString.split(split);
  const [day, month, year] = datePart.split('/');
  const [hour, minute] = timePart.split(':');

  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute));

  return date;
}