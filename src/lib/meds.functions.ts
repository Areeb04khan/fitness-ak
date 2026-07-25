import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export type MedItem = {
  id: string;
  name: string;
  dose: string;
  time_of_day: string;
  notes: string | null;
  sort_order: number;
};

export const listMeds = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<MedItem[]> => {
    const { data, error } = await context.supabase
      .from("private_items")
      .select("id, name, dose, time_of_day, notes, sort_order")
      .eq("user_id", context.userId)
      .order("sort_order");
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const addMed = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { name: string; dose: string; time_of_day: string; notes?: string }) =>
    z
      .object({
        name: z.string().min(1).max(200),
        dose: z.string().min(1).max(100),
        time_of_day: z.string().min(1).max(50),
        notes: z.string().max(500).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("private_items").insert({
      user_id: context.userId,
      name: data.name,
      dose: data.dose,
      time_of_day: data.time_of_day,
      notes: data.notes ?? null,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const removeMed = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("private_items")
      .delete()
      .eq("user_id", context.userId)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
