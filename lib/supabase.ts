import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// During local development without keys set, this client is created but
// calls will fail gracefully — the UI still renders using dummy data from lib/products.ts.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type OrderRecord = {
  id?: string;
  customer_name: string;
  phone: string;
  address: string;
  city: string;
  items: { id: string; name: string; price: number; qty: number }[];
  total: number;
  payment_method: "jazzcash" | "easypaisa" | "cod";
  payment_reference?: string;
  requires_prescription: boolean;
  prescription_url?: string;
  status: "pending" | "confirmed" | "rejected" | "fulfilled";
  created_at?: string;
};
