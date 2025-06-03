
import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const fetchBitcoinPrice = async (days: number) => {
  const response = await fetch(`https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${days}`);
  if (!response.ok) throw new Error('Failed to fetch Bitcoin price data');
  return response.json();
};

const CryptoChart = () => {
  const [timeframe, setTimeframe] = useState(7);

  const { data, isLoading } = useQuery({
    queryKey: ['bitcoinChart', timeframe],
    queryFn: () => fetchBitcoinPrice(timeframe),
    refetchInterval: 300000,
  });

  const chartData = data?.prices?.map((price: [number, number]) => ({
    timestamp: new Date(price[0]).toLocaleDateString(),
    price: price[1]
  })) || [];

  const timeframes = [
    { label: '1D', days: 1 },
    { label: '7D', days: 7 },
    { label: '30D', days: 30 },
    { label: '90D', days: 90 }
  ];

  return (
    <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-white">Bitcoin Price Chart</CardTitle>
          <div className="flex space-x-2">
            {timeframes.map((tf) => (
              <Button
                key={tf.days}
                variant={timeframe === tf.days ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeframe(tf.days)}
                className={timeframe === tf.days 
                  ? "bg-gradient-to-r from-red-600 to-red-700 text-white" 
                  : "border-gray-600 text-gray-300 hover:bg-gray-800"
                }
              >
                {tf.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-80 flex items-center justify-center">
            <div className="text-gray-400">Loading chart data...</div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="timestamp" 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Price']}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#EF4444" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#EF4444' }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default CryptoChart;
