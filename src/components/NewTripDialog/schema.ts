import { type } from "arktype";

export const TripSchema = type({
  title: "string>3",
  countries: "string>0[]",
  startDate: "string.date",
  endDate: "string.date",
  people: "string.numeric.parse | number",
  thumbnail: "string|null?",
  description: "string?",
});

export type TripSchemaTypeIn = typeof TripSchema.inferIn;
export type TripSchemaTypeOut = typeof TripSchema.inferOut;
