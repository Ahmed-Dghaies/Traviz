import { createSupabaseClient, transformKeys } from "@/lib/supabase/client";
import { camelCase, snakeCase } from "lodash";
import { create } from "zustand";

export interface Trip {
  id: string;
  userId?: string;
  destination: string;
  startDate: string;
  endDate: string;
  people: number;
  thumbnail?: string | null;
  notes?: string;
  checklist?: ChecklistItem[];
  memo?: string;
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
}

export interface Plan {
  tier: "free" | "premium";
  tripLimit?: number;
}

interface TripsState {
  trips: Trip[];
  activities: Activity[];
  documents: Document[];
  checklist: ChecklistItem[];
  memos: Record<string, string>;
  plan: Plan;
  currentUserId: string | null;

  setCurrentUser: (userId: string | null) => void;
  loadTrips: (userId: string) => Promise<void>;
  addTrip: (trip: Omit<Trip, "id">) => Promise<string | null>;
  updateTrip: (id: string, updates: Partial<Trip>) => Promise<void>;
  deleteTrip: (id: string) => Promise<void>;

  addActivity: (activity: Omit<Activity, "id" | "order">) => Promise<void>;
  updateActivity: (id: string, updates: Partial<Activity>) => Promise<void>;
  loadActivities: (tripId: string) => Promise<void>;
  deleteActivity: (id: string) => Promise<void>;
  reorderActivities: (tripId: string, date: string, activityIds: string[]) => Promise<void>;

  addDocument: (document: Omit<Document, "id" | "uploadedAt">) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;

  addChecklistItem: (tripId: string, text: string) => Promise<void>;
  toggleChecklistItem: (id: string, completed: boolean) => Promise<void>;
  deleteChecklistItem: (id: string) => Promise<void>;

  setMemo: (tripId: string, memo: string) => Promise<void>;
  exportShareLink: (tripId: string) => string;
}

const supabase = createSupabaseClient();

export const useTripsStore = create<TripsState>((set, get) => ({
  trips: [],
  activities: [],
  documents: [],
  checklist: [],
  memos: {},
  plan: { tier: "free", tripLimit: 3 },
  currentUserId: null,

  setCurrentUser: (userId) => {
    set({ currentUserId: userId });
  },

  loadTrips: async (userId) => {
    const { data, error } = await supabase.from("trips").select("*").eq("user_id", userId);

    if (error) {
      console.error("Error loading trips", error);
      return;
    }

    const formattedTrips = transformKeys(data ?? [], camelCase) as Trip[];

    console.log("formattedTrips", formattedTrips);

    set({
      trips: formattedTrips,
    });
  },

  addTrip: async (trip) => {
    const tripToAdd = transformKeys(trip, snakeCase);
    const { data, error } = await supabase.from("trips").insert(tripToAdd).select().single();
    if (error) {
      console.error("Error adding trip", error);
      return null;
    }
    set((state) => ({ trips: [...state.trips, data] }));
    return data.id;
  },

  updateTrip: async (id, updates) => {
    const formattedUpdates = transformKeys(updates, snakeCase);
    const { data, error } = await supabase
      .from("trips")
      .update(formattedUpdates)
      .eq("id", id)
      .select()
      .single();
    if (error) {
      console.error("Error updating trip", error);
      return;
    }
    set((state) => ({
      trips: state.trips.map((t) => (t.id === id ? { ...t, ...data } : t)),
    }));
  },

  deleteTrip: async (id) => {
    const { error } = await supabase.from("trips").delete().eq("id", id);
    if (error) {
      console.error("Error deleting trip", error);
      return;
    }
    set((state) => ({
      trips: state.trips.filter((t) => t.id !== id),
      activities: state.activities.filter((a) => a.tripId !== id),
      documents: state.documents.filter((d) => d.tripId !== id),
      checklist: state.checklist.filter((c) => c.tripId !== id),
    }));
  },

  loadActivities: async (tripId) => {
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .eq("trip_id", tripId)
      .order("date", { ascending: true });
    if (error) {
      console.error("Error loading activities", error);
      return;
    }
    const formattedActivities = transformKeys(data ?? [], camelCase) as Activity[];
    set({ activities: formattedActivities });
  },

  addActivity: async (activity) => {
    const formattedActivity = transformKeys(activity, snakeCase);
    const existing = get().activities.filter(
      (a) => a.tripId === activity.tripId && a.date === activity.date
    );
    const order = existing.length;

    const { data, error } = await supabase
      .from("activities")
      .insert({ ...(formattedActivity as object), order })
      .select()
      .single();

    if (error) {
      console.error("Error adding activity", error);
      return;
    }
    set((state) => ({ activities: [...state.activities, data] }));
  },

  updateActivity: async (id, activity) => {
    const formattedActivity = transformKeys(activity, snakeCase);
    const { data, error } = await supabase
      .from("activities")
      .update(formattedActivity)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating activity", error);
      return;
    }
    set((state) => ({
      activities: state.activities.map((a) => (a.id === id ? { ...a, ...data } : a)),
    }));
  },

  deleteActivity: async (id) => {
    const { error } = await supabase.from("activities").delete().eq("id", id);
    if (error) {
      console.error("Error deleting activity", error);
      return;
    }
    set((state) => ({
      activities: state.activities.filter((a) => a.id !== id),
    }));
  },

  reorderActivities: async (tripId, date, activityIds) => {
    // reorder locally first
    set((state) => ({
      activities: state.activities.map((a) => {
        if (a.tripId === tripId && a.date === date) {
          const newOrder = activityIds.indexOf(a.id);
          return newOrder >= 0 ? { ...a, order: newOrder } : a;
        }
        return a;
      }),
    }));

    // sync with supabase
    await Promise.all(
      activityIds.map((id, idx) => supabase.from("activities").update({ order: idx }).eq("id", id))
    );
  },

  addDocument: async (document) => {
    const formattedDocument = transformKeys(document, snakeCase);
    const uploadedAt = new Date().toISOString();
    const { data, error } = await supabase
      .from("documents")
      .insert({ ...(formattedDocument as object), uploadedAt })
      .select()
      .single();
    if (error) {
      console.error("Error adding document", error);
      return;
    }
    set((state) => ({ documents: [...state.documents, data] }));
  },

  deleteDocument: async (id) => {
    const { error } = await supabase.from("documents").delete().eq("id", id);
    if (error) {
      console.error("Error deleting document", error);
      return;
    }
    set((state) => ({
      documents: state.documents.filter((d) => d.id !== id),
    }));
  },

  addChecklistItem: async (tripId, text) => {
    const formattedChecklist = transformKeys({ tripId, text, completed: false }, snakeCase);
    const { data, error } = await supabase
      .from("checklist")
      .insert(formattedChecklist)
      .select()
      .single();
    if (error) {
      console.error("Error adding checklist item", error);
      return;
    }
    set((state) => ({ checklist: [...state.checklist, data] }));
  },

  toggleChecklistItem: async (id, completed) => {
    const { data, error } = await supabase
      .from("checklist")
      .update({ completed })
      .eq("id", id)
      .select()
      .single();
    if (error) {
      console.error("Error toggling checklist item", error);
      return;
    }
    set((state) => ({
      checklist: state.checklist.map((c) => (c.id === id ? { ...c, ...data } : c)),
    }));
  },

  deleteChecklistItem: async (id) => {
    const { error } = await supabase.from("checklist").delete().eq("id", id);
    if (error) {
      console.error("Error deleting checklist item", error);
      return;
    }
    set((state) => ({
      checklist: state.checklist.filter((c) => c.id !== id),
    }));
  },

  setMemo: async (tripId, memo) => {
    const { error } = await supabase.from("trips").update({ memo }).eq("id", tripId);
    if (error) {
      console.error("Error updating memo", error);
      return;
    }
    set((state) => ({
      memos: { ...state.memos, [tripId]: memo },
    }));
  },

  exportShareLink: (tripId) => {
    return `${window.location.origin}/import?data=${encodeURIComponent(
      JSON.stringify({ tripId })
    )}`;
  },
}));
