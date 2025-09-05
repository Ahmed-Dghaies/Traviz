import { useForm } from "react-hook-form";
import { arktypeResolver } from "@hookform/resolvers/arktype";
import { TripSchema, type TripSchemaTypeIn, type TripSchemaTypeOut } from "./schema";

export const useNewTripForm = (defaultValues?: TripSchemaTypeIn) => {
  const methods = useForm<TripSchemaTypeIn, unknown, TripSchemaTypeOut>({
    resolver: arktypeResolver(TripSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: defaultValues || {
      title: "",
      countries: [],
      cities: [],
      startDate: undefined,
      endDate: undefined,
      people: 1,
      thumbnail: null,
      description: "",
    },
  });

  return {
    methods,
  };
};
