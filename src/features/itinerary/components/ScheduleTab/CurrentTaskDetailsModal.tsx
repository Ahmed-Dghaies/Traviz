import { Pencil, X } from "lucide-react";

import { CategoryIcon } from "@/components/category-icon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { CATEGORY_PALETTE, type categoryPaletteKeys } from "@/types/categories";

import type { Activity } from "@/types/trips";

export function CurrentTaskDetailsModal({
  activity,
  open,
  onOpenChange,
  onEdit,
}: {
  activity: Activity;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
}) {
  const category = (activity.category as categoryPaletteKeys) || "none";

  const displayInfo =
    activity.address || activity.url || activity.memo || activity.cost || activity.image;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="max-w-[min(92vw,42rem)] overflow-hidden">
        <div className="flex justify-between relative border-b bg-card px-5 py-2 pr-0">
          <DialogHeader className="text-left gap-2">
            <DialogTitle className="text-xl">{activity.name || "Untitled activity"}</DialogTitle>
            <DialogDescription className="tabular-nums">
              {formatDate(new Date(activity.date))} · {formatActivityTime(activity)}
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onEdit}
              aria-label="Edit activity"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              aria-label="Close details"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ScrollArea>
          <div className="grid gap-4 py-2">
            <section className="rounded-2xl border bg-card p-4">
              <div className="mb-2 text-sm text-muted-foreground">Schedule icon</div>
              <div className="flex items-center gap-3">
                <div className={cn("rounded-full p-3", CATEGORY_PALETTE[category])}>
                  <CategoryIcon category={category} className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium capitalize">{category}</div>
                  <div className="text-sm text-muted-foreground">{activity.date}</div>
                </div>
              </div>
            </section>

            {!!displayInfo && (
              <section className="rounded-2xl border bg-card p-4">
                <div className="mb-2 text-sm text-muted-foreground">Info</div>
                <div className="grid gap-3 text-sm">
                  <DetailRow label="Address" value={activity.address} />
                  <DetailRow label="Reference URL" value={activity.url} />
                  <DetailRow label="Memo / Notes" value={activity.memo} />
                  <DetailRow label="Cost" value={formatCost(activity.cost, activity.currency)} />
                  {activity.image ? (
                    <div className="grid gap-2">
                      <div className="text-muted-foreground">Image</div>
                      <img
                        src={activity.image}
                        alt={activity.name || "Activity image"}
                        className="max-h-72 w-full rounded-xl border object-cover"
                      />
                    </div>
                  ) : null}
                </div>
              </section>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function DetailRow({ label, value }: { label: string; value?: string | number | null }) {
  if (value == null || value === "") {
    return null;
  }

  return (
    <div className="grid gap-1">
      <div className="text-muted-foreground">{label}</div>
      <div className="wrap-break-word">{value}</div>
    </div>
  );
}

function formatCost(cost?: number | null, currency?: string | null) {
  if (cost == null) {
    return null;
  }

  if (currency) {
    return `${cost} ${currency}`;
  }

  return String(cost);
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
