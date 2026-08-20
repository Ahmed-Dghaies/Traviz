import { useMemo } from "react";

import { Country } from "country-state-city";
import { CalendarDays, MapPin, Users } from "lucide-react";

import thumbnailPlaceholder from "@/assets/thumbnail-placeholder.jpg";
import { Card } from "@/components/ui/card";

import type { Trip } from "@/types/trips";

const TripHeader = ({ trip }: { trip: Trip }) => {
  const countryFlags = useMemo(
    () =>
      trip.countries
        .map((country) => {
          const isoCode = Country.getAllCountries().find((item) => item.name === country)?.isoCode;
          return isoCode ? isoToFlagEmoji(isoCode) : country;
        })
        .filter(Boolean),
    [trip.countries],
  );

  return (
    <Card className="mb-3 overflow-hidden gap-0 p-0">
      <div className="relative h-40 w-full">
        <img
          src={trip.thumbnail || thumbnailPlaceholder}
          alt={`Thumbnail for ${trip.title}`}
          className="object-cover h-full w-full"
        />
      </div>
      <div className="space-y-2 px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0 flex items-center gap-2 font-semibold text-lg">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="truncate">{trip.title}</span>
          </div>
          <div className="shrink-0 inline-flex items-center gap-1 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            {formatTripDateRange(trip.startDate, trip.endDate)}
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {trip.people} {trip.people === 1 ? "person" : "people"}
          </span>
          <span
            className="inline-flex items-center gap-1 text-base leading-none"
            aria-label="Countries to visit"
          >
            {countryFlags.map((flag, index) => (
              <span key={`${flag}-${index}`}>{flag}</span>
            ))}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default TripHeader;

function formatTripDateRange(startDate: string, endDate: string) {
  const currentYear = new Date().getFullYear();
  return `${formatTripDate(startDate, currentYear)} – ${formatTripDate(endDate, currentYear)}`;
}

function formatTripDate(dateIso: string, currentYear: number) {
  const date = new Date(dateIso);
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
  };

  if (date.getFullYear() !== currentYear) {
    options.year = "numeric";
  }

  return new Intl.DateTimeFormat(undefined, options).format(date);
}

function isoToFlagEmoji(isoCode: string) {
  return isoCode
    .toUpperCase()
    .split("")
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join("");
}
