export interface Trip {
  id: string;
  userId?: string;
  description?: string;
  countries: string[];
  startDate: string;
  endDate: string;
  people: number;
  thumbnail?: string | null;
  checklist?: ChecklistItem[];
  memo?: string;
}

export interface Memo {
  id: string;
  tripId: string;
  memo: string;
}

export interface ChecklistItem {
  id: string;
  tripId: string;
  text: string;
  completed: boolean;
}

export interface Activity {
  id: string;
  tripId: string;
  userId: string;
  date: string;
  name: string;
  category?: string;
  startTime?: string;
  endTime?: string;
  address?: string;
  url?: string;
  memo?: string;
  cost?: number;
  currency?: string;
  image?: string;
  timezone?: string;
  order: number;
}

export interface Document {
  id: string;
  tripId: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
  size: number;
}

export interface Plan {
  id: string;
  name: "Free" | "Premium" | "Traveler";
  description: string;
  price: number;
  features: string[];
}
