import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Lead = {
  id: string;
  name: string;
  requirement: string;
  created_at: string;
};

export type Service = {
  id: string;
  name: string;
  type?: string;
  created_at?: string;
  order_num?: number;
};

export type Review = {
  id: string;
  name: string;
  location: string;
  avatar_letter: string;
  color_class: string;
  rating: number;
  review_text: string;
  service_received: string;
  created_at?: string;
};
