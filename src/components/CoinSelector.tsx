
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Coin {
  id: string;
  symbol: string;
  name: string;
}

interface CoinSelectorProps {
  selectedCoin: Coin | null;
  onCoinSelect: (coin: Coin | null) => void;
  customCoinName: string;
  onCustomCoinNameChange: (name: string) => void;
  isCustomCoin: boolean;
  onToggleCustomCoin: (isCustom: boolean) => void;
}

const CoinSelector = ({
  selectedCoin,
  onCoinSelect,
  customCoinName,
  onCustomCoinNameChange,
  isCustomCoin,
  onToggleCustomCoin,
}: CoinSelectorProps) => {
  const [coinSymbol, setCoinSymbol] = useState(selectedCoin?.symbol || '');

  const handleCoinSymbolChange = (value: string) => {
    setCoinSymbol(value);
    if (value) {
      onCoinSelect({
        id: value.toLowerCase(),
        symbol: value.toUpperCase(),
        name: value.toUpperCase()
      });
    } else {
      onCoinSelect(null);
    }
  };

  const handleCustomCoinToggle = () => {
    const newIsCustom = !isCustomCoin;
    onToggleCustomCoin(newIsCustom);
    if (newIsCustom) {
      onCoinSelect(null);
      setCoinSymbol('');
    } else {
      onCustomCoinNameChange('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Button
          type="button"
          variant={!isCustomCoin ? "default" : "outline"}
          size="sm"
          onClick={() => handleCustomCoinToggle()}
          className={cn(
            "transition-all duration-200",
            !isCustomCoin 
              ? "bg-red-600 hover:bg-red-700 text-white" 
              : "border-gray-600 text-gray-300 hover:bg-gray-800"
          )}
        >
          Select Coin
        </Button>
        <Button
          type="button"
          variant={isCustomCoin ? "default" : "outline"}
          size="sm"
          onClick={handleCustomCoinToggle}
          className={cn(
            "transition-all duration-200",
            isCustomCoin 
              ? "bg-red-600 hover:bg-red-700 text-white" 
              : "border-gray-600 text-gray-300 hover:bg-gray-800"
          )}
        >
          Custom Coin
        </Button>
      </div>

      {!isCustomCoin ? (
        <div>
          <Label className="text-gray-300">Coin Symbol (e.g., BTC, ETH)</Label>
          <Input
            placeholder="BTC"
            value={coinSymbol}
            onChange={(e) => handleCoinSymbolChange(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white focus:border-red-500 transition-colors duration-300"
          />
          <p className="text-sm text-gray-400 mt-1">
            Enter the coin symbol (e.g., BTC for Bitcoin, ETH for Ethereum)
          </p>
        </div>
      ) : (
        <div>
          <Label htmlFor="custom-coin" className="text-gray-300">Custom Coin Name/Symbol</Label>
          <Input
            id="custom-coin"
            placeholder="e.g., MyToken, MTK"
            value={customCoinName}
            onChange={(e) => onCustomCoinNameChange(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white focus:border-red-500 transition-colors duration-300"
          />
        </div>
      )}
    </div>
  );
};

export default CoinSelector;
