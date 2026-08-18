import { useMemo, useState } from "react";
import { Plus, Search, SortAsc, Users, ArrowRight } from "lucide-react";

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
import { ProtectedRoute } from "@/components/auth/components/ProtectedRoute";
import { UserMenu } from "@/components/auth/components/UserMenu";
import { useAuth } from "@/components/auth/components/AuthProvider";
import { Link } from "react-router";

import thumbnailPlaceholder from "@/assets/thumbnail-placeholder.jpg";
import { useGetTripsQuery } from "@/lib/supabase/tripsApi";
import { skipToken } from "@reduxjs/toolkit/query";
import NewTripDialog from "@/components/NewTripDialog";

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
            <SelectTrigger className="w-[140px]">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered.map((t) => (
              <Card key={t.id} className="overflow-hidden">
                <Link to={`/itinerary/${t.id}`} className="block">
                  <div className="relative h-40 w-full">
                    <img
                      src={t.thumbnail || thumbnailPlaceholder}
                      alt={`Thumbnail for ${t.title}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </Link>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{t.title}</CardTitle>
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
