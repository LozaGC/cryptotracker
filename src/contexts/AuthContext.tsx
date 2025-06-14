
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
  supabaseToken: string | null;
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
  const { signOut: clerkSignOut, getToken } = useClerkAuth();
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabaseToken, setSupabaseToken] = useState<string | null>(null);

  useEffect(() => {
    const syncUserToSupabase = async () => {
      if (isLoaded && clerkUser) {
        try {
          console.log('Starting user sync for:', clerkUser.id);
          
          // Try to get the Supabase-compatible token
          let token = null;
          try {
            token = await getToken({ template: 'supabase' });
            console.log('Successfully got Supabase token:', !!token);
            console.log('Token preview (first 50 chars):', token?.substring(0, 50));
          } catch (tokenError) {
            console.error('Failed to get Supabase token:', tokenError);
            console.log('Falling back to regular Clerk token...');
            
            // Fallback to regular token if Supabase template fails
            try {
              token = await getToken();
              console.log('Got fallback Clerk token:', !!token);
            } catch (fallbackError) {
              console.error('Failed to get any token:', fallbackError);
            }
          }
          
          if (token) {
            setSupabaseToken(token);
            console.log('Token set in state');
          } else {
            console.error('No token available');
          }

          // Use the regular supabase client for profile operations (not authenticated operations)
          const { data: existingProfile, error: fetchError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', clerkUser.id)
            .single();

          console.log('Profile fetch result:', { existingProfile, fetchError });

          if (!existingProfile && !fetchError) {
            console.log('Creating new profile...');
            // Create user profile in Supabase
            const { data: newProfile, error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: clerkUser.id,
                email: clerkUser.primaryEmailAddress?.emailAddress,
                full_name: clerkUser.fullName,
                avatar_url: clerkUser.imageUrl,
              })
              .select()
              .single();
            
            console.log('Profile creation result:', { newProfile, insertError });
          } else if (existingProfile) {
            console.log('Updating existing profile...');
            // Update existing profile
            const { error: updateError } = await supabase
              .from('profiles')
              .update({
                email: clerkUser.primaryEmailAddress?.emailAddress,
                full_name: clerkUser.fullName,
                avatar_url: clerkUser.imageUrl,
                updated_at: new Date().toISOString(),
              })
              .eq('id', clerkUser.id);
            
            console.log('Profile update result:', { updateError });
          }

          // Set user data for the app
          setUser({
            id: clerkUser.id,
            email: clerkUser.primaryEmailAddress?.emailAddress,
            user_metadata: {
              full_name: clerkUser.fullName,
              avatar_url: clerkUser.imageUrl,
            }
          });
          
          console.log('User sync completed successfully');
        } catch (error) {
          console.error('Error syncing user to Supabase:', error);
          // Set user anyway so the app doesn't break
          setUser({
            id: clerkUser.id,
            email: clerkUser.primaryEmailAddress?.emailAddress,
            user_metadata: {
              full_name: clerkUser.fullName,
              avatar_url: clerkUser.imageUrl,
            }
          });
          console.log('Set user data despite sync error');
        }
      } else if (isLoaded && !clerkUser) {
        console.log('No user found, clearing state');
        setUser(null);
        setSupabaseToken(null);
      }
      
      if (isLoaded) {
        setLoading(false);
        console.log('Auth loading completed');
      }
    };

    syncUserToSupabase();
  }, [clerkUser, isLoaded, getToken]);

  const signOut = async () => {
    console.log('Signing out...');
    await clerkSignOut();
    setUser(null);
    setSupabaseToken(null);
    console.log('Sign out completed');
  };

  const value = {
    user,
    loading,
    signOut,
    supabaseToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
