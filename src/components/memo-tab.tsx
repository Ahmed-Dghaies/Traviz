import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useGetMemosQuery } from "@/lib/supabase/tripsApi";

export function MemoTab({ tripId }: { tripId: string }) {
  const { data: memos } = useGetMemosQuery(tripId);

  const [text, setText] = useState(memos?.find((m) => m.id === tripId)?.memo || "");

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
