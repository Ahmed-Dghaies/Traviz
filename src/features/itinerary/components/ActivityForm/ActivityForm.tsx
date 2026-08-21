import { useEffect, useMemo, useState } from "react";

import { skipToken } from "@reduxjs/toolkit/query";
import { Check, RotateCcw } from "lucide-react";
import { FormProvider } from "react-hook-form";

import { CategoryIcon } from "@/components/category-icon";
import { DatePicker } from "@/components/date-picker";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/features/auth/components/AuthProvider";
import {
  useAddActivityMutation,
  useDeleteActivityMutation,
  useGetActivitiesQuery,
  useUpdateActivityMutation,
} from "@/lib/supabase/tripsApi";
import { cn } from "@/lib/utils";
import { CATEGORY_PALETTE } from "@/types/categories";

import { createActivityDefaults, useActivityForm } from "./useActivityForm";

import type { ActivitySchemaTypeIn, ActivitySchemaTypeOut } from "./schema";
import type { Activity } from "@/types/trips";
import type React from "react";

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
  onOpenChange?: (open: boolean) => void;
}) {
  const { data: activities } = useGetActivitiesQuery(tripId ?? skipToken);
  const [addActivity] = useAddActivityMutation();
  const [updateActivity] = useUpdateActivityMutation();
  const [deleteActivity] = useDeleteActivityMutation();
  const { user } = useAuth();
  const isEdit = Boolean(activityId);
  const activity = useMemo(
    () => activities?.find((item) => item.id === activityId),
    [activities, activityId],
  );
  const [localOpen, setLocalOpen] = useState(false);
  const controlled = typeof open === "boolean";
  const isOpen = controlled ? open : localOpen;
  const setOpen = controlled && onOpenChange ? onOpenChange : setLocalOpen;
  const formDate = defaultDate ?? toYmd(new Date());
  const { methods } = useActivityForm(createActivityDefaults(formDate));
  const {
    formState: { isValid },
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
  } = methods;

  useEffect(() => {
    reset(activity ? activityToFormValues(activity) : createActivityDefaults(formDate));
  }, [activity, formDate, reset]);

  const onSubmit = async (data: ActivitySchemaTypeOut) => {
    if (isEdit && activity) {
      await updateActivity({
        id: activity.id,
        updates: toActivityUpdates(data, user?.id, activity.tripId),
      });
    } else if (tripId) {
      await addActivity({
        ...toActivityUpdates(data, user?.id ?? "", tripId),
        tripId,
        userId: user?.id ?? "",
      });
    }
    setOpen(false);
  };

  const handleImageChange = async (file?: File) => {
    if (!file) return;
    setValue("image", await readFileAsDataUrl(file), { shouldValidate: true });
  };

  const selectedCategory = watch("category");
  const selectedDate = watch("date");
  const startTime = watch("startTime") ?? "";
  const endTime = watch("endTime") ?? "";

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      {triggerLabel && (
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            {triggerLabel}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-[95vw] overflow-hidden p-0">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-card px-4 py-3">
              <button
                type="button"
                className="text-sm text-muted-foreground"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
              <div className="font-semibold">{isEdit ? "Edit schedule" : "Create schedule"}</div>
              <button
                type="button"
                onClick={() => reset(createActivityDefaults(formDate))}
                className="inline-flex items-center gap-1 text-sm text-teal-500"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
            </div>

            <ScrollArea>
              <div className="grid max-h-[80vh] gap-4 px-4 py-4">
                <section className="rounded-2xl border bg-card p-4">
                  <div className="mb-2 text-sm text-muted-foreground">Schedule</div>
                  <div className="grid gap-3">
                    <Field label="Title">
                      <Input placeholder="Schedule title" {...register("title")} />
                    </Field>

                    <DatePicker
                      label="Date"
                      value={fromYmd(selectedDate)}
                      onChange={(date) => setValue("date", toYmd(date), { shouldValidate: true })}
                    />

                    <Field label="Hours">
                      <div className="grid grid-cols-2 gap-2">
                        <TimeSelect
                          ariaLabel="Start hour"
                          placeholder="Start time"
                          value={startTime}
                          onValueChange={(value) =>
                            setValue("startTime", value, { shouldValidate: true })
                          }
                        />
                        <TimeSelect
                          ariaLabel="End hour"
                          placeholder="End time"
                          value={endTime}
                          onValueChange={(value) =>
                            setValue("endTime", value, { shouldValidate: true })
                          }
                        />
                      </div>
                    </Field>
                  </div>
                </section>

                <section className="rounded-2xl border bg-card p-4">
                  <div className="mb-3 text-sm text-muted-foreground">Schedule icon</div>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {CATEGORY_OPTIONS.map((category) => {
                      const selected = selectedCategory === category.id;
                      return (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() =>
                            setValue("category", category.id, { shouldValidate: true })
                          }
                          className={cn(
                            "flex min-w-00 flex-col items-center justify-center rounded-xl border p-2.5 text-xs",
                            selected ? "border-teal-500 ring-2 ring-teal-500/30" : "border-border",
                          )}
                          aria-pressed={selected}
                        >
                          <div className={cn("rounded-full p-2", CATEGORY_PALETTE[category.id])}>
                            <CategoryIcon category={category.id} className="h-5 w-5" />
                          </div>
                          <div className="mt-1 w-full truncate text-center leading-tight">
                            {category.label}
                          </div>
                          {selected && <Check className="mt-1 h-4 w-4 text-teal-500" />}
                        </button>
                      );
                    })}
                  </div>
                </section>

                <section className="rounded-2xl border bg-card p-4">
                  <div className="mb-2 text-sm text-muted-foreground">Info</div>
                  <div className="grid gap-3">
                    <Field label="Address">
                      <Input placeholder="Address" {...register("address")} />
                    </Field>
                    <Field label="Reference URL">
                      <Input placeholder="https://example.com" {...register("url")} />
                    </Field>
                    <Field label="Image">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(event) => handleImageChange(event.target.files?.[0])}
                      />
                    </Field>
                    <Field label="Memo / Notes">
                      <Textarea rows={3} {...register("memo")} />
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Cost">
                        <Input type="number" placeholder="0.00" {...register("cost")} />
                      </Field>
                      <Field label="Currency">
                        <Input placeholder="USD" {...register("currency")} />
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
                    type="button"
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
                  type="submit"
                  disabled={!isValid}
                  className="bg-teal-600 text-white hover:bg-teal-500"
                >
                  {isEdit ? "Update" : "Create"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

function activityToFormValues(activity: Activity): ActivitySchemaTypeIn {
  return {
    title: activity.name,
    date: activity.date,
    startTime: activity.startTime ?? "",
    endTime: activity.endTime ?? "",
    category: activity.category ?? "none",
    address: activity.address ?? "",
    url: activity.url ?? "",
    memo: activity.memo ?? "",
    cost: activity.cost != null ? String(activity.cost) : "",
    currency: activity.currency ?? "USD",
    image: activity.image ?? "",
  };
}

function toActivityUpdates(
  data: ActivitySchemaTypeOut,
  userId: string | undefined,
  tripId: string,
) {
  return {
    date: data.date,
    name: data.title.trim(),
    category: data.category,
    startTime: data.startTime || undefined,
    endTime: data.endTime || null,
    address: data.address || undefined,
    url: data.url || undefined,
    memo: data.memo || undefined,
    cost: data.cost ? Number(data.cost) : undefined,
    currency: data.currency || undefined,
    image: data.image || undefined,
    userId,
    tripId,
  };
}

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error ?? new Error("Unable to read image file."));
    reader.readAsDataURL(file);
  });

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <div className="text-sm text-muted-foreground">{label}</div>
      {children}
    </div>
  );
}

function toYmd(date: Date) {
  const zeroPad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${zeroPad(date.getMonth() + 1)}-${zeroPad(date.getDate())}`;
}

function fromYmd(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function TimeSelect({
  ariaLabel,
  placeholder,
  value,
  onValueChange,
}: {
  ariaLabel: string;
  placeholder: string;
  value: string;
  onValueChange: (value: string) => void;
}) {
  return (
    <Select value={value || undefined} onValueChange={onValueChange}>
      <SelectTrigger className="w-full" aria-label={ariaLabel}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {TIME_OPTIONS.map((time) => (
          <SelectItem key={time} value={time}>
            {time}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

const TIME_OPTIONS = Array.from({ length: 24 * 4 }, (_, index) => {
  const hours = Math.floor(index / 4);
  const minutes = (index % 4) * 15;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
});
