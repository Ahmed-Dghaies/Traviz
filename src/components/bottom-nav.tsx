import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router";

export function BottomNav({ active }: { active: "itineraries" }) {
  return (
    <nav
      aria-label="Bottom Navigation"
      className="fixed bottom-0 inset-x-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="max-w-2xl mx-auto grid grid-cols-1">
        <Link
          to="/"
          className={cn(
            "flex flex-col items-center justify-center py-2 text-sm",
            active === "itineraries" ? "text-teal-500" : "text-muted-foreground"
          )}
        >
          <BookOpen className="h-5 w-5 mb-0.5" />
          Itinerary
        </Link>
      </div>
    </nav>
  );
}
