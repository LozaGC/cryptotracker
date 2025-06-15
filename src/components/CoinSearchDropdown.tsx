
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Coin {
  id: string;
  symbol: string;
  name: string;
  market_cap_rank?: number | null;
}

interface CoinSearchDropdownProps {
  selectedCoin: Coin | null;
  onCoinSelect: (coin: Coin | null) => void;
  placeholder?: string;
}

const CoinSearchDropdown = ({ selectedCoin, onCoinSelect, placeholder = "Select coin..." }: CoinSearchDropdownProps) => {
  const [open, setOpen] = useState(false);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch coins from CoinGecko market data (top 1000 by market cap)
  useEffect(() => {
    const fetchCoins = async () => {
      setLoading(true);
      try {
        console.log('Fetching coins from CoinGecko...');
        // Use markets endpoint which gives us ranked coins with better performance
        // Fetch top 1000 coins in batches of 250 (API limit per page)
        const allCoins: Coin[] = [];
        
        for (let page = 1; page <= 4; page++) {
          const response = await fetch(
            `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=${page}&sparkline=false&locale=en`
          );
          
          if (!response.ok) throw new Error('Failed to fetch coins');
          
          const marketData = await response.json();
          
          const formattedCoins: Coin[] = marketData.map((coin: any) => ({
            id: coin.id,
            symbol: coin.symbol.toUpperCase(),
            name: coin.name,
            market_cap_rank: coin.market_cap_rank
          }));

          allCoins.push(...formattedCoins);
        }

        console.log(`Fetched ${allCoins.length} coins successfully`);
        setCoins(allCoins);
      } catch (error) {
        console.error('Error fetching coins:', error);
        // Fallback to basic coin list if market data fails
        try {
          const fallbackResponse = await fetch('https://api.coingecko.com/api/v3/coins/list');
          const fallbackData = await fallbackResponse.json();
          const fallbackCoins = fallbackData.slice(0, 100).map((coin: any, index: number) => ({
            id: coin.id,
            symbol: coin.symbol.toUpperCase(),
            name: coin.name,
            market_cap_rank: index + 1
          }));
          console.log(`Fallback: Fetched ${fallbackCoins.length} coins`);
          setCoins(fallbackCoins);
        } catch (fallbackError) {
          console.error('Fallback fetch failed:', fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, []);

  // Filter coins based on search query
  const filteredCoins = useMemo(() => {
    if (!searchQuery) return coins.slice(0, 50); // Show only top 50 initially for performance
    
    const query = searchQuery.toLowerCase();
    return coins.filter(coin => 
      coin.name.toLowerCase().includes(query) || 
      coin.symbol.toLowerCase().includes(query)
    ).slice(0, 100); // Limit results for performance
  }, [coins, searchQuery]);

  const handleCoinSelect = (coin: Coin) => {
    console.log('Coin selected:', coin);
    onCoinSelect(coin);
    setOpen(false);
    setSearchQuery("");
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
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-gray-800 border-gray-700" align="start">
        <Command className="bg-gray-800" shouldFilter={false}>
          <CommandInput 
            placeholder="Search coins..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="text-white bg-gray-800 border-gray-700"
          />
          <CommandList className="max-h-60 bg-gray-800">
            <CommandEmpty className="text-gray-400 p-4">
              {loading ? "Loading coins..." : "No coins found."}
            </CommandEmpty>
            <CommandGroup className="bg-gray-800">
              {filteredCoins.map((coin) => (
                <CommandItem
                  key={coin.id}
                  value={coin.id}
                  onSelect={() => handleCoinSelect(coin)}
                  className="text-white hover:bg-gray-700 cursor-pointer bg-gray-800 flex items-center gap-2"
                >
                  <Check
                    className={cn(
                      "h-4 w-4",
                      selectedCoin?.id === coin.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex items-center gap-2 flex-1">
                    <span className="font-medium">{coin.symbol}</span>
                    <span className="text-gray-400">- {coin.name}</span>
                    {coin.market_cap_rank && (
                      <span className="text-xs text-gray-500 ml-auto">#{coin.market_cap_rank}</span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CoinSearchDropdown;
