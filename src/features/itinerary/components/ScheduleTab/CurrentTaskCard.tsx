import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import type { Activity } from "@/types/trips";

export function CurrentTaskCard({ activity, onOpen }: { activity: Activity; onOpen: () => void }) {
  const displayContent = activity.address || activity.url || activity.memo;

  return (
    <Card
      className="inline-flex h-fit w-full cursor-pointer overflow-hidden border-teal-500/40 py-0 shadow-sm transition-colors hover:border-teal-500/60 hover:bg-teal-500/5"
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen();
        }
      }}
      aria-label={`Open current task ${activity.name || "Untitled activity"}`}
    >
      <CardHeader className="gap-2 border-b border-teal-500/10 bg-teal-500/5 py-3!">
        <CardTitle className="text-teal-600">
          Current task: {activity.name || "Untitled activity"}
        </CardTitle>
        <CardDescription className="tabular-nums">
          {formatDate(new Date(activity.date))} · {formatActivityTime(activity)}
        </CardDescription>
      </CardHeader>
      {displayContent ? (
        <CardContent className="grid gap-1">
          {activity.address ? (
            <div className="text-sm text-muted-foreground">{activity.address}</div>
          ) : null}
          {activity.url ? (
            <div className="text-sm text-muted-foreground">{activity.url}</div>
          ) : null}
          {activity.memo ? (
            <div className="text-sm text-muted-foreground">{activity.memo}</div>
          ) : null}
        </CardContent>
      ) : null}
    </Card>
  );
}

function formatActivityTime(activity: Activity) {
  if (activity.startTime && activity.endTime) {
    return `${activity.startTime} - ${activity.endTime}`;
  }

  if (activity.startTime) {
    return activity.startTime;
  }

  if (activity.endTime) {
    return `Until ${activity.endTime}`;
  }

  return "All day";
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    weekday: "short",
  }).format(date);
}
