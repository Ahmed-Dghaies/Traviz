import { useState } from "react";

import { skipToken } from "@reduxjs/toolkit/query";
import { CheckSquare, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { TabsContent } from "@/components/ui/tabs";
import {
  useAddChecklistItemMutation,
  useDeleteChecklistItemMutation,
  useGetChecklistQuery,
  useToggleChecklistItemMutation,
} from "@/lib/supabase/tripsApi";

import type { Trip } from "@/types/trips";


const Checklists = ({ trip }: { trip: Trip }) => {
  const { data: checklist } = useGetChecklistQuery(trip.id ?? skipToken);
  const [addCheckListItem] = useAddChecklistItemMutation();
  const [toggleCheckListItem] = useToggleChecklistItemMutation();
  const [deleteChecklistItem] = useDeleteChecklistItemMutation();

  const [newItem, setNewItem] = useState("");

  if (!trip || !checklist) return null;

  const completedItems = checklist.filter((item) => item.completed).length;
  const progress = checklist.length > 0 ? (completedItems / checklist.length) * 100 : 0;

  const handleAddChecklistItem = () => {
    if (!newItem.trim()) return;

    addCheckListItem({ tripId: trip.id, text: newItem.trim() });
    setNewItem("");
  };

  const handleToggle = (itemId: string) => {
    toggleCheckListItem({
      id: itemId,
      completed: !checklist.find((item) => item.id === itemId)?.completed,
    });
  };

  const handleChecklistItemDelete = (itemId: string) => {
    deleteChecklistItem(itemId);
  };

  return (
    <TabsContent value="checklist" className="space-y-4">
      {checklist.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {completedItems} of {checklist.length} completed
            </span>
            <span className="text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      <div className="flex gap-2">
        <Input
          placeholder="Add checklist item..."
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddChecklistItem()}
        />
        <Button onClick={handleAddChecklistItem} size="sm">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        {checklist.map((item) => (
          <div key={item.id} className="flex items-center gap-2 p-2 rounded-lg border">
            <Checkbox
              checked={item.completed}
              onCheckedChange={() => handleToggle(item.id)}
              className="cursor-pointer"
            />
            <span
              className={`flex-1 ${item.completed ? "line-through text-muted-foreground" : ""}`}
            >
              {item.text}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleChecklistItemDelete(item.id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {checklist.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <CheckSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No checklist items yet</p>
          <p className="text-sm">Add items to keep track of your travel preparations</p>
        </div>
      )}
    </TabsContent>
  );
};

export default Checklists;
