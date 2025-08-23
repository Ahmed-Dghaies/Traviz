import { useMemo, useState } from "react";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ActivityForm } from "@/components/activity-form";
import { cn } from "@/lib/utils";
import { CategoryIcon } from "@/components/category-icon";
import { CATEGORY_PALETTE, type categoryPaletteKeys } from "@/types/categories";
import { useGetActivitiesQuery, useGetActivityQuery } from "@/lib/supabase/tripsApi";
import { skipToken } from "@reduxjs/toolkit/query";
import { Plus } from "lucide-react";

export function ScheduleTab({
  tripId,
  startDate,
  endDate,
}: {
  tripId: string;
  startDate: string;
  endDate: string;
}) {
  const days = useMemo(() => expandDays(startDate, endDate), [startDate, endDate]);
  const [openForDate, setOpenForDate] = useState<string | null>(null);

  return (
    <div className="grid gap-3">
      {days.map((d, idx) => (
        <DayCard
          key={d.iso}
          tripId={tripId}
          dateIso={d.iso}
          title={`${idx + 1} days`}
          dateLabel={fmtDate(d.date)}
          timezone={"UTC+0"}
          onAdd={() => setOpenForDate(d.iso)}
        />
      ))}

      <ActivityForm
        tripId={tripId}
        open={!!openForDate}
        defaultDate={openForDate || undefined}
        onOpenChange={(o) => !o && setOpenForDate(null)}
      />
    </div>
  );
}

function DayCard({
  tripId,
  dateIso,
  title,
  dateLabel,
  timezone,
  onAdd,
}: {
  tripId: string;
  dateIso: string;
  title: string;
  dateLabel: string;
  timezone: string;
  onAdd: () => void;
}) {
  const { data: activities } = useGetActivitiesQuery(tripId ?? skipToken);

  const list = useMemo(() => {
    return (activities ?? [])
      .filter((a) => a.tripId === tripId && sameDay(a.date, dateIso))
      .sort((a, b) => a.order - b.order || (a.startTime || "").localeCompare(b.startTime || ""));
  }, [activities, tripId, dateIso]);

  function sameDay(date1: string, date2: string): boolean {
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
      throw new Error("Invalid date string provided.");
    }

    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }

  return (
    <div className="rounded-2xl border bg-card">
      <div className="flex items-center justify-between px-4 pt-3">
        <div className="text-teal-500 font-semibold">{title}</div>
        <div className="text-muted-foreground text-xs">{timezone}</div>
      </div>
      <div className="px-4 text-sm text-muted-foreground">{dateLabel}</div>

      <CardContent className="grid gap-2 pt-3">
        {list.length === 0 ? (
          <div className="text-sm text-muted-foreground px-2 pb-2">No activities yet.</div>
        ) : (
          list.map((a) => <ActivityRow key={a.id} activityId={a.id} />)
        )}

        <div className="px-4 pb-4">
          <Button onClick={onAdd} className="bg-teal-600 hover:bg-teal-500 text-white">
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </CardContent>
    </div>
  );
}

function ActivityRow({ activityId }: { activityId: string }) {
  const { data: activity } = useGetActivityQuery(activityId ?? skipToken);
  if (!activity) return null;

  const category = (activity.category as categoryPaletteKeys) || "none";
  const colorClass = CATEGORY_PALETTE[category] || "text-muted-foreground";

  return (
    <div className="mx-4 rounded-xl bg-muted/30 border p-3">
      <div className="flex items-start gap-3 h-full">
        <div className={cn("mt-0.5 shrink-0 rounded-full p-2", colorClass)}>
          <CategoryIcon category={category} className="h-4 w-4" />
        </div>

        <div className="flex-1 min-w-0 h-full">
          <div className="flex items-center justify-between gap-2 h-full">
            <div className="font-medium truncate">{activity.name || "Untitled activity"}</div>
            <div className=" text-xs text-muted-foreground tabular-nums flex flex-col justify-center h-full">
              <span className="flex">
                {activity.startTime || "All day"}
                {activity.endTime ? `-${activity.endTime}` : null}
              </span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground truncate">
            {activity.address || activity.url || activity.memo || ""}
          </div>
        </div>
      </div>
    </div>
  );
}

function expandDays(startIso: string, endIso: string) {
  const days: { date: Date; iso: string }[] = [];
  const start = new Date(startIso);
  const end = new Date(endIso);
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const copy = new Date(d);
    const iso = toYmd(copy);
    days.push({ date: copy, iso });
  }
  return days;
}
function fmtDate(d: Date) {
  return new Intl.DateTimeFormat(undefined, {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    weekday: "short",
  }).format(d);
}
function toYmd(d: Date) {
  const z = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
}
