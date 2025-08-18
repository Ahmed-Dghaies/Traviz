import { ArrowLeft, Check, Crown, Zap } from "lucide-react";
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
import { useTripsStore } from "@/components/trips-store";
import { Link } from "react-router";
import { ProtectedRoute } from "@/components/auth/protected-route";

function StorePage() {
  const { plan, trips } = useTripsStore();

  const features = {
    free: [
      "Up to 3 trips",
      "Basic itinerary planning",
      "Photo uploads",
      "Notes and checklists",
      "Document storage (50MB)",
    ],
    premium: [
      "Unlimited trips",
      "Offline mode",
      "AI travel planner",
      "Advanced collaboration",
      "Priority support",
      "Document storage (5GB)",
      "Export to PDF",
      "Custom themes",
    ],
  };

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

        <div className="space-y-4">
          {/* Current Plan */}
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
                  <div className="font-medium capitalize">{plan.tier} Plan</div>
                  <div className="text-sm text-muted-foreground">
                    {plan.tier === "free"
                      ? `${trips.length}/${plan.tripLimit} trips used`
                      : "Unlimited trips"}
                  </div>
                </div>
                <Badge variant={plan.tier === "premium" ? "default" : "secondary"}>
                  {plan.tier === "premium" ? "Premium" : "Free"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Free Plan */}
          <Card className={plan.tier === "free" ? "ring-2 ring-teal-500" : ""}>
            <CardHeader>
              <CardTitle className="text-base">Free Plan</CardTitle>
              <CardDescription>Perfect for getting started</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-4">$0</div>
              <ul className="space-y-2">
                {features.free.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {plan.tier === "free" ? (
                <Button disabled className="w-full">
                  Current Plan
                </Button>
              ) : (
                <Button variant="outline" className="w-full bg-transparent">
                  Downgrade
                </Button>
              )}
            </CardFooter>
          </Card>

          {/* Premium Plan */}
          <Card className={plan.tier === "premium" ? "ring-2 ring-teal-500" : ""}>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500" />
                Premium Plan
              </CardTitle>
              <CardDescription>Unlock all features and unlimited trips</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-4">
                $9.99<span className="text-sm font-normal text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-2">
                {features.premium.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {plan.tier === "premium" ? (
                <Button disabled className="w-full">
                  Current Plan
                </Button>
              ) : (
                <Button className="w-full bg-teal-600 hover:bg-teal-500">Upgrade to Premium</Button>
              )}
            </CardFooter>
          </Card>

          <div className="text-center text-sm text-muted-foreground">
            <p>All plans include secure cloud sync and cross-device access.</p>
            <p className="mt-1">Cancel anytime. No hidden fees.</p>
          </div>
        </div>
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
