import type React from "react";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTripsStore } from "@/components/trips-store";
import { useAuth } from "./auth/auth-provider";

export function NewTripDialog({
  trigger,
  disabled,
}: {
  trigger?: React.ReactNode;
  disabled?: boolean;
}) {
  const { addTrip } = useTripsStore();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    people: 1,
    thumbnail: "",
  });

  const canSave =
    form.destination.trim().length > 0 &&
    form.startDate &&
    form.endDate &&
    new Date(form.endDate) >= new Date(form.startDate);

  async function onFileChange(file?: File) {
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    setForm((f) => ({ ...f, thumbnail: dataUrl }));
  }

  const onCreate = () => {
    if (!canSave) return;
    addTrip({
      destination: form.destination.trim(),
      startDate: new Date(form.startDate).toISOString(),
      endDate: new Date(form.endDate).toISOString(),
      people: form.people,
      thumbnail: form.thumbnail === "" ? null : form.thumbnail,
      userId: user?.id,
    });
    setOpen(false);
    setForm({
      destination: "",
      startDate: "",
      endDate: "",
      people: 1,
      thumbnail: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button disabled={disabled}>
            <Plus className="h-4 w-4 mr-2" />
            Create trip
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Trip</DialogTitle>
        </DialogHeader>

        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <Label>Destination</Label>
            <Input
              placeholder="Paris, France"
              value={form.destination}
              onChange={(e) => setForm({ ...form, destination: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              />
            </div>
            <div className="grid gap-1.5">
              <Label>End Date</Label>
              <Input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label>Number of People</Label>
            <Input
              type="number"
              min={1}
              value={form.people}
              onChange={(e) =>
                setForm({ ...form, people: Math.max(1, Number(e.target.value || 1)) })
              }
            />
          </div>
          <div className="grid gap-1.5">
            <Label>Thumbnail</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => onFileChange(e.target.files?.[0])}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={onCreate} disabled={!canSave}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

async function fileToDataUrl(file: File) {
  const reader = new FileReader();
  return new Promise<string>((resolve, reject) => {
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
