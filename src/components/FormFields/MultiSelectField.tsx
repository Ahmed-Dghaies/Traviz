import { isArray } from "lodash";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import MultipleSelector, {
  type Option,
  type MultipleSelectorProps,
} from "@/components/ui/multi-select";
import type { Control, FieldError, FieldValues, Path } from "react-hook-form";

interface MultiSelectProps<T extends FieldValues, TT extends FieldValues>
  extends MultipleSelectorProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control?: Control<T, unknown, TT extends T ? TT : any>;
  label?: string;
  name: Path<T>;
  placeholder?: string;
  disabled?: boolean;
  mapValueToOption: (item: string) => Option;
  mapOptionsToValue: (options: Option[]) => string[];
}

const MultiSelectField = <T extends FieldValues, TT extends FieldValues>({
  control,
  label,
  name,
  placeholder,
  disabled,
  options,
  mapValueToOption,
  mapOptionsToValue,
  creatable,
  ...props
}: MultiSelectProps<T, TT>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        console.log(
          "fieldState",
          fieldState,
          field,
          options,
          options || (field.value ? field.value.map(mapValueToOption) : [])
        );
        return (
          <FormItem>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <MultipleSelector
                {...props}
                value={field.value ? field.value.map(mapValueToOption) : []}
                onChange={(value) => {
                  field.onChange(mapOptionsToValue(value));
                }}
                creatable={creatable}
                disabled={disabled}
                defaultOptions={options || (field.value ? field.value.map(mapValueToOption) : [])}
                placeholder={placeholder}
                label={label}
              />
            </FormControl>
            <MultiSelectErrorMessage error={fieldState.error} />
          </FormItem>
        );
      }}
    />
  );
};

const MultiSelectErrorMessage = ({ error }: { error?: FieldError }) => {
  if (!error) return null;
  const errorMessage =
    isArray(error) && error.length ? error.filter(Boolean)[0]?.message : error.message ?? "";
  return errorMessage && <FormMessage>{errorMessage}</FormMessage>;
};

export default MultiSelectField;
