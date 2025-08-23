import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import type { Control, FieldValues, Path } from "react-hook-form";
import { Input } from "../ui/input";

type FormFileInputFieldProps<T extends FieldValues, TT extends FieldValues> = {
  control: Control<T, unknown, TT extends T ? TT : T>;
  name: Path<T>;
  label?: string;
};

const FormFileInputField = <T extends FieldValues, TT extends FieldValues>({
  control,
  name,
  label,
}: FormFileInputFieldProps<T, TT>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                field.onChange(file);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormFileInputField;
