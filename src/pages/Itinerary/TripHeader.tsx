import { CalendarDays, MapPin, Users } from "lucide-react";

import thumbnailPlaceholder from "@/assets/thumbnail-placeholder.jpg";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { formatDateRange } from "./utils";

import type { Trip } from "@/types/trips";

const TripHeader = ({ trip }: { trip: Trip }) => {
  return (
    <Card className="overflow-hidden mb-3">
      <div className="relative h-40 w-full">
        <img
          src={trip.thumbnail || thumbnailPlaceholder}
          alt={`Thumbnail for ${trip.title}`}
          className="object-cover h-full w-full"
        />
      </div>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span className="truncate flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{trip.title}</span>
          </span>
          <span className="text-sm text-muted-foreground inline-flex items-center gap-1">
            <CalendarDays className="h-4 w-4" />
            {formatDateRange(trip.startDate, trip.endDate)}
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
  );
};

export default TripHeader;
