import { FormProvider } from "react-hook-form";
import { useNewTripForm } from "../NewTripDialog/useNewTripForm";
import { FormDatePickerField, FormTextField } from "../FormFields";
import MultiSelectField from "../FormFields/MultiSelectField";
import { Country, State } from "country-state-city";
import FormFileInputField from "../FormFields/FormFileInputField";
import { DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import type { TripSchemaTypeIn, TripSchemaTypeOut } from "../NewTripDialog/schema";
import { useMemo } from "react";
import type { Option } from "../ui/multi-select";

const TripForm = ({
  onSubmit,
  defaultValues,
}: {
  onSubmit: (data: TripSchemaTypeOut) => void;
  defaultValues?: TripSchemaTypeIn;
}) => {
  const { methods } = useNewTripForm(defaultValues);
  const {
    handleSubmit,
    control,
    formState: { isValid },
    watch,
  } = methods;

  const isModification = !!defaultValues;

  const countries = watch("countries");

  const countryOptions = useMemo(
    () =>
      Country.getAllCountries().map((c) => ({
        label: c.name,
        value: c.name,
        code: c.isoCode,
      })),
    []
  );

  const citiesOptions = useMemo(() => {
    if (!countries || countries.length === 0) return [];

    const allCities: Option[] = countries.flatMap((country) => {
      const countryCode = countryOptions.find((c) => c.value === country)?.code;
      if (!countryCode) return [];
      const countryCities =
        State.getStatesOfCountry(countryCode)?.map((c) => ({
          label: c.name,
          value: c.name,
          group: country,
        })) ?? [];
      //console.log("countryCities", countryCities);
      return countryCities;
    });
    //console.log("allCities", allCities);
    return allCities;
  }, [countries, countryOptions]);

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
            groupBy="group"
          />

          <MultiSelectField
            key={`cities-${citiesOptions.length}-${countries?.join(",")}`}
            control={control}
            name="cities"
            label="Cities"
            placeholder="Select cities..."
            options={citiesOptions}
            creatable={true}
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
            {isModification ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </form>
    </FormProvider>
  );
};

export default TripForm;
