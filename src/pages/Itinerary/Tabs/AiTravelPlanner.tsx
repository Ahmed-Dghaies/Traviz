import { AIPlannerTab } from "@/components/ai-planner-tab";
import { TabsContent } from "@/components/ui/tabs";

import type { Trip } from "@/types/trips";

const AiTravelPlanner = ({ trip }: { trip: Trip }) => {
  return (
    <TabsContent value="ai-planner" className="mt-3">
      <AIPlannerTab tripId={trip.id} />
    </TabsContent>
  );
};

export default AiTravelPlanner;
