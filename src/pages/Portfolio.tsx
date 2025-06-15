
import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, PieChart, BarChart3, DollarSign, Sparkles, RefreshCw, User, Mail, Trash2 } from "lucide-react";
import Header from "@/components/Header";
import PortfolioAnalytics from "@/components/PortfolioAnalytics";
import AddAssetForm from "@/components/AddAssetForm";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from '@clerk/clerk-react';
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { portfolioApiService, type AddAssetRequest, type PortfolioSummary, type AggregatedHolding } from "@/services/portfolioApiService";

const Portfolio = () => {
  const { user } = useUser();
  const { refreshToken } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);

  // Optimized portfolio query with better caching
  const { data: portfolioData, isLoading, error, refetch } = useQuery({
    queryKey: ['portfolio-summary', user?.id],
    queryFn: async (): Promise<PortfolioSummary> => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      return portfolioApiService.getPortfolio(user.id, refreshToken);
    },
    enabled: !!user?.id,
    refetchInterval: 600000, // Refetch every 10 minutes for better performance
    staleTime: 300000, // Consider data stale after 5 minutes
    retry: 2, // Reduce retry attempts
  });

  // Log any query errors
  useEffect(() => {
    if (error) {
      console.error('Portfolio query error:', error);
      toast({
        title: "Error loading portfolio",
        description: "Failed to load your portfolio. Please try refreshing.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Optimized mutation for adding new assets
  const addAssetMutation = useMutation({
    mutationFn: async (assetData: AddAssetRequest) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      return portfolioApiService.addAsset(assetData, user.id, refreshToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio-summary'] });
      toast({
        title: "Success",
        description: "Asset added successfully!",
      });
      setShowAddForm(false);
    },
    onError: (error: any) => {
      console.error('Add asset mutation error:', error);
      toast({
        title: "Error",
        description: `Failed to add asset: ${error.message || error}`,
        variant: "destructive",
      });
    }
  });

  // Optimized mutation for deleting assets
  const deleteAssetMutation = useMutation({
    mutationFn: async (assetId: string) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      return portfolioApiService.deleteAsset(assetId, user.id, refreshToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio-summary'] });
      toast({
        title: "Success",
        description: "Asset deleted successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to delete asset: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Memoized handlers for better performance
  const handleRefresh = useCallback(() => {
    refetch();
    toast({
      title: "Refreshed",
      description: "Portfolio data has been refreshed",
    });
  }, [refetch, toast]);

  const handleDeleteAsset = useCallback((assetId: string) => {
    if (confirm('Are you sure you want to delete this asset entry?')) {
      deleteAssetMutation.mutate(assetId);
    }
  }, [deleteAssetMutation]);

  // Memoized currency formatter
  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  }, []);

  // Memoized analytics holdings conversion
  const analyticsHoldings = useMemo(() => 
    portfolioData?.holdings.flatMap(holding => 
      holding.entries.map(entry => ({
        id: entry.id,
        symbol: entry.symbol,
        name: entry.name,
        amount: entry.quantity,
        avgPrice: entry.price_used,
        currentPrice: holding.current_price,
        purchaseDate: entry.timestamp,
        coinId: entry.coin_id
      }))
    ) || [], [portfolioData?.holdings]
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Simplified Background - Reduced animations for better performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-red-500/5 to-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-orange-500/5 to-red-500/5 rounded-full blur-3xl" />
      </div>

      <Header />
      <div className="pt-20 p-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8 text-center">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <Sparkles className="w-8 h-8 text-red-400" />
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                Smart Portfolio
              </h1>
              <Sparkles className="w-8 h-8 text-orange-400" />
            </div>
            <div className="h-1 w-48 bg-gradient-to-r from-red-500 to-orange-400 mx-auto mb-4"></div>
            <p className="text-xl text-gray-400">AI-Powered Investment Tracking</p>
            {user && (
              <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-300">
                <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-700">
                  <User className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-400">Portfolio Owner:</span>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-green-400" />
                    <span className="text-white font-medium">{user.primaryEmailAddress?.emailAddress}</span>
                  </div>
                </div>
              </div>
            )}
          </header>

          {/* Enhanced Portfolio Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="group bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-800 hover:border-red-500/30 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Total Portfolio Value</CardTitle>
                <DollarSign className="h-5 w-5 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{formatCurrency(portfolioData?.total_portfolio_value || 0)}</div>
                <p className={`text-xs flex items-center ${(portfolioData?.total_profit_or_loss || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {(portfolioData?.total_profit_or_loss || 0) >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                  {(portfolioData?.total_profit_or_loss_percentage || 0).toFixed(2)}%
                </p>
              </CardContent>
            </Card>

            <Card className="group bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-800 hover:border-orange-500/30 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Total Investment</CardTitle>
                <BarChart3 className="h-5 w-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{formatCurrency(portfolioData?.total_invested || 0)}</div>
                <p className="text-xs text-gray-400">Total Cost Basis</p>
              </CardContent>
            </Card>

            <Card className="group bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-800 hover:border-purple-500/30 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Total P&L</CardTitle>
                <PieChart className="h-5 w-5 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${(portfolioData?.total_profit_or_loss || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatCurrency(portfolioData?.total_profit_or_loss || 0)}
                </div>
                <p className="text-xs text-gray-400">Unrealized Gains/Losses</p>
              </CardContent>
            </Card>

            <Card className="group bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-800 hover:border-green-500/30 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Unique Assets</CardTitle>
                <TrendingUp className="h-5 w-5 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{portfolioData?.holdings.length || 0}</div>
                <p className="text-xs text-gray-400">Different Cryptocurrencies</p>
              </CardContent>
            </Card>
          </div>

          {/* Portfolio Analytics */}
          <PortfolioAnalytics holdings={analyticsHoldings} />

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-6">
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all duration-300"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              {showAddForm ? 'Hide Form' : 'Add Asset'}
            </Button>
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-800 transition-all duration-300"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
          </div>

          {/* Add Asset Form */}
          {showAddForm && (
            <div className="mb-8">
              <AddAssetForm
                onAssetAdded={() => setShowAddForm(false)}
                onAddAsset={(data) => addAssetMutation.mutateAsync(data)}
                isLoading={addAssetMutation.isPending}
              />
            </div>
          )}

          {/* Holdings Table */}
          <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-800 hover:border-red-500/30 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-semibold text-white">Portfolio Holdings</CardTitle>
              <div className="text-sm text-gray-400">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </CardHeader>
            <CardContent>
              {!portfolioData?.holdings.length ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">No assets found. Start building your portfolio!</p>
                  <Button
                    onClick={() => setShowAddForm(true)}
                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Add Your First Asset
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm text-gray-400 border-b border-gray-800">
                        <th className="pb-4">Asset</th>
                        <th className="pb-4">Total Quantity</th>
                        <th className="pb-4">Avg Buy Price</th>
                        <th className="pb-4">Current Price</th>
                        <th className="pb-4">Market Value</th>
                        <th className="pb-4">P&L</th>
                        <th className="pb-4">P&L %</th>
                        <th className="pb-4">Entries</th>
                        <th className="pb-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {portfolioData.holdings.map((holding: AggregatedHolding) => (
                        <tr key={holding.symbol} className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-all duration-300">
                          <td className="py-4">
                            <div>
                              <p className="font-medium text-white">{holding.name}</p>
                              <p className="text-sm text-gray-400">{holding.symbol}</p>
                            </div>
                          </td>
                          <td className="py-4 text-white">{holding.total_quantity.toFixed(8)}</td>
                          <td className="py-4 text-white">{formatCurrency(holding.average_buy_price)}</td>
                          <td className="py-4 text-white">{formatCurrency(holding.current_price)}</td>
                          <td className="py-4 text-white font-medium">{formatCurrency(holding.current_value)}</td>
                          <td className={`py-4 font-medium ${holding.profit_or_loss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {formatCurrency(holding.profit_or_loss)}
                          </td>
                          <td className={`py-4 font-medium ${holding.profit_or_loss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {holding.profit_or_loss_percentage.toFixed(2)}%
                          </td>
                          <td className="py-4 text-gray-400 text-sm">
                            {holding.entries.length} transaction{holding.entries.length !== 1 ? 's' : ''}
                          </td>
                          <td className="py-4">
                            <div className="flex gap-1">
                              {holding.entries.map((entry) => (
                                <Button
                                  key={entry.id}
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDeleteAsset(entry.id)}
                                  disabled={deleteAssetMutation.isPending}
                                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300"
                                  title={`Delete entry: ${entry.quantity} ${entry.symbol} @ ${formatCurrency(entry.price_used)}`}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
