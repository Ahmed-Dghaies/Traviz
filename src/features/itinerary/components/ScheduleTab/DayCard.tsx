import { useEffect, useMemo, useState } from "react";

import { skipToken } from "@reduxjs/toolkit/query";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { ActivityForm } from "@/features/itinerary/components/ActivityForm";
import { ActivityRow } from "@/features/itinerary/components/ScheduleTab/ActivityRow";
import { ActivityRowPlaceholder } from "@/features/itinerary/components/ScheduleTab/ActivityRowPlaceholder";
import { compareActivityTimes, sameDay } from "@/features/itinerary/components/ScheduleTab/utils";
import { useGetActivitiesQuery } from "@/lib/supabase/tripsApi";

import { ActivityDetailsModal } from "./ActivityDetailsModal";

import type { Activity } from "@/types/trips";

export function DayCard({
  tripId,
  dateIso,
  title,
  dateLabel,
  onAdd,
  activities,
  highlightActivityId,
}: {
  tripId: string;
  dateIso: string;
  title: string;
  dateLabel: string;
  onAdd?: () => void;
  activities?: Activity[];
  highlightActivityId?: string;
}) {
  const { data: fetchedActivities, isLoading } = useGetActivitiesQuery(
    activities ? skipToken : tripId,
  );
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);
  const [detailsActivityId, setDetailsActivityId] = useState<string | null>(null);
  const list = useMemo(
    () =>
      (activities ?? fetchedActivities ?? [])
        .filter((activity) => activity.tripId === tripId && sameDay(activity.date, dateIso))
        .sort((firstActivity, secondActivity) =>
          compareActivityTimes(firstActivity, secondActivity),
        ),
    [activities, dateIso, fetchedActivities, tripId],
  );
  const [orderedActivities, setOrderedActivities] = useState<Activity[]>(list);

  useEffect(() => {
    setOrderedActivities(list);
  }, [list]);

  const detailsActivity = useMemo(
    () => orderedActivities.find((activity) => activity.id === detailsActivityId) ?? null,
    [detailsActivityId, orderedActivities],
  );

  return (
    <div className="w-full min-w-0 overflow-hidden rounded-2xl border bg-card">
      <div className="flex items-start justify-between px-4 pt-3">
        <div className="font-semibold text-teal-500">{title}</div>
        {onAdd ? (
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
        ) : null}
      </div>
      <div className="px-4 text-sm text-muted-foreground">{dateLabel}</div>

      <CardContent className="grid gap-2 py-3">
        {isLoading ? (
          <div className="grid gap-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <ActivityRowPlaceholder key={index} />
            ))}
          </div>
        ) : orderedActivities.length === 0 ? (
          <div className="px-2 pb-2 text-sm text-muted-foreground">No activities yet.</div>
        ) : (
          <div className="grid gap-2">
            {orderedActivities.map((activity) => (
              <ActivityRow
                key={activity.id}
                activity={activity}
                onOpen={() => setDetailsActivityId(activity.id)}
                isCurrent={activity.id === highlightActivityId}
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

      {detailsActivity ? (
        <ActivityDetailsModal
          activity={detailsActivity}
          open={Boolean(detailsActivity)}
          onOpenChange={(open) => !open && setDetailsActivityId(null)}
          onEdit={() => {
            setDetailsActivityId(null);
            setEditingActivityId(detailsActivity.id);
          }}
        />
      ) : null}
    </div>
  );
}
