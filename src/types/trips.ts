export interface TripDetails {
  title: string;
  description?: string;
  countries: string[];
  cities: string[];
  startDate: string;
  endDate: string;
  people: number;
  thumbnail: string | null;
}

export interface Trip extends TripDetails {
  id: string;
  userId: string;
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
  endTime?: string | null;
  address?: string;
  url?: string;
  memo?: string;
  cost?: number;
  currency?: string;
  image?: string;
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
