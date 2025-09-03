import { createSupabaseClient } from "@/lib/supabase/client";
import { useState } from "react";
import { Button } from "../../ui/button";
import { Loader2, Lock, Mail, User } from "lucide-react";
import { useGetPlansQuery } from "@/lib/supabase/tripsApi";
import { useSignUpForm } from "../hooks/useSignInForm";
import { FormTextField } from "../../FormFields";
import type { SignUpSchemaOut } from "../schemas/SignUpSchema";

const SignUp = ({
  setMessage,
}: {
  setMessage: React.Dispatch<
    React.SetStateAction<{ type: "success" | "error"; text: string } | null>
  >;
}) => {
  const [supabase] = useState(() => createSupabaseClient());
  const { data: plans } = useGetPlansQuery();
  const [loading, setLoading] = useState(false);

  const { methods } = useSignUpForm();

  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = methods;

  const freePlan = plans?.find((plan) => plan.name === "Free");

  const handleSignUp = async (data: SignUpSchemaOut) => {
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
          plan: freePlan?.id,
        },
      },
    });

    if (error) {
      setMessage({ type: "error", text: error.message });
    }
    setLoading(false);
  };

  return (
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
        icon={
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        }
        label="Password"
        placeholder="************"
      />
      <FormTextField
        control={control}
        name="passwordWithConfirmation.confirmPassword"
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
  );
};

export default SignUp;
