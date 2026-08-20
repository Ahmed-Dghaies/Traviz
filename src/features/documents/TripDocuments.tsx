import { TabsContent } from "@/components/ui/tabs";

import { DocumentsTab } from "./components/DocumentsTab";

import type { Trip } from "@/types/trips";

const TripDocuments = ({ trip }: { trip: Trip }) => {
  return (
    <TabsContent value="documents" className="mt-3">
      <DocumentsTab tripId={trip.id} />
    </TabsContent>
  );
};

export default TripDocuments;
