import { arktypeResolver } from "@hookform/resolvers/arktype";
import { useForm } from "react-hook-form";
import { ActivitySchema, type ActivitySchemaTypeIn, type ActivitySchemaTypeOut } from "./schema";

export const createActivityDefaults = (date: string): ActivitySchemaTypeIn => ({
  title: "",
  date,
  startTime: "",
  endTime: "",
  category: "none",
  address: "",
  url: "",
  memo: "",
  cost: "",
  currency: "USD",
  image: "",
});

export const useActivityForm = (defaultValues: ActivitySchemaTypeIn) => {
  const methods = useForm<ActivitySchemaTypeIn, unknown, ActivitySchemaTypeOut>({
    resolver: arktypeResolver(ActivitySchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues,
  });

  return { methods };
};