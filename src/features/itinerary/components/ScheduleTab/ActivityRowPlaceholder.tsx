import { Skeleton } from "@/components/ui/skeleton";

export function ActivityRowPlaceholder() {
  return (
    <div className="flex w-full min-w-0 items-center gap-2 overflow-hidden rounded-xl border bg-muted/20 p-2.5">
      <Skeleton className="h-8 w-8 shrink-0 rounded-full" />

      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-16 shrink-0" />
        </div>
        <Skeleton className="h-3 w-3/4" />
      </div>

      <Skeleton className="h-4 w-4 shrink-0 rounded-full" />
    </div>
  );
}