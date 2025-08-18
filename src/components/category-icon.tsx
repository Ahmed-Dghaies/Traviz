import {
  MapPin,
  Camera,
  Utensils,
  ShoppingBag,
  Music,
  Bed,
  Car,
  Bus,
  Train,
  Plane,
  Ship,
  Bike,
  BikeIcon as Motorcycle,
  Footprints,
  Circle,
} from "lucide-react";

export function CategoryIcon({ category, className }: { category: string; className?: string }) {
  switch (category) {
    case "sightseeing":
      return <MapPin className={className} />;
    case "entertainment":
      return <Music className={className} />;
    case "experience":
      return <Camera className={className} />;
    case "food":
      return <Utensils className={className} />;
    case "lodging":
      return <Bed className={className} />;
    case "shopping":
      return <ShoppingBag className={className} />;
    case "walk":
      return <Footprints className={className} />;
    case "car":
      return <Car className={className} />;
    case "bus":
      return <Bus className={className} />;
    case "train":
      return <Train className={className} />;
    case "airplane":
      return <Plane className={className} />;
    case "ship":
      return <Ship className={className} />;
    case "motorcycle":
      return <Motorcycle className={className} />;
    case "bicycle":
      return <Bike className={className} />;
    default:
      return <Circle className={className} />;
  }
}
