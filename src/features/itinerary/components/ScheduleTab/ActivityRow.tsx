import { ChevronRight } from "lucide-react";

import { CategoryIcon } from "@/components/category-icon";
import { cn } from "@/lib/utils";
import { CATEGORY_PALETTE, type categoryPaletteKeys } from "@/types/categories";

import type { Activity } from "@/types/trips";

export function ActivityRow({ activity, onOpen }: { activity: Activity; onOpen: () => void }) {
  const category = (activity.category as categoryPaletteKeys) || "none";
  const colorClass = CATEGORY_PALETTE[category] || "text-muted-foreground";

  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "flex w-full min-w-0 items-center gap-2 overflow-hidden rounded-xl border bg-muted/30 p-2.5 text-left transition-colors hover:bg-muted/50",
      )}
    >
      <div className={cn("shrink-0 rounded-full p-2", colorClass)}>
        <CategoryIcon category={category} className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <div className="flex-1 truncate font-medium">{activity.name || "Untitled activity"}</div>
          <div className="flex shrink-0 text-xs text-muted-foreground tabular-nums">
            {activity.startTime || "All day"}
            {activity.endTime ? `-${activity.endTime}` : null}
          </div>
        </div>
        <div className="truncate text-xs text-muted-foreground max-w-[80%]">
          {activity.address || activity.url || activity.memo || ""}
        </div>
      </div>

      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
    </button>
  );
}
