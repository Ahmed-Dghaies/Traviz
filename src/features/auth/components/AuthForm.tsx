import { useState } from "react";

import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import SignIn from "./SignIn";
import SignUp from "./SignUp";

export function AuthForm() {
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome to Traviz</CardTitle>
          <CardDescription>Your personal travel planning companion</CardDescription>
        </CardHeader>
        <CardContent>
          {message && (
            <Alert
              className={`mb-4 ${
                message.type === "error"
                  ? "border-red-200 bg-red-50"
                  : "border-green-200 bg-green-50"
              }`}
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription
                className={message.type === "error" ? "text-red-800" : "text-green-800"}
              >
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-4">
              <SignIn setMessage={setMessage} />
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <SignUp setMessage={setMessage} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
