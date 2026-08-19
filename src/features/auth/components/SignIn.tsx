import { useState } from "react";

import { Loader2, Lock, Mail } from "lucide-react";

import { createSupabaseClient } from "@/lib/supabase/client";
import { TextField } from "@/components/FormFields/FormTextField";
import { Button } from "@/components/ui/button";

const SignIn = ({
  setMessage,
}: {
  setMessage: React.Dispatch<
    React.SetStateAction<{ type: "success" | "error"; text: string } | null>
  >;
}) => {
  const [loading, setLoading] = useState(false);
  const [supabase] = useState(() => createSupabaseClient());
  const [signInForm, setSignInForm] = useState({
    email: "",
    password: "",
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: signInForm.email,
      password: signInForm.password,
    });

    if (error) {
      setMessage({ type: "error", text: error.message });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSignIn} className="space-y-4 relative">
      <TextField
        label="Email"
        name="email"
        type="email"
        placeholder="Enter your email"
        value={signInForm.email}
        handleChange={(value) => setSignInForm({ ...signInForm, email: value })}
        icon={
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        }
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        placeholder="Enter your password"
        value={signInForm.password}
        handleChange={(value) => setSignInForm({ ...signInForm, password: value })}
        icon={
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        }
      />
      <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-500" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Sign In
      </Button>
    </form>
  );
};

export default SignIn;
