// Client-side only
import { type Database } from '@/types/supabase';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const createClient = () => {
  return createClientComponentClient<Database>();
};

export const supabase = createClient();
