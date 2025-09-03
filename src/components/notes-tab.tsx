import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, CheckSquare, FileText } from "lucide-react";
import { useAuth } from "./auth/components/AuthProvider";
import { useGetTripsQuery, useUpdateTripMutation } from "@/lib/supabase/tripsApi";
import { skipToken } from "@reduxjs/toolkit/query";

export function NotesTab({ tripId }: { tripId: string }) {
  const { user } = useAuth();
  const { data: trips } = useGetTripsQuery(user?.id ?? skipToken);
  const [updateTrip] = useUpdateTripMutation();
  const trip = useMemo(() => (trips ?? []).find((t) => t.id === tripId), [trips, tripId]);
  const [newItem, setNewItem] = useState("");

  if (!trip) return null;

  const checklist = trip.checklist || [];
  const memo = trip.memo || "";
  const completedItems = checklist.filter((item) => item.completed).length;
  const progress = checklist.length > 0 ? (completedItems / checklist.length) * 100 : 0;

  const addChecklistItem = () => {
    if (!newItem.trim()) return;

    const updatedChecklist = [
      ...checklist,
      {
        id: Date.now().toString(),
        tripId,
        text: newItem.trim(),
        completed: false,
      },
    ];

    updateTrip({ id: tripId, updates: { checklist: updatedChecklist } });
    setNewItem("");
  };

  const toggleChecklistItem = (itemId: string) => {
    const updatedChecklist = checklist.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    updateTrip({ id: tripId, updates: { checklist: updatedChecklist } });
  };

  const deleteChecklistItem = (itemId: string) => {
    const updatedChecklist = checklist.filter((item) => item.id !== itemId);
    updateTrip({ id: tripId, updates: { checklist: updatedChecklist } });
  };

  const updateMemo = (newMemo: string) => {
    updateTrip({ id: tripId, updates: { memo: newMemo } });
  };

  return (
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
                onKeyDown={(e) => e.key === "Enter" && addChecklistItem()}
              />
              <Button onClick={addChecklistItem} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              {checklist.map((item) => (
                <div key={item.id} className="flex items-center gap-2 p-2 rounded-lg border">
                  <Checkbox
                    checked={item.completed}
                    onCheckedChange={() => toggleChecklistItem(item.id)}
                  />
                  <span
                    className={`flex-1 ${
                      item.completed ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {item.text}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteChecklistItem(item.id)}
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

          <TabsContent value="memo" className="space-y-4">
            <Textarea
              placeholder="Add your travel notes, tips, or reminders here..."
              value={memo}
              onChange={(e) => updateMemo(e.target.value)}
              rows={10}
              className="resize-none"
            />
            {memo.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No notes yet</p>
                <p className="text-sm">
                  Use this space for travel tips, important information, or memories
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
