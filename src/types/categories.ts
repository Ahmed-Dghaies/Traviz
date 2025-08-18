export const CATEGORY_PALETTE = {
  none: "bg-gray-100 text-gray-600",
  sightseeing: "bg-blue-100 text-blue-600",
  entertainment: "bg-purple-100 text-purple-600",
  experience: "bg-green-100 text-green-600",
  food: "bg-orange-100 text-orange-600",
  lodging: "bg-indigo-100 text-indigo-600",
  shopping: "bg-pink-100 text-pink-600",
  walk: "bg-emerald-100 text-emerald-600",
  car: "bg-red-100 text-red-600",
  bus: "bg-yellow-100 text-yellow-600",
  train: "bg-blue-100 text-blue-600",
  airplane: "bg-sky-100 text-sky-600",
  ship: "bg-cyan-100 text-cyan-600",
  motorcycle: "bg-orange-100 text-orange-600",
  bicycle: "bg-lime-100 text-lime-600",
} as const;

export type categoryPaletteKeys = keyof typeof CATEGORY_PALETTE;
