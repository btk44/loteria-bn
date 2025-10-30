import type { Tables } from "./db/database.types";

export type GiftDTO = Pick<Tables<"gifts">, "id" | "code" | "name" | "givesto">;
