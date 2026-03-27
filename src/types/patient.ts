import type { Tables } from "@/integrations/supabase/types";

export type Patient = Tables<"patients">;

export type PatientStatus = "Stable" | "Critical" | "Recovering" | "Discharged";
export type PatientGender = "Male" | "Female" | "Other";

export type ViewMode = "grid" | "list";
