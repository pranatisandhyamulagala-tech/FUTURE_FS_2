import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Lead = Tables<"leads">;
export type LeadStatus = "new" | "contacted" | "converted";

export async function getLeads(): Promise<Lead[]> {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function addLead(input: { name: string; email: string; source: string }): Promise<Lead> {
  const { data, error } = await supabase
    .from("leads")
    .insert({ name: input.name, email: input.email, source: input.source })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateLead(id: string, updates: { status?: string; notes?: string }): Promise<Lead> {
  const { data, error } = await supabase
    .from("leads")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteLead(id: string): Promise<void> {
  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) throw error;
}
