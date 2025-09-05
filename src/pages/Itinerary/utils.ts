export function formatDateRange(s: string, e: string) {
  const fmt = new Intl.DateTimeFormat(undefined, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  return `${fmt.format(new Date(s))} – ${fmt.format(new Date(e))}`;
}
