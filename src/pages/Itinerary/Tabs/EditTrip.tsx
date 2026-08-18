import TripForm from "@/components/TripForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { useUpdateTripMutation } from "@/lib/supabase/tripsApi";
import type { Trip, TripDetails } from "@/types/trips";

const EditTrip = ({ trip }: { trip: Trip }) => {
  const [updateTrip] = useUpdateTripMutation();

  const handleUpdates = async (updates: TripDetails) => {
    await updateTrip({ id: trip.id, updates });
  };
  return (
    <TabsContent value="details" className="mt-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Trip Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <TripForm onSubmit={handleUpdates} defaultValues={trip} />
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default EditTrip;
