import { FormProvider } from "react-hook-form";
import { useNewTripForm } from "../NewTripDialog/useNewTripForm";
import { FormDatePickerField, FormTextField } from "../FormFields";
import MultiSelectField from "../FormFields/MultiSelectField";
import { countryOptions } from "@/assets/countries";
import FormFileInputField from "../FormFields/FormFileInputField";
import { DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import type { Trip } from "@/types/trips";

const TripForm = ({ onSubmit }: { onSubmit: (data: Omit<Trip, "id"> | Trip) => void }) => {
  const { methods } = useNewTripForm();
  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = methods;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" aria-label="New Trip Form">
        <div className="grid gap-4">
          <FormTextField control={control} name="title" label="Title" placeholder="Paris, France" />

          <MultiSelectField
            control={control}
            name="countries"
            label="Countries"
            placeholder="Select countries..."
            options={countryOptions}
            creatable={false}
            mapValueToOption={(item: string) => ({ label: item, value: item })}
            mapOptionsToValue={(options) => options.map((option) => option.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormDatePickerField control={control} name="startDate" label="Start Date" />
            <FormDatePickerField control={control} name="endDate" label="End Date" />
          </div>

          <FormTextField control={control} name="people" label="Number of people" type="number" />

          <FormFileInputField control={control} name="thumbnail" label="Thumbnail" />
        </div>

        <DialogFooter className="flex justify-end space-x-2 pt-4">
          <Button type="submit" disabled={!isValid}>
            Create
          </Button>
        </DialogFooter>
      </form>
    </FormProvider>
  );
};

export default TripForm;
