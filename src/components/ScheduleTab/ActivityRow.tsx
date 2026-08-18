import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CategoryIcon } from "@/components/category-icon";
import { cn } from "@/lib/utils";
import { CATEGORY_PALETTE, type categoryPaletteKeys } from "@/types/categories";
import type { Activity } from "@/types/trips";

export function ActivityRow({
  activity,
  onEdit,
  onDelete,
}: {
  activity: Activity;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: activity.id,
  });
  const category = (activity.category as categoryPaletteKeys) || "none";
  const colorClass = CATEGORY_PALETTE[category] || "text-muted-foreground";

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn("mx-4 min-w-0 overflow-hidden rounded-xl border bg-muted/30 p-3", isDragging && "opacity-50")}
    >
      <div className="flex items-start gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="mt-0.5 size-8 shrink-0 cursor-grab touch-none text-muted-foreground active:cursor-grabbing"
          aria-label={`Reorder ${activity.name || "activity"}`}
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" />
        </Button>

        <div className={cn("mt-0.5 shrink-0 rounded-full p-2", colorClass)}>
          <CategoryIcon category={category} className="h-4 w-4" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="flex-1 truncate font-medium">
              {activity.name || "Untitled activity"}
            </div>
            <div className="flex shrink-0 text-xs text-muted-foreground tabular-nums">
              {activity.startTime || "All day"}
              {activity.endTime ? `-${activity.endTime}` : null}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8"
              aria-label={`Edit ${activity.name || "activity"}`}
              onClick={onEdit}
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 text-destructive hover:text-destructive"
              aria-label={`Delete ${activity.name || "activity"}`}
              onClick={onDelete}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
          <div className="truncate text-xs text-muted-foreground max-w-[80%]">
            {activity.address || activity.url || activity.memo || ""}
          </div>
        </div>
      </div>
    </div>
  );
}
