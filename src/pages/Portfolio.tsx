import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2, TrendingUp, TrendingDown, PieChart, BarChart3, DollarSign, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import PortfolioAnalytics from "@/components/PortfolioAnalytics";
import AuthWrapper from "@/components/AuthWrapper";
import usePortfolioHoldings, { type Holding } from "@/hooks/usePortfolioHoldings";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const fetchCoinPrices = async (coinIds: string[]) => {
  if (coinIds.length === 0) return {};
  const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinIds.join(',')}&vs_currencies=usd&include_24hr_change=true`);
  if (!response.ok) throw new Error('Failed to fetch prices');
  return response.json();
};

const Portfolio = () => {
  const { toast } = useToast();
  const {
    holdings,
    isLoading,
    error,
    addHolding,
    updateHolding,
    deleteHolding,
    isAddingHolding,
    isUpdatingHolding,
    isDeletingHolding
  } = usePortfolioHoldings();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    symbol: '',
    name: '',
    amount: '',
    avgPrice: '',
    purchaseDate: '',
    coinId: ''
  });

  // Fetch real-time prices for holdings
  const coinIds = holdings.map(h => h.coinId);
  const { data: priceData } = useQuery({
    queryKey: ['portfolio-prices', coinIds],
    queryFn: () => fetchCoinPrices(coinIds),
    refetchInterval: 30000,
    enabled: coinIds.length > 0
  });

  // Update holdings with real-time prices
  const updatedHoldings = holdings.map(holding => ({
    ...holding,
    currentPrice: priceData?.[holding.coinId]?.usd || holding.avgPrice
  }));

  const totalValue = updatedHoldings.reduce((sum, holding) => sum + (holding.amount * holding.currentPrice), 0);
  const totalCost = updatedHoldings.reduce((sum, holding) => sum + (holding.amount * holding.avgPrice), 0);
  const totalPnL = totalValue - totalCost;
  const totalPnLPercentage = totalCost > 0 ? ((totalPnL / totalCost) * 100) : 0;

  const handleAddHolding = () => {
    if (formData.symbol && formData.name && formData.amount && formData.avgPrice) {
      const newHolding = {
        symbol: formData.symbol.toUpperCase(),
        name: formData.name,
        amount: parseFloat(formData.amount),
        avgPrice: parseFloat(formData.avgPrice),
        purchaseDate: formData.purchaseDate || new Date().toISOString().split('T')[0],
        coinId: formData.coinId || formData.symbol.toLowerCase()
      };

      addHolding(newHolding, {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Portfolio holding added successfully"
          });
          setFormData({ symbol: '', name: '', amount: '', avgPrice: '', purchaseDate: '', coinId: '' });
          setShowAddForm(false);
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "Failed to add holding. Please try again.",
            variant: "destructive"
          });
          console.error('Add holding error:', error);
        }
      });
    }
  };

  const handleEditHolding = (id: string) => {
    const holding = holdings.find(h => h.id === id);
    if (holding) {
      setFormData({
        symbol: holding.symbol,
        name: holding.name,
        amount: holding.amount.toString(),
        avgPrice: holding.avgPrice.toString(),
        purchaseDate: holding.purchaseDate,
        coinId: holding.coinId
      });
      setEditingId(id);
      setShowAddForm(true);
    }
  };

  const handleUpdateHolding = () => {
    if (editingId && formData.symbol && formData.name && formData.amount && formData.avgPrice) {
      const updates = {
        id: editingId,
        symbol: formData.symbol.toUpperCase(),
        name: formData.name,
        amount: parseFloat(formData.amount),
        avgPrice: parseFloat(formData.avgPrice),
        purchaseDate: formData.purchaseDate,
        coinId: formData.coinId || formData.symbol.toLowerCase()
      };

      updateHolding(updates, {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Portfolio holding updated successfully"
          });
          setFormData({ symbol: '', name: '', amount: '', avgPrice: '', purchaseDate: '', coinId: '' });
          setShowAddForm(false);
          setEditingId(null);
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "Failed to update holding. Please try again.",
            variant: "destructive"
          });
          console.error('Update holding error:', error);
        }
      });
    }
  };

  const handleDeleteHolding = (id: string) => {
    deleteHolding(id, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Portfolio holding deleted successfully"
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to delete holding. Please try again.",
          variant: "destructive"
        });
        console.error('Delete holding error:', error);
      }
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  if (error) {
    return (
      <AuthWrapper>
        <div className="min-h-screen bg-black text-white">
          <Header />
          <div className="pt-20 p-8">
            <div className="max-w-7xl mx-auto text-center">
              <h1 className="text-4xl font-bold text-red-400 mb-4">Error Loading Portfolio</h1>
              <p className="text-gray-400">Please try refreshing the page</p>
            </div>
          </div>
        </div>
      </AuthWrapper>
    );
  }

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-full blur-3xl animate-pulse" />
        </div>

        <Header />
        <div className="pt-20 p-8 relative z-10">
          <div className="max-w-7xl mx-auto">
            {/* Enhanced Portfolio Overview */}
            <header className="mb-8 text-center">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <Sparkles className="w-8 h-8 text-red-400 animate-pulse" />
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                  Portfolio Manager
                </h1>
                <Sparkles className="w-8 h-8 text-orange-400 animate-pulse" />
              </div>
              <div className="h-1 w-48 bg-gradient-to-r from-red-500 to-orange-400 mx-auto mb-4"></div>
              <p className="text-xl text-gray-400">Advanced Portfolio Tracking & Analytics for Professional Traders</p>
            </header>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading your portfolio...</p>
              </div>
            ) : (
              <>
                {/* Enhanced Portfolio Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <Card className="group bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-800 hover:border-red-500/30 transition-all duration-300 hover:scale-105 transform">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-400">Total Portfolio Value</CardTitle>
                      <DollarSign className="h-5 w-5 text-green-500 group-hover:scale-110 transition-transform duration-300" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">{formatCurrency(totalValue)}</div>
                      <p className={`text-xs flex items-center ${totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {totalPnL >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                        {totalPnLPercentage.toFixed(2)}%
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="group bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-800 hover:border-orange-500/30 transition-all duration-300 hover:scale-105 transform">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-400">Total Cost</CardTitle>
                      <BarChart3 className="h-5 w-5 text-blue-500 group-hover:scale-110 transition-transform duration-300" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">{formatCurrency(totalCost)}</div>
                    </CardContent>
                  </Card>

                  <Card className="group bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-800 hover:border-purple-500/30 transition-all duration-300 hover:scale-105 transform">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-400">Total P&L</CardTitle>
                      <PieChart className="h-5 w-5 text-orange-500 group-hover:scale-110 transition-transform duration-300" />
                    </CardHeader>
                    <CardContent>
                      <div className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {formatCurrency(totalPnL)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="group bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-800 hover:border-green-500/30 transition-all duration-300 hover:scale-105 transform">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-400">Holdings</CardTitle>
                      <TrendingUp className="h-5 w-5 text-purple-500 group-hover:scale-110 transition-transform duration-300" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">{holdings.length}</div>
                      <p className="text-xs text-gray-400">Assets</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Portfolio Analytics */}
                <PortfolioAnalytics holdings={updatedHoldings} />

                {/* Add/Edit Form */}
                {showAddForm && (
                  <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-800 mb-8 hover:border-red-500/30 transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold text-white">
                        {editingId ? 'Edit Holding' : 'Add New Holding'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <Input
                          placeholder="Symbol (e.g., BTC)"
                          value={formData.symbol}
                          onChange={(e) => setFormData({...formData, symbol: e.target.value})}
                          className="bg-gray-800 border-gray-700 text-white focus:border-red-500 transition-colors duration-300"
                        />
                        <Input
                          placeholder="Name (e.g., Bitcoin)"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="bg-gray-800 border-gray-700 text-white focus:border-red-500 transition-colors duration-300"
                        />
                        <Input
                          placeholder="Coin ID (e.g., bitcoin)"
                          value={formData.coinId}
                          onChange={(e) => setFormData({...formData, coinId: e.target.value})}
                          className="bg-gray-800 border-gray-700 text-white focus:border-red-500 transition-colors duration-300"
                        />
                        <Input
                          placeholder="Amount"
                          type="number"
                          step="0.00000001"
                          value={formData.amount}
                          onChange={(e) => setFormData({...formData, amount: e.target.value})}
                          className="bg-gray-800 border-gray-700 text-white focus:border-red-500 transition-colors duration-300"
                        />
                        <Input
                          placeholder="Avg Price"
                          type="number"
                          step="0.01"
                          value={formData.avgPrice}
                          onChange={(e) => setFormData({...formData, avgPrice: e.target.value})}
                          className="bg-gray-800 border-gray-700 text-white focus:border-red-500 transition-colors duration-300"
                        />
                        <Input
                          type="date"
                          value={formData.purchaseDate}
                          onChange={(e) => setFormData({...formData, purchaseDate: e.target.value})}
                          className="bg-gray-800 border-gray-700 text-white focus:border-red-500 transition-colors duration-300"
                        />
                      </div>
                      <div className="flex gap-4 mt-6">
                        <Button
                          onClick={editingId ? handleUpdateHolding : handleAddHolding}
                          disabled={isAddingHolding || isUpdatingHolding}
                          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all duration-300 hover:scale-105 transform"
                        >
                          {isAddingHolding || isUpdatingHolding ? 'Processing...' : editingId ? 'Update' : 'Add'} Holding
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowAddForm(false);
                            setEditingId(null);
                            setFormData({ symbol: '', name: '', amount: '', avgPrice: '', purchaseDate: '', coinId: '' });
                          }}
                          className="border-gray-600 text-white hover:bg-gray-800 transition-all duration-300 hover:scale-105 transform"
                        >
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Holdings Table */}
                <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-800 hover:border-red-500/30 transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-xl font-semibold text-white">Your Holdings</CardTitle>
                    <Button
                      onClick={() => setShowAddForm(true)}
                      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all duration-300 hover:scale-105 transform"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Holding
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-sm text-gray-400 border-b border-gray-800">
                            <th className="pb-4">Asset</th>
                            <th className="pb-4">Amount</th>
                            <th className="pb-4">Avg Price</th>
                            <th className="pb-4">Current Price</th>
                            <th className="pb-4">Value</th>
                            <th className="pb-4">P&L</th>
                            <th className="pb-4">P&L %</th>
                            <th className="pb-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {updatedHoldings.map((holding) => {
                            const value = holding.amount * holding.currentPrice;
                            const cost = holding.amount * holding.avgPrice;
                            const pnl = value - cost;
                            const pnlPercentage = cost > 0 ? ((pnl / cost) * 100) : 0;

                            return (
                              <tr key={holding.id} className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-all duration-300">
                                <td className="py-4">
                                  <div>
                                    <p className="font-medium text-white">{holding.name}</p>
                                    <p className="text-sm text-gray-400">{holding.symbol}</p>
                                  </div>
                                </td>
                                <td className="py-4 text-white">{holding.amount.toFixed(8)}</td>
                                <td className="py-4 text-white">{formatCurrency(holding.avgPrice)}</td>
                                <td className="py-4 text-white">{formatCurrency(holding.currentPrice)}</td>
                                <td className="py-4 text-white font-medium">{formatCurrency(value)}</td>
                                <td className={`py-4 font-medium ${pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                  {formatCurrency(pnl)}
                                </td>
                                <td className={`py-4 font-medium ${pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                  {pnlPercentage.toFixed(2)}%
                                </td>
                                <td className="py-4">
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleEditHolding(holding.id)}
                                      disabled={isUpdatingHolding}
                                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-all duration-300 hover:scale-110 transform"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleDeleteHolding(holding.id)}
                                      disabled={isDeletingHolding}
                                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300 hover:scale-110 transform"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      {holdings.length === 0 && (
                        <div className="text-center py-8">
                          <p className="text-gray-400 text-lg">No holdings found</p>
                          <p className="text-gray-500 text-sm">Add your first holding to get started</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
};

export default Portfolio;
