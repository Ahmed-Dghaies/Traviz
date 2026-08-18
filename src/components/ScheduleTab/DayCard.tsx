import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { skipToken } from "@reduxjs/toolkit/query";
import { Plus } from "lucide-react";

import { ActivityForm } from "@/components/ActivityForm";
import { ActivityRow } from "@/components/ScheduleTab/ActivityRow";
import { sameDay } from "@/components/ScheduleTab/utils";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import {
  useDeleteActivityMutation,
  useGetActivitiesQuery,
  useUpdateActivityMutation,
} from "@/lib/supabase/tripsApi";
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
  const [updateActivity] = useUpdateActivityMutation();
  const [deleteActivity] = useDeleteActivityMutation();
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));
  const list = useMemo(
    () =>
      (activities ?? [])
        .filter((activity) => activity.tripId === tripId && sameDay(activity.date, dateIso))
        .sort(
          (firstActivity, secondActivity) =>
            firstActivity.order - secondActivity.order ||
            (firstActivity.startTime || "").localeCompare(secondActivity.startTime || ""),
        ),
    [activities, dateIso, tripId],
  );
  const [orderedActivities, setOrderedActivities] = useState<Activity[]>(list);

  useEffect(() => {
    setOrderedActivities(list);
  }, [list]);

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;

    const oldIndex = orderedActivities.findIndex((activity) => activity.id === active.id);
    const newIndex = orderedActivities.findIndex((activity) => activity.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const nextActivities = arrayMove(orderedActivities, oldIndex, newIndex);
    setOrderedActivities(nextActivities);

    await Promise.all(
      nextActivities.map((activity, index) =>
        activity.order === index
          ? Promise.resolve()
          : updateActivity({ id: activity.id, updates: { order: index } }).unwrap(),
      ),
    );
  };

  const handleDelete = async (activity: Activity) => {
    if (confirm(`Delete ${activity.name || "this activity"}?`)) {
      await deleteActivity(activity.id).unwrap();
    }
  };

  return (
      <div className="rounded-2xl border bg-card w-full overflow-hidden min-w-0">
      <div className="flex items-center justify-between px-4 pt-3">
        <div className="font-semibold text-teal-500">{title}</div>
      </div>
      <div className="px-4 text-sm text-muted-foreground">{dateLabel}</div>

      <CardContent className="grid gap-2 pt-3">
        {orderedActivities.length === 0 ? (
          <div className="px-2 pb-2 text-sm text-muted-foreground">No activities yet.</div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={orderedActivities.map((activity) => activity.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="grid gap-2">
                {orderedActivities.map((activity) => (
                  <ActivityRow
                    key={activity.id}
                    activity={activity}
                    onEdit={() => setEditingActivityId(activity.id)}
                    onDelete={() => handleDelete(activity)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        <div className="px-4 pb-4">
          <Button onClick={onAdd} className="bg-teal-600 text-white hover:bg-teal-500">
            <Plus className="mr-1 h-4 w-4" />
            Add
          </Button>
        </div>
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
