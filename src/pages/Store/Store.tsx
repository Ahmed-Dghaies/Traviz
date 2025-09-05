import { ArrowLeft, Check, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BottomNav } from "@/components/bottom-nav";
import { Link } from "react-router";
import { ProtectedRoute } from "@/components/auth/components/ProtectedRoute";
import { useGetPlansQuery, useGetTripsQuery } from "@/lib/supabase/tripsApi";
import { useAuth } from "@/components/auth/components/AuthProvider";
import { useMemo } from "react";
import { skipToken } from "@reduxjs/toolkit/query";

function StorePage() {
  const { user } = useAuth();
  const { data: plans } = useGetPlansQuery();
  const { data: trips } = useGetTripsQuery(user?.id ?? skipToken);

  const currentPlan = useMemo(
    () => plans?.find((plan) => plan.id === user?.user_metadata?.plan),
    [user, plans]
  );

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-xl mx-auto p-4 pb-24">
        <header className="flex items-center gap-2 mb-6">
          <Button size="icon" variant="ghost" asChild>
            <Link to="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-xl font-semibold">Store</h1>
        </header>

        {plans && trips ? (
          <div className="space-y-4">
            {/* Current Plan */}
            {currentPlan && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Crown className="h-4 w-4 text-amber-500" />
                    Current Plan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium capitalize">{currentPlan.name} Plan</div>
                      <div className="text-sm text-muted-foreground">
                        {currentPlan.name === "Free"
                          ? `${trips.length}/2 trips used`
                          : "Unlimited trips"}
                      </div>
                    </div>
                    <Badge
                      variant={
                        currentPlan.name === "Premium" || currentPlan.name === "Traveler"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {currentPlan.name}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {plans.map((plan) => (
              <Card className={plan.name === "Free" ? "ring-2 ring-teal-500" : ""}>
                <CardHeader>
                  <CardTitle className="text-base">{plan.name} Plan</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-4">$0</div>
                  <ul className="space-y-2">
                    {plan.features.map((feature: string) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  {currentPlan?.name !== plan.name && (
                    <Button className="w-full bg-teal-600 hover:bg-teal-500">
                      Switch to {plan.name}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}

            <div className="text-center text-sm text-muted-foreground">
              <p>All plans include secure cloud sync and cross-device access.</p>
              <p className="mt-1">Cancel anytime. No hidden fees.</p>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-center text-sm text-muted-foreground">
              <p className="mt-1">Failed to fetch your plan, please try again.</p>
            </div>
          </div>
        )}
      </div>

      <BottomNav active="store" />
    </main>
  );
}

const Store = () => {
  return (
    <ProtectedRoute>
      <StorePage />
    </ProtectedRoute>
  );
};

export default Store;
