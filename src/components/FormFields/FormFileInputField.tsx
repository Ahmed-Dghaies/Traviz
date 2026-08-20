import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import type { Control, FieldValues, Path } from "react-hook-form";

type FormFileInputFieldProps<T extends FieldValues, TT extends FieldValues> = {
  control: Control<T, unknown, TT extends T ? TT : T>;
  name: Path<T>;
  label?: string;
};

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error ?? new Error("Unable to read image file."));
    reader.readAsDataURL(file);
  });

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
              onChange={async (e) => {
                const file = e.target.files?.[0] ?? null;
                field.onChange(file ? await readFileAsDataUrl(file) : null);
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
