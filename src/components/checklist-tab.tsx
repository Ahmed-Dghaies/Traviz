import { useMemo, useState } from "react";
import { Check, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  useAddChecklistItemMutation,
  useDeleteChecklistItemMutation,
  useGetChecklistQuery,
  useToggleChecklistItemMutation,
} from "@/lib/supabase/tripsApi";

export function ChecklistTab({ tripId }: { tripId: string }) {
  const { data: checklist } = useGetChecklistQuery(tripId);
  const [addChecklistItem] = useAddChecklistItemMutation();
  const [deleteChecklistItem] = useDeleteChecklistItemMutation();
  const [toggleChecklistItem] = useToggleChecklistItemMutation();
  const items = useMemo(
    () => (checklist ?? []).filter((c) => c.tripId === tripId),
    [checklist, tripId]
  );
  const done = items.filter((i) => i.completed).length;
  const [text, setText] = useState("");
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Checklist</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Add an item (e.g., Pack passport)"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && text.trim()) {
                addChecklistItem({ tripId, text: text.trim() });
                setText("");
              }
            }}
          />
          <Button
            onClick={() => {
              if (!text.trim()) return;
              addChecklistItem({ tripId, text: text.trim() });
              setText("");
            }}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>

        <div className="text-sm">
          {done}/{items.length} items completed
        </div>
        <Progress value={items.length ? (done / items.length) * 100 : 0} />

        <div className="grid gap-2">
          {items.length === 0 ? (
            <div className="text-sm text-muted-foreground">No items yet.</div>
          ) : (
            items.map((i) => (
              <div key={i.id} className="flex items-center gap-2">
                <button
                  aria-label={i.completed ? "Mark as incomplete" : "Mark as done"}
                  onClick={() => toggleChecklistItem({ id: i.id, completed: !i.completed })}
                  className="h-5 w-5 border rounded-sm flex items-center justify-center"
                >
                  {i.completed && <Check className="h-4 w-4" />}
                </button>
                <div
                  className={i.completed ? "line-through text-muted-foreground flex-1" : "flex-1"}
                >
                  {i.text}
                </div>
                <Button size="icon" variant="ghost" onClick={() => deleteChecklistItem(i.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
