import type React from "react";
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
import { useAuth } from "../auth/components/AuthProvider";
import { useAddTripMutation } from "@/lib/supabase/tripsApi";
import type { Trip } from "@/types/trips";
import TripForm from "../TripForm";

const NewTripDialog = ({
  trigger,
  disabled,
}: {
  trigger?: React.ReactNode;
  disabled?: boolean;
}) => {
  const [addTrip] = useAddTripMutation();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const onSubmit = async (data: Omit<Trip, "id">) => {
    try {
      await addTrip({
        ...data,
        countries: data.countries,
        userId: user?.id,
      });
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
