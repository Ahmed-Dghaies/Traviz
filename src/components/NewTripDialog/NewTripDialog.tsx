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
import { useAuth } from "../auth/auth-provider";
import { useAddTripMutation } from "@/lib/supabase/tripsApi";
import { FormProvider } from "react-hook-form";
import type { Trip } from "@/types/trips";
import { useNewTripForm } from "./useNewTripForm";
import { FormTextField } from "../FormFields/FormTextField";
import { FormDatePickerField } from "../FormFields";
import FormFileInputField from "../FormFields/FormFileInputField";

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

  const { methods } = useNewTripForm();
  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors, isValid },
  } = methods;

  const onSubmit = async (data: Omit<Trip, "id">) => {
    try {
      await addTrip({
        ...data,
        userId: user?.id,
      });
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

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" aria-label="New Trip Form">
            <div className="grid gap-4">
              <FormTextField
                control={control}
                name="destination"
                label="Destination"
                placeholder="Paris, France"
              />

              <div className="grid grid-cols-2 gap-4">
                <FormDatePickerField control={control} name="startDate" label="Start Date" />
                <FormDatePickerField control={control} name="endDate" label="End Date" />
              </div>

              <FormTextField
                control={control}
                name="people"
                label="Number of people"
                type="number"
              />

              <FormFileInputField control={control} name="thumbnail" label="Thumbnail" />
            </div>

            <DialogFooter className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => console.log(errors, getValues())}
              >
                Log
              </Button>
              <Button type="submit" disabled={!isValid}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default NewTripDialog;
