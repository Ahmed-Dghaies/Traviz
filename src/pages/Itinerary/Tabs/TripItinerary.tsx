import { ScheduleTab } from "@/components/schedule-tab";
import { TabsContent } from "@/components/ui/tabs";
import type { Trip } from "@/types/trips";

const TripItinerary = ({ trip }: { trip: Trip }) => {
  return (
    <TabsContent value="schedule" className="mt-3">
      <ScheduleTab tripId={trip.id} startDate={trip.startDate} endDate={trip.endDate} />
    </TabsContent>
  );
};

export default TripItinerary;
