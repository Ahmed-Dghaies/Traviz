import { type } from "arktype";

export const TripSchema = type({
  destination: "string>3",
  startDate: "string.date",
  endDate: "string.date",
  people: "string.numeric.parse | number",
  thumbnail: "string|null?",
  notes: "string?",
});

export type TripSchemaTypeIn = typeof TripSchema.inferIn;
export type TripSchemaTypeOut = typeof TripSchema.inferOut;
