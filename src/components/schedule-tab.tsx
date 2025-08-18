import { useEffect, useMemo, useState } from "react";
import { DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ActivityForm } from "@/components/activity-form";
import { useTripsStore } from "@/components/trips-store";
import { cn } from "@/lib/utils";
import { CategoryIcon } from "@/components/category-icon";
import { CATEGORY_PALETTE, type categoryPaletteKeys } from "@/types/categories";

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
  const { loadActivities } = useTripsStore();

  useEffect(() => {
    if (tripId) {
      loadActivities(tripId);
    }
  }, [tripId, loadActivities]);

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
  const { activities, reorderActivities } = useTripsStore();

  const list = useMemo(() => {
    console.log(activities);
    return activities
      .filter((a) => a.tripId === tripId && sameDay(a.date, dateIso))
      .sort((a, b) => a.order - b.order || (a.startTime || "").localeCompare(b.startTime || ""));
  }, [activities, tripId, dateIso]);

  const sensors = useSensors(useSensor(PointerSensor));

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

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = list.findIndex((x) => x.id === active.id);
    const newIndex = list.findIndex((x) => x.id === over.id);
    const newOrder = arrayMove(list, oldIndex, newIndex).map((x) => x.id);
    reorderActivities(tripId, dateIso, newOrder);
  }

  return (
    <div className="rounded-2xl border bg-card">
      <div className="flex items-center justify-between px-4 pt-3">
        <div className="text-teal-500 font-semibold">{title}</div>
        <div className="text-muted-foreground text-xs">{timezone}</div>
      </div>
      <div className="px-4 text-sm text-muted-foreground">{dateLabel}</div>

      <CardContent className="grid gap-2 pt-3">
        <DndContext sensors={sensors} onDragEnd={onDragEnd}>
          <SortableContext items={list.map((a) => a.id)} strategy={verticalListSortingStrategy}>
            {list.length === 0 ? (
              <div className="text-sm text-muted-foreground px-2 pb-2">No activities yet.</div>
            ) : (
              list.map((a) => <ActivityRow key={a.id} id={a.id} activityId={a.id} />)
            )}
          </SortableContext>
        </DndContext>

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

function ActivityRow({ id, activityId }: { id: string; activityId: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });
  const { activities } = useTripsStore();
  const a = activities.find((x) => x.id === activityId);
  if (!a) return null;

  const category = (a.category as categoryPaletteKeys) || "none";
  const colorClass = CATEGORY_PALETTE[category] || "text-muted-foreground";

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "mx-4 rounded-xl bg-muted/30 border p-3",
        isDragging && "ring-2 ring-teal-500/40"
      )}
    >
      <div className="flex items-start gap-3 h-full">
        <button
          aria-label="Drag"
          className="cursor-grab active:cursor-grabbing text-muted-foreground flex flex-col justify-center h-full"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>

        <div className={cn("mt-0.5 shrink-0 rounded-full p-2", colorClass)}>
          <CategoryIcon category={category} className="h-4 w-4" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="font-medium truncate">{a.name || "Untitled activity"}</div>
            <div className="text-teal-500 text-sm tabular-nums">
              {a.startTime || "All day"}
              {a.endTime ? (
                <span className="text-xs text-muted-foreground block leading-none">
                  -{a.endTime}
                </span>
              ) : null}
            </div>
          </div>
          <div className="text-xs text-muted-foreground truncate">
            {a.address || a.url || a.memo || ""}
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
