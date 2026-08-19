import React from "react";


import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { Control, Path, FieldValues } from "react-hook-form";

interface TextFieldProps extends React.ComponentProps<"input"> {
  label?: string;
  handleChange?: (value: string) => void;
  handleBlur?: () => void;
  icon?: React.ReactNode;
}

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ value, label, handleChange, handleBlur, icon, ...props }, ref) => {
    return (
      <>
        {label && <Label>{label}</Label>}
        <div className="relative">
          {icon ?? null}
          <Input
            ref={ref}
            aria-label={label}
            autoComplete="off"
            className={icon ? "pl-10" : ""}
            value={value || ""}
            onChange={(e) => handleChange?.(e.target.value)}
            onBlur={handleBlur}
            {...props}
          />
        </div>
      </>
    );
  }
);

interface FormTextFieldProps<T extends FieldValues, TT extends FieldValues>
  extends Omit<TextFieldProps, "value" | "onChange"> {
   
  control?: Control<T, unknown, TT extends T ? TT : any>;
  name: Path<T>;
}

const FormTextField = <T extends FieldValues, TT extends FieldValues>({
  control,
  name,
  label,
  ...props
}: FormTextFieldProps<T, TT>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <TextField {...props} label={label} value={field.value} handleChange={field.onChange} />
          </FormControl>
          <FormDescription />
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export { TextField, FormTextField };
