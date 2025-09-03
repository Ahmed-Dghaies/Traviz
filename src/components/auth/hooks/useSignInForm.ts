import { useForm } from "react-hook-form";
import { arktypeResolver } from "@hookform/resolvers/arktype";
import type { SignUpSchemaIn, SignUpSchemaOut } from "../schemas/SignUpSchema";
import SignUpSchema from "../schemas/SignUpSchema";
import { useEffect, useMemo } from "react";
import { doesPasswordFitRequirements } from "../utils";

export const useSignUpForm = (defaultValues?: SignUpSchemaIn) => {
  const methods = useForm<SignUpSchemaIn, unknown, SignUpSchemaOut>({
    resolver: arktypeResolver(SignUpSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: defaultValues || {
      fullName: "",
      email: "",
      passwordWithConfirmation: {
        password: "",
        confirmPassword: "",
      },
    },
  });

  const { watch, trigger } = methods;

  const password = watch("passwordWithConfirmation.password");
  const confirmPassword = watch("passwordWithConfirmation.confirmPassword");

  const passwordCriteria = useMemo(() => doesPasswordFitRequirements(password), [password]);

  useEffect(() => {
    trigger("passwordWithConfirmation.confirmPassword");
  }, [confirmPassword, trigger]);

  useEffect(() => {
    if (confirmPassword?.length > 0) {
      trigger("passwordWithConfirmation.confirmPassword");
    }
  }, [password, trigger, confirmPassword]);

  return {
    methods,
    passwordCriteria,
  };
};
