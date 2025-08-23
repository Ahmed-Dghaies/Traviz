import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import {
  useGetActivitiesQuery,
  useGetTripQuery,
  useImportSharedMutation,
} from "@/lib/supabase/tripsApi";
import { skipToken } from "@reduxjs/toolkit/query";

export default function ImportHandler() {
  const params = useParams();
  const navigate = useNavigate();
  const [importShared] = useImportSharedMutation();
  const tripId = params.tripId;
  const { data: trip } = useGetTripQuery(tripId ?? skipToken);
  const { data: activities } = useGetActivitiesQuery(tripId ?? skipToken);

  useEffect(() => {
    if (trip && activities) {
      importShared({ trip, activities })
        .unwrap()
        .then((tripId) => {
          navigate(`/trip/${tripId}`);
        });
    }
  }, [trip, activities, importShared, navigate]);

  return null;
}
