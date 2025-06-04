
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@clerk/clerk-react';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type PortfolioHolding = Tables<'portfolio_holdings'>;
type PortfolioHoldingInsert = TablesInsert<'portfolio_holdings'>;
type PortfolioHoldingUpdate = TablesUpdate<'portfolio_holdings'>;

export interface Holding {
  id: string;
  symbol: string;
  name: string;
  amount: number;
  avgPrice: number;
  currentPrice: number;
  purchaseDate: string;
  coinId: string;
}

const usePortfolioHoldings = () => {
  const { user } = useUser();
  const queryClient = useQueryClient();

  // Set up Supabase auth session when Clerk user changes
  useEffect(() => {
    const setupSupabaseAuth = async () => {
      if (user?.id) {
        // Create a custom JWT token for Supabase with Clerk user ID
        const customToken = btoa(JSON.stringify({
          sub: user.id,
          aud: 'authenticated',
          role: 'authenticated',
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 3600 // 1 hour
        }));
        
        // Set the session in Supabase to use the Clerk user ID
        await supabase.auth.setSession({
          access_token: customToken,
          refresh_token: customToken,
          user: {
            id: user.id,
            aud: 'authenticated',
            role: 'authenticated',
            email: user.emailAddresses[0]?.emailAddress || '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            app_metadata: {},
            user_metadata: {}
          }
        });
      } else {
        // Sign out of Supabase when no Clerk user
        await supabase.auth.signOut();
      }
    };

    setupSupabaseAuth();
  }, [user?.id]);

  // Fetch holdings from Supabase
  const { data: holdings = [], isLoading, error } = useQuery({
    queryKey: ['portfolio-holdings', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      console.log('Fetching holdings for user:', user.id);
      
      const { data, error } = await supabase
        .from('portfolio_holdings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      console.log('Supabase query result:', { data, error });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      return data.map((holding: PortfolioHolding): Holding => ({
        id: holding.id,
        symbol: holding.symbol,
        name: holding.name,
        amount: Number(holding.amount),
        avgPrice: Number(holding.avg_price),
        currentPrice: Number(holding.avg_price), // Will be updated with real-time prices
        purchaseDate: holding.purchase_date,
        coinId: holding.coin_id
      }));
    },
    enabled: !!user?.id
  });

  // Add new holding
  const addHoldingMutation = useMutation({
    mutationFn: async (holding: Omit<Holding, 'id' | 'currentPrice'>) => {
      if (!user?.id) throw new Error('User not authenticated');

      console.log('Adding holding for user:', user.id, holding);

      const insertData: PortfolioHoldingInsert = {
        user_id: user.id,
        symbol: holding.symbol,
        name: holding.name,
        coin_id: holding.coinId,
        amount: holding.amount,
        avg_price: holding.avgPrice,
        purchase_date: holding.purchaseDate
      };

      const { data, error } = await supabase
        .from('portfolio_holdings')
        .insert(insertData)
        .select()
        .single();

      console.log('Insert result:', { data, error });

      if (error) {
        console.error('Insert error:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio-holdings', user?.id] });
    }
  });

  // Update holding
  const updateHoldingMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Holding> & { id: string }) => {
      if (!user?.id) throw new Error('User not authenticated');

      console.log('Updating holding:', id, updates);

      const updateData: PortfolioHoldingUpdate = {};
      if (updates.symbol) updateData.symbol = updates.symbol;
      if (updates.name) updateData.name = updates.name;
      if (updates.coinId) updateData.coin_id = updates.coinId;
      if (updates.amount !== undefined) updateData.amount = updates.amount;
      if (updates.avgPrice !== undefined) updateData.avg_price = updates.avgPrice;
      if (updates.purchaseDate) updateData.purchase_date = updates.purchaseDate;

      const { data, error } = await supabase
        .from('portfolio_holdings')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      console.log('Update result:', { data, error });

      if (error) {
        console.error('Update error:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio-holdings', user?.id] });
    }
  });

  // Delete holding
  const deleteHoldingMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!user?.id) throw new Error('User not authenticated');

      console.log('Deleting holding:', id);

      const { error } = await supabase
        .from('portfolio_holdings')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      console.log('Delete result:', { error });

      if (error) {
        console.error('Delete error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio-holdings', user?.id] });
    }
  });

  return {
    holdings,
    isLoading,
    error,
    addHolding: addHoldingMutation.mutate,
    updateHolding: updateHoldingMutation.mutate,
    deleteHolding: deleteHoldingMutation.mutate,
    isAddingHolding: addHoldingMutation.isPending,
    isUpdatingHolding: updateHoldingMutation.isPending,
    isDeletingHolding: deleteHoldingMutation.isPending
  };
};

export default usePortfolioHoldings;
