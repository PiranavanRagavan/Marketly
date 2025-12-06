import { supabase } from "@/integrations/supabase/client";

export interface UserRole {
  role: 'customer' | 'staff' | 'manager';
}

export const signUp = async (email: string, password: string, fullName: string, staffId?: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        staff_id: staffId || null,
      },
      emailRedirectTo: `${window.location.origin}/`,
    },
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getUserRoles = async (userId: string): Promise<UserRole[]> => {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId);
  
  if (error) throw error;
  return data || [];
};

export const hasRole = (roles: UserRole[], targetRole: 'customer' | 'staff' | 'manager'): boolean => {
  return roles.some(r => r.role === targetRole);
};
