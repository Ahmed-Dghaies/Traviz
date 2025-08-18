import { useEffect } from "react";
import { useTripsStore } from "@/components/trips-store";
import { useNavigate, useParams } from "react-router";

export default function ImportHandler() {
  const params = useParams();
  const navigate = useNavigate();
  const { importShared } = useTripsStore();

  useEffect(() => {
    const payload = params.import;
    if (payload) {
      const id = importShared(payload);
      const next = id ? `/itinerary/${id}` : "/";
      const url = new URL(window.location.href);
      url.searchParams.delete("import");
      window.history.replaceState({}, "", url.toString());
      navigate(next);
    }
  }, [params, importShared, navigate]);

  return null;
}
