import { Copy, MoreHorizontal, Share2, Trash2 } from "lucide-react";
import { useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteTripMutation } from "@/lib/supabase/tripsApi";

import type { Trip } from "@/types/trips";

interface TripDropdownProps {
  trip: Trip;
}

const TripDropdown = ({ trip }: TripDropdownProps) => {
  const navigate = useNavigate();
  const [deleteTrip] = useDeleteTripMutation();
  const onShare = async () => {
    const url = `/shared-trip/?tripId=${trip.id}`;
    await navigator.clipboard.writeText(url);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onShare}>
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            const copyId = crypto.randomUUID();
            window.dispatchEvent(new CustomEvent("trip-copy", { detail: { id: trip.id, copyId } }));
          }}
        >
          <Copy className="h-4 w-4 mr-2" />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-red-600"
          onClick={() => {
            if (confirm("Delete this trip?")) {
              deleteTrip(trip.id);
              navigate("/");
            }
          }}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TripDropdown;
