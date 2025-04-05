
import { Database } from "@/integrations/supabase/types";
import { SchemeDetail } from '@/types/investor';

// Extended type for the database row
export type InvestorRow = Database['public']['Tables']['investors']['Row'] & {
  schemes?: SchemeDetail[] | null;
  nominee_details?: Record<string, any> | null;
  residential_status?: string | null;
  nationality?: string | null;
  annual_income?: string | null;
  mothers_name?: string | null;
  occupation?: string | null;
  bank_branch?: string | null;
  account_type?: string | null;
};
