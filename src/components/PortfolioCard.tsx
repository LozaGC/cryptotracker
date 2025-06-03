
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, TrendingUp, TrendingDown, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PortfolioCard = () => {
  const navigate = useNavigate();

  // Mock portfolio data
  const portfolioData = {
    totalValue: 41550.00,
    totalCost: 28940.00,
    totalPnL: 12610.00,
    holdings: [
      { symbol: 'BTC', name: 'Bitcoin', value: 33500.00, percentage: 48.89 },
      { symbol: 'ETH', name: 'Ethereum', value: 8050.00, percentage: 25.00 }
    ]
  };

  const pnlPercentage = ((portfolioData.totalPnL / portfolioData.totalCost) * 100);

  return (
    <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-800 hover:border-red-500/30 transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-semibold text-white">Portfolio Overview</CardTitle>
        <PieChart className="h-6 w-6 text-red-500" />
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Portfolio Stats */}
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-400">Total Value</p>
            <p className="text-2xl font-bold text-white">
              ${portfolioData.totalValue.toLocaleString()}
            </p>
            <div className={`flex items-center text-sm ${portfolioData.totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {portfolioData.totalPnL >= 0 ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              ${Math.abs(portfolioData.totalPnL).toLocaleString()} ({pnlPercentage.toFixed(2)}%)
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Total Cost</p>
              <p className="text-lg font-semibold text-white">
                ${portfolioData.totalCost.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Holdings</p>
              <p className="text-lg font-semibold text-white">
                {portfolioData.holdings.length} Assets
              </p>
            </div>
          </div>
        </div>

        {/* Top Holdings */}
        <div>
          <h4 className="text-sm font-medium text-gray-400 mb-3">Top Holdings</h4>
          <div className="space-y-3">
            {portfolioData.holdings.map((holding, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div>
                  <p className="font-medium text-white">{holding.name}</p>
                  <p className="text-sm text-gray-400">{holding.symbol}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-white">${holding.value.toLocaleString()}</p>
                  <p className="text-sm text-gray-400">{holding.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Button
            onClick={() => navigate('/portfolio')}
            className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
          >
            View Details
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/portfolio')}
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioCard;
