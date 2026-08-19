import { useState } from "react";

import { Loader2, Lock, Mail, User } from "lucide-react";
import { FormProvider } from "react-hook-form";

import { createSupabaseClient } from "@/lib/supabase/client";

import { useSignUpForm } from "../hooks/useSignInForm";

import type { SignUpSchemaOut } from "../schemas/SignUpSchema";
import { FormTextField } from "@/components/FormFields";
import { Button } from "@/components/ui/button";

const SignUp = ({
  setMessage,
}: {
  setMessage: React.Dispatch<
    React.SetStateAction<{ type: "success" | "error"; text: string } | null>
  >;
}) => {
  const [supabase] = useState(() => createSupabaseClient());
  const [loading, setLoading] = useState(false);

  const { methods } = useSignUpForm();

  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = methods;

  const handleSignUp = async (data: SignUpSchemaOut) => {
    setLoading(true);
    setMessage(null);

    const { data: signUpData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
        },
      },
    });

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      methods.reset();
      setMessage({
        type: "success",
        text: signUpData.session
          ? "Your account has been created. You are now signed in."
          : "Your account has been created. Check your email to confirm your address.",
      });
    }
    setLoading(false);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleSignUp)} className="space-y-4">
        <FormTextField
          control={control}
          name="fullName"
          icon={
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          }
          label="Full name"
          placeholder="Name ..."
        />
        <FormTextField
          control={control}
          name="email"
          icon={
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          }
          label="Email"
          placeholder="Email ..."
        />
        <FormTextField
          control={control}
          name="passwordWithConfirmation.password"
          type="password"
          icon={
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          }
          label="Password"
          placeholder="************"
        />
        <FormTextField
          control={control}
          name="passwordWithConfirmation.confirmPassword"
          type="password"
          icon={
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          }
          label="Confirm Password"
          placeholder="************"
        />

        <Button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-500"
          disabled={loading || !isValid}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sign Up
        </Button>
      </form>
    </FormProvider>
  );
};

export default SignUp;
