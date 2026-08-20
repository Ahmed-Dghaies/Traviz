import { useMemo, useState } from "react";

import { ActivityForm } from "@/components/ActivityForm";

import { DayCard } from "./DayCard";
import { expandDays, formatDate } from "./utils";

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
    <div className="grid gap-3 w-full">
      {days.map((day, index) => (
        <DayCard
          key={day.iso}
          tripId={tripId}
          dateIso={day.iso}
          title={`Day ${index + 1}`}
          dateLabel={formatDate(day.date)}
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
