// Mock Supabase client - Se configurará cuando tengamos Supabase activo

export interface SupabaseClient {
  auth: {
    signIn: (email: string, password: string) => Promise<any>;
    signOut: () => Promise<any>;
    getUser: () => Promise<any>;
  };
  from: (table: string) => any;
}

// Cliente mock de Supabase
class MockSupabaseClient implements SupabaseClient {
  auth = {
    signIn: async (email: string, password: string) => {
      console.log("Mock Supabase - Sign in:", email);
      return { user: { id: "mock-user-id", email }, error: null };
    },
    signOut: async () => {
      console.log("Mock Supabase - Sign out");
      return { error: null };
    },
    getUser: async () => {
      console.log("Mock Supabase - Get user");
      return {
        user: {
          id: "mock-user-id",
          email: "tutor@tecsup.edu.pe",
        },
        error: null,
      };
    },
  };

  from(table: string) {
    console.log("Mock Supabase - Query table:", table);
    return {
      select: () => this,
      insert: () => this,
      update: () => this,
      delete: () => this,
      eq: () => this,
      then: (resolve: any) => resolve({ data: [], error: null }),
    };
  }
}

export const supabase = new MockSupabaseClient();

// Cuando tengamos Supabase real, descomentar esto:
/*
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
*/
