
import { useState, useEffect } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  const [open, setOpen] = useState(false);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/list');
        const data = await response.json();
        
        // Sort by market cap (approximate by taking first 500 coins)
        const popularCoins = data.slice(0, 500);
        setCoins(popularCoins);
      } catch (error) {
        console.error('Error fetching coins:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, []);

  const handleCoinSelect = (coin: Coin) => {
    onCoinSelect(coin);
    setOpen(false);
    onToggleCustomCoin(false);
  };

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
          onClick={() => handleCustomCoinToggle()}
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
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between bg-gray-800 border-gray-700 text-white hover:bg-gray-700 focus:border-red-500"
              >
                {selectedCoin ? (
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{selectedCoin.name}</span>
                    <span className="text-gray-400 text-sm">({selectedCoin.symbol.toUpperCase()})</span>
                  </div>
                ) : (
                  <span className="text-gray-400">Search and select a coin...</span>
                )}
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0 bg-gray-800 border-gray-700" style={{ width: 'var(--radix-popover-trigger-width)' }}>
              <Command className="bg-gray-800 border-0">
                <CommandInput 
                  placeholder="Search cryptocurrencies..." 
                  className="text-white placeholder:text-gray-400 border-0 focus:ring-0"
                />
                <CommandList className="max-h-64">
                  <CommandEmpty className="text-gray-400 py-6 text-center text-sm">
                    {loading ? "Loading coins..." : "No cryptocurrency found."}
                  </CommandEmpty>
                  <CommandGroup>
                    {coins.map((coin) => (
                      <CommandItem
                        key={coin.id}
                        value={`${coin.name} ${coin.symbol}`}
                        onSelect={() => handleCoinSelect(coin)}
                        className="text-white hover:bg-gray-700 cursor-pointer"
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{coin.name}</span>
                            <span className="text-gray-400 text-sm">({coin.symbol.toUpperCase()})</span>
                          </div>
                          <Check
                            className={cn(
                              "h-4 w-4",
                              selectedCoin?.id === coin.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
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
