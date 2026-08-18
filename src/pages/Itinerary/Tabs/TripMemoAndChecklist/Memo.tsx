import { useEffect, useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useGetMemosQuery, useUpsertMemoMutation } from "@/lib/supabase/tripsApi";
import type { Trip } from "@/types/trips";
import { FileText } from "lucide-react";

const Memo = ({ trip }: { trip: Trip }) => {
  const { data: memos } = useGetMemosQuery(trip.id);
  const [upsertMemo] = useUpsertMemoMutation();
  const savedMemo = memos?.[0]?.memo ?? "";
  const [memo, setMemo] = useState(savedMemo);

  useEffect(() => {
    setMemo(savedMemo);
  }, [savedMemo]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (memo !== savedMemo) {
        upsertMemo({ tripId: trip.id, memo });
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [memo, savedMemo, trip.id, upsertMemo]);

  return (
    <TabsContent value="memo" className="space-y-4">
      <Textarea
        placeholder="Add your travel notes, tips, or reminders here..."
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
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
  );
};

export default Memo;
