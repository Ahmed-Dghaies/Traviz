export function sameDay(date1: string, date2: string): boolean {
  const firstDate = new Date(date1);
  const secondDate = new Date(date2);

  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  );
}

export function expandDays(startIso: string, endIso: string) {
  const days: { date: Date; iso: string }[] = [];
  const start = new Date(startIso);
  const end = new Date(endIso);

  for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    const copy = new Date(date);
    days.push({ date: copy, iso: toYmd(copy) });
  }

  return days;
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    weekday: "short",
  }).format(date);
}

function toYmd(date: Date) {
  const zeroPad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${zeroPad(date.getMonth() + 1)}-${zeroPad(date.getDate())}`;
}
