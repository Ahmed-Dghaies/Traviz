import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useTripsStore } from "@/components/trips-store";

export function MemoTab({ tripId }: { tripId: string }) {
  const { memos, setMemo } = useTripsStore();
  const [text, setText] = useState(memos[tripId] || "");

  useEffect(() => {
    const t = setTimeout(() => setMemo(tripId, text), 400);
    return () => clearTimeout(t);
  }, [text, tripId, setMemo]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Memo</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Freeform notes: travel tips, packing ideas, etc."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={12}
        />
      </CardContent>
    </Card>
  );
}
