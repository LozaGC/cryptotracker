
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, TrendingUp, TrendingDown } from "lucide-react";

const MarketPulse = () => {
  // Mock market pulse data
  const pulseData = {
    status: "Strong",
    signals: [
      { name: "Trading Volume", status: "High", trend: "up", value: "152%" },
      { name: "Volatility", status: "Medium", trend: "down", value: "28%" },
      { name: "Liquidity", status: "High", trend: "up", value: "94%" },
      { name: "Network Activity", status: "Very High", trend: "up", value: "186%" }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'very high':
      case 'high':
      case 'strong': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'low':
      case 'weak': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-800 hover:border-red-500/30 transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-400">Market Pulse</CardTitle>
        <Zap className="h-4 w-4 text-orange-500" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${getStatusColor(pulseData.status)}`}>
              {pulseData.status}
            </div>
            <p className="text-xs text-gray-400">Market Momentum</p>
          </div>

          <div className="space-y-3">
            {pulseData.signals.map((signal, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-300">{signal.name}</p>
                  <p className={`text-xs ${getStatusColor(signal.status)}`}>
                    {signal.status}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-white font-medium">
                    {signal.value}
                  </span>
                  {signal.trend === 'up' ? (
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-500" />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-gray-700">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-xs text-gray-400">Live market analysis</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketPulse;
