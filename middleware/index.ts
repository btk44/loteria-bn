import { defineMiddleware } from "astro:middleware";

import { createSupabaseServerInstance } from "@/db/supabase.client";

export const onRequest = defineMiddleware(async ({ locals, cookies, request }, next) => {
  const supabase = createSupabaseServerInstance({
    cookies,
    headers: request.headers,
  });

  // Add Supabase client to locals
  locals.supabase = supabase;

  return next();
});
