
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import CoinSearchDropdown, { CoinDropdownItem } from "./CoinSearchDropdown";
import { useState } from "react";

interface CoinSelectorProps {
  selectedCoin: CoinDropdownItem | null;
  onCoinSelect: (coin: CoinDropdownItem | null) => void;
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
  // When switching between modes, clear state accordingly
  const handleCustomCoinToggle = (toCustom: boolean) => {
    onToggleCustomCoin(toCustom);
    if (toCustom) {
      onCoinSelect(null);
    } else {
      onCustomCoinNameChange('');
    }
  };

  // When a custom coin is requested from dropdown button
  const handleCustomCoinRequested = () => {
    handleCustomCoinToggle(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Button
          type="button"
          variant={!isCustomCoin ? "default" : "outline"}
          size="sm"
          onClick={() => handleCustomCoinToggle(false)}
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
          onClick={() => handleCustomCoinToggle(true)}
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

      {/* CoinGecko Selection Mode */}
      {!isCustomCoin && (
        <div>
          <Label className="text-gray-300">Select Cryptocurrency</Label>
          <CoinSearchDropdown
            selectedCoin={selectedCoin}
            onCoinSelect={onCoinSelect}
            onCustomCoinRequested={handleCustomCoinRequested}
            placeholder="Search for a cryptocurrency..."
            isCustomCoinMode={isCustomCoin}
          />
          <p className="text-sm text-gray-400 mt-1">
            Choose from top cryptocurrencies ranked by market cap or add your own coin if not listed.
          </p>
        </div>
      )}

      {/* Custom Coin Mode */}
      {isCustomCoin && (
        <div>
          <Label htmlFor="custom-coin" className="text-gray-300">
            Custom Coin Name/Symbol
          </Label>
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
