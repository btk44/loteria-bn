import { createSupabaseServerInstance } from "@/db/supabase.client";
import { GiftService } from "@/lib/GiftService";
import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async ({ params, locals, cookies, request }) => {
  const code = params.code;

  try {
    const supabase = createSupabaseServerInstance({
      cookies,
      headers: request.headers,
    });
    // Add Supabase client to locals
    locals.supabase = supabase;

    const giftService = new GiftService(locals.supabase);
    const giftRecord = await giftService.getGiftRecordByCode(Number(code));

    return new Response(JSON.stringify({ name: giftRecord?.name, givesto: giftRecord?.givesto }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch {
    // Return generic server error response
    return new Response(
      JSON.stringify({
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred while processing your request",
        },
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
