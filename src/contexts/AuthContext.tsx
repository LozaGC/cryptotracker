
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: clerkUser, isLoaded } = useUser();
  const { signOut: clerkSignOut } = useClerkAuth();
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncUserToSupabase = async () => {
      if (isLoaded && clerkUser) {
        try {
          // Check if user exists in Supabase profiles table
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', clerkUser.id)
            .single();

          if (!existingProfile) {
            // Create user profile in Supabase
            await supabase
              .from('profiles')
              .insert({
                id: clerkUser.id,
                email: clerkUser.primaryEmailAddress?.emailAddress,
                full_name: clerkUser.fullName,
                avatar_url: clerkUser.imageUrl,
              });
          } else {
            // Update existing profile
            await supabase
              .from('profiles')
              .update({
                email: clerkUser.primaryEmailAddress?.emailAddress,
                full_name: clerkUser.fullName,
                avatar_url: clerkUser.imageUrl,
                updated_at: new Date().toISOString(),
              })
              .eq('id', clerkUser.id);
          }

          setUser({
            id: clerkUser.id,
            email: clerkUser.primaryEmailAddress?.emailAddress,
            user_metadata: {
              full_name: clerkUser.fullName,
              avatar_url: clerkUser.imageUrl,
            }
          });
        } catch (error) {
          console.error('Error syncing user to Supabase:', error);
        }
      } else if (isLoaded && !clerkUser) {
        setUser(null);
      }
      
      if (isLoaded) {
        setLoading(false);
      }
    };

    syncUserToSupabase();
  }, [clerkUser, isLoaded]);

  const signOut = async () => {
    await clerkSignOut();
    setUser(null);
  };

  const value = {
    user,
    loading,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
