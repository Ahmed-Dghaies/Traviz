import { CheckSquare, FileText } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Checklists from "./Checklists";
import Memo from "./Memo";

import type { Trip } from "@/types/trips";

const TripMemoAndCheckList = ({ trip }: { trip: Trip }) => {
  return (
    <TabsContent value="notes" className="mt-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notes & Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="checklist" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="checklist" className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4" />
                Checklist
              </TabsTrigger>
              <TabsTrigger value="memo" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Notes
              </TabsTrigger>
            </TabsList>

            <Checklists trip={trip} />
            <Memo trip={trip} />
          </Tabs>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default TripMemoAndCheckList;
