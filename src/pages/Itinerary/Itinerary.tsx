import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, FileText, Clock8, StickyNote, Edit2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate, useParams } from "react-router";

import { ProtectedRoute } from "@/components/auth/components/ProtectedRoute";
import { useAuth } from "@/components/auth/components/AuthProvider";
import { useGetTripsQuery } from "@/lib/supabase/tripsApi";
import { skipToken } from "@reduxjs/toolkit/query";
import TripDropdown from "./TripDropdown";
import TripHeader from "./TripHeader";
import { formatDateRange } from "./utils";
import EditTrip from "./Tabs/EditTrip";
import TripItinerary from "./Tabs/TripItinerary";
import TripMemoAndCheckList from "./Tabs/TripMemoAndChecklist";
import AiTravelPlanner from "./Tabs/AiTravelPlanner";
import TripDocuments from "./Tabs/TripDocuments";

function ItineraryPage() {
  const params = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: trips } = useGetTripsQuery(user?.id ?? skipToken);
  const [tab, setTab] = useState("schedule");

  const trip = useMemo(() => (trips ?? []).find((t) => t.id == params.id), [trips, params.id]);

  useEffect(() => {
    if (!trip) return;
    document.title = `${trip.title} – Itinerary`;
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

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-xl mx-auto p-4 pb-24">
        <div className="flex items-center gap-2 mb-2">
          <Button size="icon" variant="ghost" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
          <div className="flex-1">
            <div className="text-center font-semibold">{trip.title}</div>
            <div className="text-center text-xs text-muted-foreground">
              {formatDateRange(trip.startDate, trip.endDate)}
            </div>
          </div>
          <TripDropdown trip={trip} />
        </div>

        <TripHeader trip={trip} />

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

          <EditTrip trip={trip} />
          <TripItinerary trip={trip} />
          <AiTravelPlanner trip={trip} />
          <TripMemoAndCheckList trip={trip} />
          <TripDocuments trip={trip} />
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
