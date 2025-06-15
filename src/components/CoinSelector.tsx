
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import CoinSearchDropdown from "./CoinSearchDropdown";

interface Coin {
  id: string;
  symbol: string;
  name: string;
  market_cap_rank?: number | null;
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
  const handleCustomCoinToggle = () => {
    const newIsCustom = !isCustomCoin;
    onToggleCustomCoin(newIsCustom);
    if (newIsCustom) {
      onCoinSelect(null);
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
          onClick={handleCustomCoinToggle}
          className={cn(
            "transition-all duration-200",
            !isCustomCoin 
              ? "bg-red-600 hover:bg-red-700 text-white" 
              : "border-gray-600 text-gray-300 hover:bg-gray-800"
          )}
        >
          Select from CoinGecko
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
          <Label className="text-gray-300">Select Cryptocurrency</Label>
          <CoinSearchDropdown
            selectedCoin={selectedCoin}
            onCoinSelect={onCoinSelect}
            placeholder="Search for a cryptocurrency..."
          />
          <p className="text-sm text-gray-400 mt-1">
            Choose from top cryptocurrencies ranked by market cap
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
          <p className="text-sm text-gray-400 mt-1">
            Enter your custom coin name or symbol. You'll need to provide the price manually.
          </p>
        </div>
      )}
    </div>
  );
};

export default CoinSelector;
