import type { GiftDTO } from "@/types";
import type { supabaseClient } from "../db/supabase.client";

export class GiftService {
  private supabase: typeof supabaseClient;

  constructor(supabase: typeof supabaseClient) {
    this.supabase = supabase;
  }

  async getGiftRecordByCode(code: number): Promise<GiftDTO | null> {
    try {
      const { data, error } = await this.supabase
        .from("gifts")
        .select("id, code,name, givesto")
        .eq("code", code)
        .maybeSingle();

      if (error) {
        throw new Error(`Failed to fetch gift record: ${error.message}`);
      }

      if (!data) {
        return null;
      }

      return data;
    } catch (error) {
      throw error instanceof Error ? error : new Error("Unexpected error occurred while fetching gift record");
    }
  }
}
