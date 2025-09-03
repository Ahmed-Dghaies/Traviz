import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Users,
  MoreHorizontal,
  FileText,
  Clock8,
  StickyNote,
  Share2,
  Copy,
  Trash2,
  Edit2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScheduleTab } from "@/components/schedule-tab";
import { NotesTab } from "@/components/notes-tab";
import { DocumentsTab } from "@/components/documents-tab";
import { AIPlannerTab } from "@/components/ai-planner-tab";
import { Link, useNavigate, useParams } from "react-router";

import thumbnailPlaceholder from "@/assets/thumbnail-placeholder.jpg";
import { ProtectedRoute } from "@/components/auth/components/ProtectedRoute";
import { useAuth } from "@/components/auth/components/AuthProvider";
import {
  useDeleteTripMutation,
  useGetTripsQuery,
  useUpdateTripMutation,
} from "@/lib/supabase/tripsApi";
import { skipToken } from "@reduxjs/toolkit/query";

function ItineraryPage() {
  const params = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: trips } = useGetTripsQuery(user?.id ?? skipToken);
  const [updateTrip] = useUpdateTripMutation();
  const [deleteTrip] = useDeleteTripMutation();

  const [tab, setTab] = useState("schedule");

  const trip = useMemo(() => (trips ?? []).find((t) => t.id == params.id), [trips, params.id]);

  useEffect(() => {
    if (!trip) return;
    document.title = `${trip.destination} – Itinerary`;
  }, [trip]);

  if (!trip) {
    return (
      <main className="min-h-screen max-w-xl mx-auto p-4">
        <div className="flex items-center gap-2 mb-4">
          <Button size="icon" variant="ghost" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Trip not found</h1>
        </div>
        <Button asChild>
          <Link to="/">Back to Trips</Link>
        </Button>
      </main>
    );
  }

  const onShare = async () => {
    const url = `/shared-trip/?tripId=${trip.id}`;
    await navigator.clipboard.writeText(url);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-xl mx-auto p-4 pb-24">
        <div className="flex items-center gap-2 mb-2">
          <Button size="icon" variant="ghost" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
          <div className="flex-1">
            <div className="text-center font-semibold">{trip.destination}</div>
            <div className="text-center text-xs text-muted-foreground">
              {fmtRange(trip.startDate, trip.endDate)}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  const copyId = crypto.randomUUID();
                  window.dispatchEvent(
                    new CustomEvent("trip-copy", { detail: { id: trip.id, copyId } })
                  );
                }}
              >
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => {
                  if (confirm("Delete this trip?")) {
                    deleteTrip(trip.id);
                    navigate("/");
                  }
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Card className="overflow-hidden mb-3">
          <div className="relative h-40 w-full">
            <img
              src={trip.thumbnail || thumbnailPlaceholder}
              alt={`Thumbnail for ${trip.destination}`}
              className="object-cover h-full w-full"
            />
          </div>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              <span className="truncate flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="truncate">{trip.destination}</span>
              </span>
              <span className="text-sm text-muted-foreground inline-flex items-center gap-1">
                <CalendarDays className="h-4 w-4" />
                {fmtRange(trip.startDate, trip.endDate)}
              </span>
            </CardTitle>
            <CardDescription className="flex items-center gap-4 text-xs">
              <span className="inline-flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {trip.people} {trip.people === 1 ? "person" : "people"}
              </span>
            </CardDescription>
          </CardHeader>
        </Card>

        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="grid grid-cols-5 w-full sticky top-0 z-10">
            <TabsTrigger value="details">
              <Edit2 className="h-4 w-4" />
              <span className="sr-only">Details</span>
            </TabsTrigger>
            <TabsTrigger value="schedule">
              <Clock8 className="h-4 w-4 text-teal-500" />
              <span className="sr-only">Schedule</span>
            </TabsTrigger>
            <TabsTrigger value="ai-planner">
              <Sparkles className="h-4 w-4" />
              <span className="sr-only">AI Planner</span>
            </TabsTrigger>
            <TabsTrigger value="notes">
              <StickyNote className="h-4 w-4" />
              <span className="sr-only">Notes</span>
            </TabsTrigger>
            <TabsTrigger value="documents">
              <FileText className="h-4 w-4" />
              <span className="sr-only">Documents</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Trip Details</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                <div className="grid gap-1.5">
                  <label className="text-sm font-medium">Destination</label>
                  <Input
                    value={trip.destination}
                    onChange={(e) =>
                      updateTrip({ id: trip.id, updates: { destination: e.target.value } })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <label className="text-sm font-medium">Start Date</label>
                    <Input
                      type="date"
                      value={toInputDate(trip.startDate)}
                      onChange={(e) =>
                        updateTrip({
                          id: trip.id,
                          updates: { startDate: new Date(e.target.value).toISOString() },
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <label className="text-sm font-medium">End Date</label>
                    <Input
                      type="date"
                      value={toInputDate(trip.endDate)}
                      onChange={(e) =>
                        updateTrip({
                          id: trip.id,
                          updates: { endDate: new Date(e.target.value).toISOString() },
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid gap-1.5">
                  <label className="text-sm font-medium">People</label>
                  <Input
                    type="number"
                    min={1}
                    value={trip.people}
                    onChange={(e) =>
                      updateTrip({
                        id: trip.id,
                        updates: { people: Math.max(1, Number(e.target.value || 1)) },
                      })
                    }
                  />
                </div>
                <div className="grid gap-1.5">
                  <label className="text-sm font-medium">Notes</label>
                  <Textarea
                    rows={4}
                    placeholder="Trip notes or description"
                    value={trip.notes || ""}
                    onChange={(e) =>
                      updateTrip({ id: trip.id, updates: { notes: e.target.value } })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="mt-3">
            <ScheduleTab tripId={trip.id} startDate={trip.startDate} endDate={trip.endDate} />
          </TabsContent>

          <TabsContent value="ai-planner" className="mt-3">
            <AIPlannerTab tripId={trip.id} />
          </TabsContent>

          <TabsContent value="notes" className="mt-3">
            <NotesTab tripId={trip.id} />
          </TabsContent>

          <TabsContent value="documents" className="mt-3">
            <DocumentsTab tripId={trip.id} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

const Itinerary = () => {
  return (
    <ProtectedRoute>
      <ItineraryPage />
    </ProtectedRoute>
  );
};

export default Itinerary;

function fmtRange(s: string, e: string) {
  const fmt = new Intl.DateTimeFormat(undefined, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  return `${fmt.format(new Date(s))} – ${fmt.format(new Date(e))}`;
}
function toInputDate(iso: string) {
  const d = new Date(iso);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}
