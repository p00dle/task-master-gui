function pad2(n: number) {
  return String(n).padStart(2, '0');
}

export function timestamp(n: any) {
  const isDate = n instanceof Date;
  const isNumber = isDate ? false : typeof n === 'number' && !isNaN(n);
  if (!isDate && !isNumber) return '';
  const date = n instanceof Date ? n : new Date(n);
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())} ${pad2(date.getHours())}:${pad2(
    date.getMinutes()
  )}:${pad2(date.getSeconds())}`;
}

export const camelCaseToUpperCase = (str: string): string => str.replace(/[A-Z]/g, (x) => ' ' + x).toUpperCase();

export function limitString(str: any, maxLength: number) {
  if (typeof str !== 'string') return '';
  if (str.length < maxLength) return str;
  else return str.slice(0, maxLength - 3) + '...';
}

export function interval(since?: any) {
  const isDate = since instanceof Date;
  const isNumber = isDate ? false : typeof since === 'number' && !isNaN(since);
  if (!isDate && !isNumber) return '';
  const n = Date.now() - +since;
  const daysMs = n - (n % 86_400_000);
  const hoursMs = n - daysMs - ((n - daysMs) % 3_600_000);
  const minutesMs = n - daysMs - hoursMs - ((n - daysMs - hoursMs) % 60_000);
  const days = daysMs / 86_400_000;
  const hours = hoursMs / 3_600_000;
  const minutes = minutesMs / 60_000;
  return `${days > 0 ? days + 'd ' : ''}${hours > 0 ? hours + 'h ' : ''}${minutes}m`;
}
