import { type } from "arktype";

export const ActivitySchema = type({
  title: "string>0",
  date: "string.date",
  startTime: "string?",
  endTime: "string?",
  category: "string",
  address: "string?",
  url: "string?",
  memo: "string?",
  cost: "string?",
  currency: "string?",
  image: "string?",
});

export type ActivitySchemaTypeIn = typeof ActivitySchema.inferIn;
export type ActivitySchemaTypeOut = typeof ActivitySchema.inferOut;