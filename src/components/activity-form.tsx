import type React from "react";

import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useTripsStore } from "@/components/trips-store";
import { CategoryIcon } from "@/components/category-icon";
import { CalendarDays, RotateCcw, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORY_PALETTE } from "@/types/categories";
import { ScrollArea } from "./ui/scroll-area";
import { useAuth } from "./auth/auth-provider";

const CATEGORY_OPTIONS = [
  { id: "none", label: "None" },
  { id: "sightseeing", label: "Historic site" },
  { id: "entertainment", label: "Entertainment" },
  { id: "experience", label: "Experience" },
  { id: "food", label: "Food" },
  { id: "lodging", label: "Lodging" },
  { id: "shopping", label: "Shopping" },
  { id: "walk", label: "Walk" },
  { id: "car", label: "Car" },
  { id: "bus", label: "Bus" },
  { id: "train", label: "Train" },
  { id: "airplane", label: "Airplane" },
  { id: "ship", label: "Ship" },
  { id: "motorcycle", label: "Motorcycle" },
  { id: "bicycle", label: "Bicycle" },
] as const;

export function ActivityForm({
  triggerLabel,
  tripId,
  defaultDate,
  activityId,
  open,
  onOpenChange,
}: {
  triggerLabel?: string;
  tripId?: string;
  defaultDate?: string;
  activityId?: string;
  open?: boolean;
  onOpenChange?: (o: boolean) => void;
}) {
  const { activities, addActivity, updateActivity, deleteActivity } = useTripsStore();
  const { user } = useAuth();
  const isEdit = !!activityId;
  const activity = useMemo(
    () => activities.find((a) => a.id === activityId),
    [activities, activityId]
  );

  const [localOpen, setLocalOpen] = useState(false);
  const controlled = typeof open === "boolean";
  const isOpen = controlled ? open : localOpen;
  const setOpen = controlled && onOpenChange ? onOpenChange : setLocalOpen;

  const [form, setForm] = useState({
    title: "",
    date: defaultDate || toYmd(new Date()),
    startTime: "",
    endTime: "",
    timezone: "UTC+0",
    category: "none",
    address: "",
    url: "",
    memo: "",
    cost: "",
    currency: "USD",
    image: "",
  });

  useEffect(() => {
    if (activity) {
      setForm({
        title: activity.name,
        date: activity.date,
        startTime: activity.startTime || "",
        endTime: activity.endTime || "",
        timezone: activity.timezone || "UTC+0",
        category: activity.category || "none",
        address: activity.address || "",
        url: activity.url || "",
        memo: activity.memo || "",
        cost: activity.cost != null ? String(activity.cost) : "",
        currency: activity.currency || "USD",
        image: activity.image || "",
      });
    } else if (defaultDate) {
      setForm((f) => ({ ...f, date: defaultDate }));
    }
  }, [activity, defaultDate]);

  const canSave = (isEdit || tripId) && form.title.trim().length > 0 && form.date;

  function resetForm() {
    setForm({
      title: "",
      date: defaultDate || toYmd(new Date()),
      startTime: "",
      endTime: "",
      timezone: "UTC+0",
      category: "none",
      address: "",
      url: "",
      memo: "",
      cost: "",
      currency: "USD",
      image: "",
    });
  }

  async function onImage(file?: File) {
    if (!file) return;
    const reader = new FileReader();
    const dataUrl: string = await new Promise((res, rej) => {
      reader.onload = () => res(String(reader.result));
      reader.onerror = rej;
      reader.readAsDataURL(file);
    });
    setForm((f) => ({ ...f, image: dataUrl }));
  }

  const onSave = () => {
    if (!canSave) return;
    if (isEdit && activity) {
      updateActivity(activity.id, {
        date: form.date,
        name: form.title.trim(),
        category: form.category,
        startTime: form.startTime || undefined,
        endTime: form.endTime || undefined,
        address: form.address || undefined,
        url: form.url || undefined,
        memo: form.memo || undefined,
        cost: form.cost ? Number(form.cost) : undefined,
        currency: form.currency || undefined,
        image: form.image || undefined,
        timezone: form.timezone,
        userId: user?.id,
        tripId: activity.tripId,
      });
    } else if (tripId) {
      addActivity({
        tripId,
        date: form.date,
        name: form.title.trim(),
        category: form.category,
        startTime: form.startTime || undefined,
        endTime: form.endTime || undefined,
        address: form.address || undefined,
        url: form.url || undefined,
        memo: form.memo || undefined,
        cost: form.cost ? Number(form.cost) : undefined,
        currency: form.currency || undefined,
        image: form.image || undefined,
        timezone: form.timezone,
        userId: user?.id ?? "",
      });
    }
    setOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      {triggerLabel && (
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            {triggerLabel}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-lg p-0 overflow-hidden">
        <div className="sticky top-0 z-10 bg-card border-b px-4 py-3 flex items-center justify-between">
          <button className="text-muted-foreground text-sm" onClick={() => setOpen(false)}>
            Close
          </button>
          <div className="font-semibold">Create schedule</div>
          <button
            onClick={resetForm}
            className="inline-flex items-center gap-1 text-sm text-teal-500"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>

        <ScrollArea>
          <div className="px-4 py-4 grid gap-4 max-h-[80vh]">
            <section className="rounded-2xl border bg-card p-4">
              <div className="text-sm text-muted-foreground mb-2">Schedule</div>
              <div className="grid gap-3">
                <Field label="Title">
                  <Input
                    placeholder="Schedule Title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </Field>

                <Field
                  label="Start at"
                  trailing={<CalendarDays className="h-4 w-4 text-teal-500" />}
                >
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                    />
                    <Input
                      type="time"
                      value={form.startTime}
                      onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                    />
                  </div>
                </Field>

                <Field label="Finish at">
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="date"
                      placeholder="Unset"
                      value={form.endTime ? form.date : ""}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                    />
                    <Input
                      type="time"
                      placeholder="Unset"
                      value={form.endTime}
                      onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                    />
                  </div>
                </Field>

                <Field label="Time zone">
                  <Select
                    value={form.timezone}
                    onValueChange={(v) => setForm({ ...form, timezone: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                      {[
                        "UTC-12",
                        "UTC-11",
                        "UTC-10",
                        "UTC-9",
                        "UTC-8",
                        "UTC-7",
                        "UTC-6",
                        "UTC-5",
                        "UTC-4",
                        "UTC-3",
                        "UTC-2",
                        "UTC-1",
                        "UTC+0",
                        "UTC+1",
                        "UTC+2",
                        "UTC+3",
                        "UTC+4",
                        "UTC+5",
                        "UTC+6",
                        "UTC+7",
                        "UTC+8",
                        "UTC+9",
                        "UTC+10",
                        "UTC+11",
                        "UTC+12",
                      ].map((tz) => (
                        <SelectItem key={tz} value={tz}>
                          {tz}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </section>

            <section className="rounded-2xl border bg-card p-4">
              <div className="text-sm text-muted-foreground mb-3">Schedule icon</div>
              <div className="grid grid-cols-4 gap-2">
                {CATEGORY_OPTIONS.map((c) => {
                  const selected = form.category === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setForm({ ...form, category: c.id })}
                      className={cn(
                        "flex flex-col items-center justify-center rounded-xl border p-2.5 text-xs",
                        selected ? "border-teal-500 ring-2 ring-teal-500/30" : "border-border"
                      )}
                      aria-pressed={selected}
                    >
                      <div className={cn("rounded-full p-2", CATEGORY_PALETTE[c.id])}>
                        <CategoryIcon category={c.id} className="h-5 w-5" />
                      </div>
                      <div className="mt-1 text-center leading-tight">{c.label}</div>
                      {selected && <Check className="h-4 w-4 text-teal-500 mt-1" />}
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="rounded-2xl border bg-card p-4">
              <div className="text-sm text-muted-foreground mb-2">Info</div>
              <div className="grid gap-3">
                <Field label="Address">
                  <Input
                    placeholder="Address"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                  />
                </Field>
                <Field label="Reference URL">
                  <Input
                    placeholder="https://example.com"
                    value={form.url}
                    onChange={(e) => setForm({ ...form, url: e.target.value })}
                  />
                </Field>
                <Field label="Image">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onImage(e.target.files?.[0])}
                  />
                </Field>
                <Field label="Memo / Notes">
                  <Textarea
                    rows={3}
                    value={form.memo}
                    onChange={(e) => setForm({ ...form, memo: e.target.value })}
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Cost">
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={form.cost}
                      onChange={(e) => setForm({ ...form, cost: e.target.value })}
                    />
                  </Field>
                  <Field label="Currency">
                    <Input
                      placeholder="USD"
                      value={form.currency}
                      onChange={(e) => setForm({ ...form, currency: e.target.value })}
                    />
                  </Field>
                </div>
              </div>
            </section>
          </div>
        </ScrollArea>

        <DialogFooter className="px-4 pb-4">
          <div className="ml-auto flex items-center gap-2">
            {isEdit && activity && (
              <Button
                variant="destructive"
                onClick={() => {
                  if (confirm("Delete this activity?")) {
                    deleteActivity(activity.id);
                    setOpen(false);
                  }
                }}
              >
                Delete
              </Button>
            )}
            <Button
              onClick={onSave}
              disabled={!canSave}
              className="bg-teal-600 hover:bg-teal-500 text-white"
            >
              Create
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  trailing,
  children,
}: {
  label: string;
  trailing?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <div className="text-sm text-muted-foreground flex items-center justify-between">
        <span>{label}</span>
        {trailing}
      </div>
      {children}
    </div>
  );
}

function toYmd(d: Date) {
  const z = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
}
