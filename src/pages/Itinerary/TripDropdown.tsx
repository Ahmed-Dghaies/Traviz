import { useState } from "react";

import { Copy, MoreHorizontal, Share2, Trash2 } from "lucide-react";
import { useNavigate } from "react-router";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
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
          className="text-red-600 hover:text-red-600!"
          onClick={() => setDeleteDialogOpen(true)}
        >
          <Trash2 className="h-4 w-4 mr-2 text-red-600 hover:text-red-600!" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this trip?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The trip and its data will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await deleteTrip(trip.id);
                setDeleteDialogOpen(false);
                navigate("/");
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DropdownMenu>
  );
};

export default TripDropdown;
