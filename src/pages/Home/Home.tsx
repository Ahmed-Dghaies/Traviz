import { useMemo, useState } from "react";

import { skipToken } from "@reduxjs/toolkit/query";
import { Plus, Search, SortAsc } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/features/auth/components/AuthProvider";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { UserMenu } from "@/features/auth/components/UserMenu";
import NewTripDialog from "@/features/home/components/NewTripDialog";
import TripCard from "@/features/home/components/TripCard";
import { useGetTripsQuery } from "@/lib/supabase/tripsApi";

function HomePage() {
  const { user } = useAuth();
  const { data: trips } = useGetTripsQuery(user?.id ?? skipToken);
  const [seg, setSeg] = useState<"upcoming" | "past">("upcoming");
  const [sort, setSort] = useState<"date" | "name">("date");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const now = new Date();
    // Filter trips by current user

    const bySection = (trips ?? []).filter((t) => {
      const end = new Date(t.endDate);
      return seg === "upcoming" ? end >= now : end < now;
    });
    const byQuery = q.trim()
      ? bySection.filter((t) => t.title.toLowerCase().includes(q.trim().toLowerCase()))
      : bySection;
    const sorted = [...byQuery].sort((a, b) => {
      if (sort === "name") return a.title.localeCompare(b.title);
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    });
    return sorted;
  }, [trips, seg, q, sort]);

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-4 pb-24">
        <header className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Traviz</h1>
          <div className="flex items-center gap-2">
            <UserMenu />
          </div>
        </header>

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
            <SelectTrigger className="w-35">
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
                trigger={
                  <Button className="bg-teal-600 hover:bg-teal-500 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Create trip
                  </Button>
                }
              />
            </CardFooter>
          </Card>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}

        <div className="fixed bottom-5 right-4">
          <NewTripDialog
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
    </main>
  );
}

export default function Page() {
  return (
    <ProtectedRoute>
      <HomePage />
    </ProtectedRoute>
  );
}
