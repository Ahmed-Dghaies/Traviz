import { BookOpen, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router";

export function BottomNav({ active }: { active: "itineraries" | "store" }) {
  return (
    <nav
      aria-label="Bottom Navigation"
      className="fixed bottom-0 inset-x-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="max-w-xl mx-auto grid grid-cols-2">
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
        <Link
          to="/store"
          className={cn(
            "flex flex-col items-center justify-center py-2 text-sm",
            active === "store" ? "text-teal-500" : "text-muted-foreground"
          )}
        >
          <ShoppingCart className="h-5 w-5 mb-0.5" />
          Store
        </Link>
      </div>
    </nav>
  );
}
