import { Users } from "lucide-react";
import { Link } from "react-router";

import thumbnailPlaceholder from "@/assets/thumbnail-placeholder.jpg";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

import type { Trip } from "@/types/trips";

interface TripCardProps {
  trip: Trip;
}

const TripCard = ({ trip }: TripCardProps) => {
  return (
    <Link key={trip.id} to={`/itinerary/${trip.id}`} className="block h-full">
      <Card className="overflow-hidden gap-0 py-0 transition-shadow hover:shadow-md">
        <div className="relative aspect-square w-full">
          <img
            src={trip.thumbnail || thumbnailPlaceholder}
            alt={`Thumbnail for ${trip.title}`}
            className="object-cover w-full h-full"
          />
          <Badge
            variant="secondary"
            className="absolute bottom-2 left-2 inline-flex items-center gap-1 bg-background/90 shadow-sm"
          >
            <Users className="h-3.5 w-3.5" />
            {trip.people}
          </Badge>
        </div>
        <CardHeader className="px-4 py-3">
          <CardTitle className="flex text-lg w-full justify-center">{trip.title}</CardTitle>
          <CardDescription className="text-xs">
            {dateRange(trip.startDate, trip.endDate)}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
};

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

export default TripCard;
