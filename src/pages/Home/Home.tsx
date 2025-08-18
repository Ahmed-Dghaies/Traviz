import { useEffect, useMemo, useState } from "react";
import { Plus, Search, SortAsc, Users, ArrowRight, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTripsStore } from "@/components/trips-store";
import { NewTripDialog } from "@/components/new-trip-dialog";
import { BottomNav } from "@/components/bottom-nav";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { UserMenu } from "@/components/auth/user-menu";
import { useAuth } from "@/components/auth/auth-provider";
import { Link } from "react-router";

import thumbnailPlaceholder from "@/assets/thumbnail-placeholder.jpg";

function HomePage() {
  const { user } = useAuth();
  const { trips, plan, setCurrentUser, loadTrips } = useTripsStore();
  const [seg, setSeg] = useState<"upcoming" | "past">("upcoming");
  const [sort, setSort] = useState<"date" | "name">("date");
  const [q, setQ] = useState("");

  useEffect(() => {
    if (user) {
      loadTrips(user.id);
      setCurrentUser(user.id);
    }
  }, [user, setCurrentUser, loadTrips]);

  const filtered = useMemo(() => {
    console.log("filtered", trips);
    const now = new Date();
    // Filter trips by current user

    const bySection = trips.filter((t) => {
      const end = new Date(t.endDate);
      return seg === "upcoming" ? end >= now : end < now;
    });
    const byQuery = q.trim()
      ? bySection.filter((t) =>
          [t.destination, t.notes ?? ""].join(" ").toLowerCase().includes(q.trim().toLowerCase())
        )
      : bySection;
    const sorted = [...byQuery].sort((a, b) => {
      if (sort === "name") return a.destination.localeCompare(b.destination);
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    });
    return sorted;
  }, [trips, seg, q, sort]);

  const userTripsCount = trips.filter((t) => t.userId === user?.id).length;
  const remaining = Math.max(0, (plan.tripLimit ?? Number.POSITIVE_INFINITY) - userTripsCount);
  const atLimit = plan.tier === "free" && remaining <= 0;

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-xl mx-auto p-4 pb-24">
        <header className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Traviz</h1>
          <div className="flex items-center gap-2">
            <Link to="/store" className="text-sm underline underline-offset-4">
              Store
            </Link>
            <UserMenu />
          </div>
        </header>

        {plan.tier === "free" && (
          <Alert className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Free Plan</AlertTitle>
            <AlertDescription>
              You can create up to {plan.tripLimit} trips. Remaining: {remaining}.{" "}
              <Link to="/store" className="underline underline-offset-4">
                Upgrade for unlimited trips and offline mode.
              </Link>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex items-center gap-2 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search destinations, notes, documents..."
              className="pl-9"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <Select value={sort} onValueChange={(v) => setSort(v as "date" | "name")}>
            <SelectTrigger className="w-[120px]">
              <SortAsc className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">By date</SelectItem>
              <SelectItem value="name">By name</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs value={seg} onValueChange={(v) => setSeg(v as "upcoming" | "past")} className="mb-3">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
        </Tabs>

        {filtered.length === 0 ? (
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="text-base">No trips here yet</CardTitle>
              <CardDescription>Create your first trip to get started.</CardDescription>
            </CardHeader>
            <CardFooter>
              <NewTripDialog
                disabled={atLimit}
                trigger={
                  <Button disabled={atLimit} className="bg-teal-600 hover:bg-teal-500 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Create trip
                  </Button>
                }
              />
              {atLimit && (
                <Button variant="outline" className="ml-2 bg-transparent" asChild>
                  <Link to="/store">Upgrade</Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered.map((t) => (
              <Card key={t.id} className="overflow-hidden">
                <Link to={`/itinerary/${t.id}`} className="block">
                  <div className="relative h-40 w-full">
                    <img
                      src={t.thumbnail || thumbnailPlaceholder}
                      alt={`Thumbnail for ${t.destination}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </Link>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{t.destination}</CardTitle>
                  <CardDescription className="text-xs">
                    {dateRange(t.startDate, t.endDate)}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="pt-2">
                  <Badge variant="secondary" className="mr-auto inline-flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {t.people}
                  </Badge>
                  <Button asChild size="sm" variant="ghost">
                    <Link to={`/itinerary/${t.id}`}>
                      Open
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <div className="fixed bottom-20 right-4">
          <NewTripDialog
            disabled={atLimit}
            trigger={
              <Button
                size="icon"
                className="h-14 w-14 rounded-full shadow-lg bg-teal-600 hover:bg-teal-500"
              >
                <Plus className="h-6 w-6" />
                <span className="sr-only">Create trip</span>
              </Button>
            }
          />
        </div>
      </div>

      <BottomNav active="itineraries" />
    </main>
  );
}

function dateRange(s: string, e: string) {
  const start = new Date(s);
  const end = new Date(e);
  const fmt = new Intl.DateTimeFormat(undefined, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  return `${fmt.format(start)} – ${fmt.format(end)}`;
}

export default function Page() {
  return (
    <ProtectedRoute>
      <HomePage />
    </ProtectedRoute>
  );
}
