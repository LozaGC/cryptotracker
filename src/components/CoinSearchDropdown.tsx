
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CoinDropdownItem {
  id: string;
  symbol: string;
  name: string;
  market_cap_rank: number | null;
}

interface CoinSearchDropdownProps {
  selectedCoin: CoinDropdownItem | null;
  onCoinSelect: (coin: CoinDropdownItem | null) => void;
  onCustomCoinRequested?: () => void;
  placeholder?: string;
  isCustomCoinMode?: boolean;
}

const CoinSearchDropdown = ({
  selectedCoin,
  onCoinSelect,
  onCustomCoinRequested,
  placeholder = "Select coin...",
  isCustomCoinMode = false,
}: CoinSearchDropdownProps) => {
  const [open, setOpen] = useState(false);
  const [coins, setCoins] = useState<CoinDropdownItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch coins from CoinGecko markets endpoint
  useEffect(() => {
    let ignore = false;
    const fetchCoins = async () => {
      setLoading(true);
      try {
        console.log('Fetching coins from CoinGecko...');
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false&locale=en'
        );
        if (!response.ok) throw new Error('Failed to fetch coins');
        const marketData = await response.json();
        console.log('Raw market data sample:', marketData.slice(0, 3));
        
        const formattedCoins: CoinDropdownItem[] = marketData.map((coin: any) => ({
          id: coin.id,
          symbol: coin.symbol.toUpperCase(),
          name: coin.name,
          market_cap_rank: coin.market_cap_rank,
        }));
        
        console.log('Formatted coins sample:', formattedCoins.slice(0, 3));
        if (!ignore) setCoins(formattedCoins);
      } catch (error) {
        console.error('Error fetching coins:', error);
        if (!ignore) setCoins([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    fetchCoins();
    return () => { ignore = true; };
  }, []);

  // Filter by search
  const filteredCoins = useMemo(() => {
    if (!searchQuery) return coins.slice(0, 50); // Limit initial results
    const q = searchQuery.toLowerCase();
    return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(q) ||
        coin.symbol.toLowerCase().includes(q)
    );
  }, [coins, searchQuery]);

  // Show the dropdown only if not in custom coin mode
  if (isCustomCoinMode) return null;

  const handleCoinSelect = (coin: CoinDropdownItem) => {
    console.log('CoinSearchDropdown: handleCoinSelect called with:', coin);
    onCoinSelect(coin);
    setOpen(false);
    setSearchQuery("");
  };

  const handleCustomCoinSelect = () => {
    console.log('Custom coin option selected');
    setOpen(false);
    onCoinSelect(null);
    if (onCustomCoinRequested) {
      onCustomCoinRequested();
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
        >
          {selectedCoin ? (
            <span className="flex items-center gap-2">
              <span className="font-medium">{selectedCoin.symbol}</span>
              <span className="text-gray-400">- {selectedCoin.name}</span>
            </span>
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full p-0 bg-gray-800 border-gray-700"
        align="start"
        style={{ width: "var(--radix-popover-trigger-width)", maxHeight: 400, overflowY: 'auto', zIndex: 9999 }}
      >
        <Command className="bg-gray-800">
          <CommandInput
            placeholder="Search coins..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="text-white bg-gray-800 border-gray-700"
          />
          <CommandList className="max-h-60">
            <CommandEmpty className="text-gray-400 p-4">
              {loading ? "Loading coins..." : "No coins found."}
            </CommandEmpty>
            <CommandGroup>
              {filteredCoins.map((coin) => (
                <CommandItem
                  key={coin.id}
                  value={coin.id}
                  onSelect={() => handleCoinSelect(coin)}
                  className={cn(
                    "text-white cursor-pointer hover:bg-red-900/60 active:bg-red-900/80 transition-colors duration-200",
                    selectedCoin?.id === coin.id ? "bg-red-900/40" : ""
                  )}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedCoin?.id === coin.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex items-center gap-2 flex-1">
                    <span className="font-medium">{coin.symbol}</span>
                    <span className="text-gray-400">- {coin.name}</span>
                    {coin.market_cap_rank && (
                      <span className="text-xs text-gray-500 ml-auto">
                        #{coin.market_cap_rank}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
              {/* Custom coin option */}
              <CommandItem
                key="add-own-coin"
                value="add-own-coin"
                onSelect={handleCustomCoinSelect}
                className="text-white hover:bg-green-900/60 active:bg-green-900/80 cursor-pointer border-t border-gray-700 mt-1 transition-colors duration-200"
              >
                <Plus className="mr-2 h-4 w-4 text-green-400" />
                <div className="flex items-center gap-2 flex-1 text-green-400">
                  Add Your Own Coin (Custom)
                </div>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CoinSearchDropdown;
