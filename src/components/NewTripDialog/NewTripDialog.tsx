import { useState } from "react";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAddTripMutation } from "@/lib/supabase/tripsApi";

import TripForm from "../TripForm";

import type { TripDetails } from "@/types/trips";
import type React from "react";

const NewTripDialog = ({
  trigger,
  disabled,
}: {
  trigger?: React.ReactNode;
  disabled?: boolean;
}) => {
  const [addTrip] = useAddTripMutation();
  const [open, setOpen] = useState(false);

  const onSubmit = async (data: TripDetails) => {
    try {
      await addTrip(data);
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button disabled={disabled}>
            <Plus className="mr-2 h-4 w-4" />
            Create trip
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>New Trip</DialogTitle>
        </DialogHeader>
        <TripForm onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
};

export default NewTripDialog;
