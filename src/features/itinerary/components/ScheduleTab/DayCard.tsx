import { useEffect, useMemo, useState } from "react";

import { skipToken } from "@reduxjs/toolkit/query";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { ActivityForm } from "@/features/itinerary/components/ActivityForm";
import { ActivityRow } from "@/features/itinerary/components/ScheduleTab/ActivityRow";
import { sameDay } from "@/features/itinerary/components/ScheduleTab/utils";
import { useGetActivitiesQuery } from "@/lib/supabase/tripsApi";

import type { Activity } from "@/types/trips";

export function DayCard({
  tripId,
  dateIso,
  title,
  dateLabel,
  onAdd,
}: {
  tripId: string;
  dateIso: string;
  title: string;
  dateLabel: string;
  onAdd: () => void;
}) {
  const { data: activities } = useGetActivitiesQuery(tripId ?? skipToken);
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);
  const list = useMemo(
    () =>
      (activities ?? [])
        .filter((activity) => activity.tripId === tripId && sameDay(activity.date, dateIso))
        .sort((firstActivity, secondActivity) =>
          compareActivityTimes(firstActivity, secondActivity),
        ),
    [activities, dateIso, tripId],
  );
  const [orderedActivities, setOrderedActivities] = useState<Activity[]>(list);

  useEffect(() => {
    setOrderedActivities(list);
  }, [list]);

  return (
    <div className="w-full min-w-0 overflow-hidden rounded-2xl border bg-card">
      <div className="flex items-start justify-between px-4 pt-3">
        <div className="font-semibold text-teal-500">{title}</div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0 text-muted-foreground"
          onClick={onAdd}
          aria-label={`Add activity for ${title}`}
        >
          <span className="text-lg leading-none">+</span>
        </Button>
      </div>
      <div className="px-4 text-sm text-muted-foreground">{dateLabel}</div>

      <CardContent className="grid gap-2 py-3">
        {orderedActivities.length === 0 ? (
          <div className="px-2 pb-2 text-sm text-muted-foreground">No activities yet.</div>
        ) : (
          <div className="grid gap-2">
            {orderedActivities.map((activity) => (
              <ActivityRow
                key={activity.id}
                activity={activity}
                onOpen={() => setEditingActivityId(activity.id)}
              />
            ))}
          </div>
        )}
      </CardContent>

      <ActivityForm
        tripId={tripId}
        activityId={editingActivityId ?? undefined}
        open={Boolean(editingActivityId)}
        onOpenChange={(open) => !open && setEditingActivityId(null)}
      />
    </div>
  );
}

function compareActivityTimes(firstActivity: Activity, secondActivity: Activity) {
  const firstTime = timeValue(firstActivity.startTime);
  const secondTime = timeValue(secondActivity.startTime);

  return firstTime - secondTime || firstActivity.name.localeCompare(secondActivity.name);
}

function timeValue(time?: string) {
  if (!time) return Number.POSITIVE_INFINITY;

  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}
