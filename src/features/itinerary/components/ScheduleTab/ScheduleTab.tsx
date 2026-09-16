import { useMemo, useState } from "react";

import { skipToken } from "@reduxjs/toolkit/query";

import { useGetActivitiesQuery } from "@/lib/supabase/tripsApi";

import { ActivityForm } from "../ActivityForm";

import { ActivityDetailsModal } from "./ActivityDetailsModal";
import { CurrentTaskCard } from "./CurrentTaskCard";
import { DayCard } from "./DayCard";
import { expandDays, formatDate, getCurrentActivity } from "./utils";

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
  const { data: activities } = useGetActivitiesQuery(tripId ?? skipToken);
  const [openForDate, setOpenForDate] = useState<string | null>(null);
  const [currentTaskOpen, setCurrentTaskOpen] = useState(false);
  const [editingCurrentActivityId, setEditingCurrentActivityId] = useState<string | null>(null);
  const currentActivity = useMemo(() => getCurrentActivity(activities ?? []), [activities]);

  return (
    <div className="grid gap-3 w-full">
      {currentActivity ? (
        <>
          <CurrentTaskCard activity={currentActivity} onOpen={() => setCurrentTaskOpen(true)} />

          <ActivityDetailsModal
            activity={currentActivity}
            open={currentTaskOpen}
            onOpenChange={setCurrentTaskOpen}
            onEdit={() => {
              setCurrentTaskOpen(false);
              setEditingCurrentActivityId(currentActivity.id);
            }}
            titlePrefix="Current task"
          />

          <ActivityForm
            tripId={tripId}
            activityId={editingCurrentActivityId ?? undefined}
            open={Boolean(editingCurrentActivityId)}
            onOpenChange={(open) => !open && setEditingCurrentActivityId(null)}
          />
        </>
      ) : null}

      {days.map((day, index) => (
        <DayCard
          key={day.iso}
          tripId={tripId}
          dateIso={day.iso}
          title={`Day ${index + 1}`}
          dateLabel={formatDate(day.date)}
          activities={activities ?? []}
          highlightActivityId={currentActivity?.id}
          onAdd={() => setOpenForDate(day.iso)}
        />
      ))}

      <ActivityForm
        tripId={tripId}
        open={Boolean(openForDate)}
        defaultDate={openForDate ?? undefined}
        onOpenChange={(open) => !open && setOpenForDate(null)}
      />
    </div>
  );
}
