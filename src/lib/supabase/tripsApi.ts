import { createApi, fetchBaseQuery, type FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { camelCase, snakeCase } from "lodash";

import { createSupabaseClient, transformKeys } from "./client";

import type { Activity, ChecklistItem, Document, Memo, Trip, TripDetails } from "@/types/trips";

const supabase = createSupabaseClient();

const handleSupabaseError = (error: unknown) => {
  if (error instanceof Error) {
    return {
      error: {
        status: "CUSTOM_ERROR",
        error: error.message,
      },
    } as { error: FetchBaseQueryError };
  }
  return {
    error: {
      status: "CUSTOM_ERROR",
      error: "Unknown error",
    },
  } as { error: FetchBaseQueryError };
};

export const tripsApi = createApi({
  reducerPath: "tripsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  tagTypes: ["Trip", "Activity", "Document", "Checklist", "Memo"],
  endpoints: (builder) => ({
    // Trips endpoints
    getTrips: builder.query<Trip[], string>({
      queryFn: async (userId) => {
        try {
          const { data, error } = await supabase.from("trips").select("*").eq("user_id", userId);

          if (error) {
            return handleSupabaseError(error);
          }

          const formattedTrips = transformKeys(data ?? [], camelCase) as Trip[];
          return { data: formattedTrips };
        } catch (error: unknown) {
          return handleSupabaseError(error);
        }
      },
      providesTags: (result) =>
        result ? [...result.map(({ id }) => ({ type: "Trip" as const, id })), "Trip"] : ["Trip"],
    }),

    getTrip: builder.query<Trip, string>({
      queryFn: async (id) => {
        try {
          const { data, error } = await supabase.from("trips").select("*").eq("id", id).single();

          if (error) {
            return handleSupabaseError(error);
          }

          const formattedTrip = transformKeys(data ?? {}, camelCase) as Trip;
          return { data: formattedTrip };
        } catch (error: unknown) {
          return handleSupabaseError(error);
        }
      },
      providesTags: [],
    }),

    addTrip: builder.mutation<{ id: string }, TripDetails>({
      queryFn: async (trip) => {
        try {
          const tripToAdd = transformKeys(trip, snakeCase);
          const { data, error } = await supabase.from("trips").insert(tripToAdd).select().single();

          if (error) {
            return handleSupabaseError(error);
          }

          return { data: { id: data.id } };
        } catch (error: unknown) {
          return handleSupabaseError(error);
        }
      },
      invalidatesTags: ["Trip"],
    }),

    importShared: builder.mutation<
      string | null,
      { trip: Trip; activities: Activity[] }
    >({
      queryFn: async ({ trip, activities }, { dispatch }) => {
        try {
          const {
            data: { user },
            error: userError,
          } = await supabase.auth.getUser();

          if (userError || !user) {
            return handleSupabaseError(userError ?? new Error("You must be signed in to import a trip."));
          }

          const { id: _sourceTripId, userId: _sourceUserId, ...tripDetails } = trip;
          const tripToAdd = transformKeys(tripDetails, snakeCase);
          const { data: tripData, error: tripError } = await supabase
            .from("trips")
            .insert(tripToAdd)
            .select()
            .single();

          if (tripError) {
            return handleSupabaseError(tripError);
          }

          const newTripId = tripData.id;

          if (activities && activities.length > 0) {
            const activitiesToAdd = activities.map(
              ({ id: _sourceActivityId, tripId: _sourceActivityTripId, userId: _sourceActivityUserId, ...activity }) => ({
                ...activity,
                tripId: newTripId,
                userId: user.id,
              })
            );
            const formattedActivities = transformKeys(activitiesToAdd, snakeCase);

            const { error: activitiesError } = await supabase
              .from("activities")
              .insert(formattedActivities);

            if (activitiesError) {
              await supabase.from("trips").delete().eq("id", newTripId);
              return handleSupabaseError(activitiesError);
            }
          }

          setTimeout(() => {
            dispatch(tripsApi.util.invalidateTags(["Trip", "Activity"]));
          }, 0);

          return { data: newTripId };
        } catch (error: unknown) {
          return handleSupabaseError(error);
        }
      },
      invalidatesTags: [],
    }),

    updateTrip: builder.mutation<void, { id: string; updates: TripDetails }>({
      queryFn: async ({ id, updates }) => {
        try {
          const formattedUpdates = transformKeys(updates, snakeCase);
          const { error } = await supabase.from("trips").update(formattedUpdates).eq("id", id);

          if (error) {
            return handleSupabaseError(error);
          }

          return { data: undefined };
        } catch (error: unknown) {
          return handleSupabaseError(error);
        }
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: "Trip", id }],
    }),

    deleteTrip: builder.mutation<void, string>({
      queryFn: async (id) => {
        try {
          const { error } = await supabase.from("trips").delete().eq("id", id);

          if (error) {
            return handleSupabaseError(error);
          }

          return { data: undefined };
        } catch (error: unknown) {
          return handleSupabaseError(error);
        }
      },
      invalidatesTags: ["Trip"],
    }),

    // Activities endpoints
    getActivities: builder.query<Activity[], string>({
      queryFn: async (tripId) => {
        try {
          const { data, error } = await supabase
            .from("activities")
            .select("*")
            .eq("trip_id", tripId)
            .order("date", { ascending: true });

          if (error) {
            return handleSupabaseError(error);
          }

          const formattedActivities = transformKeys(data ?? [], camelCase) as Activity[];
          return { data: formattedActivities };
        } catch (error: unknown) {
          return handleSupabaseError(error);
        }
      },
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: "Activity" as const, id })), "Activity"]
          : ["Activity"],
    }),

    getActivity: builder.query<Activity, string>({
      queryFn: async (id) => {
        try {
          const { data, error } = await supabase
            .from("activities")
            .select("*")
            .eq("id", id)
            .single();

          if (error) {
            return handleSupabaseError(error);
          }

          const formattedActivity = transformKeys(data ?? {}, camelCase) as Activity;
          return { data: formattedActivity };
        } catch (error: unknown) {
          return handleSupabaseError(error);
        }
      },
      providesTags: (_result, _error, id) => [{ type: "Activity", id }],
    }),

    addActivity: builder.mutation<void, Omit<Activity, "id" | "order">>({
      queryFn: async (activity) => {
        try {
          const { data: existingActivities, error: countError } = await supabase
            .from("activities")
            .select("id")
            .eq("trip_id", activity.tripId)
            .eq("date", activity.date);

          if (countError) {
            return handleSupabaseError(countError);
          }

          const order = existingActivities?.length || 0;
          const formattedActivity = transformKeys({ ...activity, order }, snakeCase);

          const { error } = await supabase.from("activities").insert(formattedActivity);

          if (error) {
            return handleSupabaseError(error);
          }

          return { data: undefined };
        } catch (error: unknown) {
          return handleSupabaseError(error);
        }
      },
      invalidatesTags: ["Activity"],
    }),

    updateActivity: builder.mutation<void, { id: string; updates: Partial<Activity> }>({
      queryFn: async ({ id, updates }) => {
        try {
          const formattedUpdates = transformKeys(updates, snakeCase);
          const { error } = await supabase.from("activities").update(formattedUpdates).eq("id", id);

          if (error) {
            return handleSupabaseError(error);
          }

          return { data: undefined };
        } catch (error: unknown) {
          return handleSupabaseError(error);
        }
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: "Activity", id }],
    }),

    deleteActivity: builder.mutation<void, string>({
      queryFn: async (id) => {
        try {
          const { error } = await supabase.from("activities").delete().eq("id", id);

          if (error) {
            return handleSupabaseError(error);
          }

          return { data: undefined };
        } catch (error: unknown) {
          return handleSupabaseError(error);
        }
      },
      invalidatesTags: ["Activity"],
    }),

    // Documents endpoints
    getDocuments: builder.query<Document[], string>({
      queryFn: async (tripId) => {
        try {
          const { data, error } = await supabase
            .from("documents")
            .select("*")
            .eq("trip_id", tripId);

          if (error) {
            return handleSupabaseError(error);
          }

          const formattedDocuments = transformKeys(data ?? [], camelCase) as Document[];
          return { data: formattedDocuments };
        } catch (error: unknown) {
          return handleSupabaseError(error);
        }
      },
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: "Document" as const, id })), "Document"]
          : ["Document"],
    }),

    addDocument: builder.mutation<void, Omit<Document, "id" | "uploadedAt">>({
      queryFn: async (document) => {
        try {
          const formattedDocument = transformKeys(
            { ...document, uploadedAt: new Date().toISOString() },
            snakeCase
          );

          const { error } = await supabase.from("documents").insert(formattedDocument);

          if (error) {
            return handleSupabaseError(error);
          }

          return { data: undefined };
        } catch (error: unknown) {
          return handleSupabaseError(error);
        }
      },
      invalidatesTags: ["Document"],
    }),

    deleteDocument: builder.mutation<void, string>({
      queryFn: async (id) => {
        try {
          const { error } = await supabase.from("documents").delete().eq("id", id);

          if (error) {
            return handleSupabaseError(error);
          }

          return { data: undefined };
        } catch (error: unknown) {
          return handleSupabaseError(error);
        }
      },
      invalidatesTags: ["Document"],
    }),

    // Checklist endpoints
    getChecklist: builder.query<ChecklistItem[], string>({
      queryFn: async (tripId) => {
        try {
          const { data, error } = await supabase
            .from("checklist")
            .select("*")
            .eq("trip_id", tripId);

          if (error) {
            return handleSupabaseError(error);
          }

          const formattedChecklist = transformKeys(data ?? [], camelCase) as ChecklistItem[];
          return { data: formattedChecklist };
        } catch (error: unknown) {
          return handleSupabaseError(error);
        }
      },
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: "Checklist" as const, id })), "Checklist"]
          : ["Checklist"],
    }),

    addChecklistItem: builder.mutation<void, { tripId: string; text: string }>({
      queryFn: async ({ tripId, text }) => {
        try {
          const formattedChecklist = transformKeys({ tripId, text, completed: false }, snakeCase);

          const { error } = await supabase.from("checklist").insert(formattedChecklist);

          if (error) {
            return handleSupabaseError(error);
          }

          return { data: undefined };
        } catch (error: unknown) {
          return handleSupabaseError(error);
        }
      },
      invalidatesTags: ["Checklist"],
    }),

    toggleChecklistItem: builder.mutation<void, { id: string; completed: boolean }>({
      queryFn: async ({ id, completed }) => {
        try {
          const { error } = await supabase.from("checklist").update({ id, completed }).eq("id", id);

          if (error) {
            return handleSupabaseError(error);
          }

          return { data: undefined };
        } catch (error: unknown) {
          return handleSupabaseError(error);
        }
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: "Checklist", id }],
    }),

    deleteChecklistItem: builder.mutation<void, string>({
      queryFn: async (id) => {
        try {
          const { error } = await supabase.from("checklist").delete().eq("id", id);

          if (error) {
            return handleSupabaseError(error);
          }

          return { data: undefined };
        } catch (error: unknown) {
          return handleSupabaseError(error);
        }
      },
      invalidatesTags: ["Checklist"],
    }),

    //Memo endpoints

    getMemos: builder.query<Memo[], string>({
      queryFn: async (tripId) => {
        try {
          const { data, error } = await supabase.from("memos").select("*").eq("trip_id", tripId);

          if (error) {
            return handleSupabaseError(error);
          }

          const formattedMemos = transformKeys(data ?? [], camelCase) as Memo[];
          return { data: formattedMemos };
        } catch (error: unknown) {
          return handleSupabaseError(error);
        }
      },
      providesTags: (result) =>
        result ? [...result.map(({ id }) => ({ type: "Memo" as const, id })), "Memo"] : ["Memo"],
    }),

    getMemo: builder.query<Memo, string>({
      queryFn: async (tripId) => {
        try {
          const { data, error } = await supabase
            .from("memos")
            .select("*")
            .eq("trip_id", tripId)
            .single();

          if (error) {
            return handleSupabaseError(error);
          }

          const formattedMemo = transformKeys(data ?? {}, camelCase) as Memo;
          return { data: formattedMemo };
        } catch (error: unknown) {
          return handleSupabaseError(error);
        }
      },
      providesTags: (_result, _error, tripId) => [{ type: "Memo", id: tripId }],
    }),

    addMemo: builder.mutation<void, { tripId: string; memo: string }>({
      queryFn: async ({ tripId, memo }) => {
        try {
          const formattedMemo = transformKeys({ tripId, memo }, snakeCase);
          const { data, error } = await supabase
            .from("memos")
            .insert(formattedMemo)
            .select()
            .single();

          if (error) {
            return handleSupabaseError(error);
          }

          return { data };
        } catch (error: unknown) {
          return handleSupabaseError(error);
        }
      },
      invalidatesTags: (_result, _error, { tripId }) => [{ type: "Memo", id: tripId }],
    }),

    updateMemo: builder.mutation<void, { tripId: string; memo: string }>({
      queryFn: async ({ tripId, memo }) => {
        try {
          const formattedMemo = transformKeys({ tripId, memo }, snakeCase);
          const { error } = await supabase
            .from("memos")
            .update(formattedMemo)
            .eq("trip_id", tripId);

          if (error) {
            return handleSupabaseError(error);
          }

          return { data: undefined };
        } catch (error: unknown) {
          return handleSupabaseError(error);
        }
      },
      invalidatesTags: (_result, _error, { tripId }) => [{ type: "Memo", id: tripId }],
    }),

    upsertMemo: builder.mutation<void, { tripId: string; memo: string }>({
      queryFn: async ({ tripId, memo }) => {
        try {
          const formattedMemo = transformKeys({ tripId, memo }, snakeCase);
          const { error } = await supabase.from("memos").upsert(formattedMemo, {
            onConflict: "trip_id",
          });

          if (error) {
            return handleSupabaseError(error);
          }

          return { data: undefined };
        } catch (error: unknown) {
          return handleSupabaseError(error);
        }
      },
      invalidatesTags: ["Memo"],
    }),

  }),
});

export const {
  useGetTripsQuery,
  useGetTripQuery,
  useAddTripMutation,
  useImportSharedMutation,
  useUpdateTripMutation,
  useDeleteTripMutation,
  useGetActivitiesQuery,
  useGetActivityQuery,
  useAddActivityMutation,
  useUpdateActivityMutation,
  useDeleteActivityMutation,
  useGetDocumentsQuery,
  useAddDocumentMutation,
  useDeleteDocumentMutation,
  useGetChecklistQuery,
  useAddChecklistItemMutation,
  useToggleChecklistItemMutation,
  useDeleteChecklistItemMutation,
  useGetMemosQuery,
  useGetMemoQuery,
  useAddMemoMutation,
  useUpdateMemoMutation,
  useUpsertMemoMutation,
} = tripsApi;
