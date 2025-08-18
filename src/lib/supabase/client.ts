import { createClient } from "@supabase/supabase-js";

export function createSupabaseClient() {
  return createClient(
    import.meta.env.VITE_PUBLIC_SUPABASE_URL!,
    import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export const transformKeys = (obj: unknown, transformFn: (key: string) => string): unknown => {
  if (Array.isArray(obj)) {
    return obj.map((item) => transformKeys(item, transformFn));
  } else if (obj && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        transformFn(key),
        transformKeys(value, transformFn),
      ])
    );
  }
  return obj;
};
