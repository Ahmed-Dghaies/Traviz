import type { Activity } from "@/types/trips";

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

export function compareActivityTimes(firstActivity: Activity, secondActivity: Activity) {
  const firstTime = timeValue(firstActivity.startTime);
  const secondTime = timeValue(secondActivity.startTime);

  return (
    firstTime - secondTime ||
    firstActivity.order - secondActivity.order ||
    firstActivity.name.localeCompare(secondActivity.name)
  );
}

export function getCurrentActivity(activities: Activity[], now = new Date()) {
  const currentDate = toYmd(now);
  const currentTime = now.getHours() * 60 + now.getMinutes();

  return activities
    .filter((activity) => sameDay(activity.date, currentDate) && isActivityOngoing(activity, currentTime))
    .sort(compareActivityTimes)[0];
}

function toYmd(date: Date) {
  const zeroPad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${zeroPad(date.getMonth() + 1)}-${zeroPad(date.getDate())}`;
}

function isActivityOngoing(activity: Activity, currentTime: number) {
  const startTime = timeValue(activity.startTime);
  const endTime = timeValue(activity.endTime ?? undefined);

  if (activity.startTime && activity.endTime) {
    return currentTime >= startTime && currentTime <= endTime;
  }

  if (activity.startTime) {
    return currentTime >= startTime;
  }

  if (activity.endTime) {
    return currentTime <= endTime;
  }

  return true;
}

function timeValue(time?: string | null) {
  if (!time) return Number.POSITIVE_INFINITY;

  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}
