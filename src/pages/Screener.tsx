
import React, { useState } from "react";
import VCListSidebar, { VC } from "@/components/screener/VCListSidebar";
import VCHoldingsTable from "@/components/screener/VCHoldingsTable";

const MOCK_VCS: VC[] = [
  { id: "multicoin", name: "Multicoin Capital" },
  { id: "coinbase", name: "Coinbase Ventures" },
  { id: "a16z", name: "a16z (Andreessen Horowitz)" },
  { id: "paradigm", name: "Paradigm" },
  { id: "binance", name: "Binance Labs" },
  { id: "polychain", name: "Polychain Capital" },
];

const MOCK_HOLDINGS: Record<string, { symbol: string; name: string; amount: number }[]> = {
  multicoin: [
    { symbol: "SOL", name: "Solana", amount: 120000 },
    { symbol: "LDO", name: "Lido DAO", amount: 500000 },
    { symbol: "MANTA", name: "Manta Network", amount: 20000 },
  ],
  coinbase: [
    { symbol: "UNI", name: "Uniswap", amount: 80000 },
    { symbol: "MATIC", name: "Polygon", amount: 150000 },
    { symbol: "OP", name: "Optimism", amount: 34000 },
  ],
  a16z: [
    { symbol: "FIL", name: "Filecoin", amount: 400000 },
    { symbol: "APE", name: "ApeCoin", amount: 120000 },
    { symbol: "ARB", name: "Arbitrum", amount: 55000 },
  ],
  paradigm: [
    { symbol: "ETH", name: "Ethereum", amount: 3400 },
    { symbol: "DYDX", name: "dYdX", amount: 72000 },
    { symbol: "BLUR", name: "Blur", amount: 200000 },
  ],
  binance: [
    { symbol: "BNB", name: "Binance Coin", amount: 110000 },
    { symbol: "SUI", name: "Sui", amount: 55000 },
    { symbol: "AVAX", name: "Avalanche", amount: 95000 },
  ],
  polychain: [
    { symbol: "DOT", name: "Polkadot", amount: 72000 },
    { symbol: "NEAR", name: "Near Protocol", amount: 95000 },
    { symbol: "CANTO", name: "Canto", amount: 125000 },
  ],
};

const Screener = () => {
  const [selectedVCId, setSelectedVCId] = useState<string>(MOCK_VCS[0].id);

  const selectedVC = MOCK_VCS.find((vc) => vc.id === selectedVCId);

  // Get holdings for selected VC or empty array
  const holdings = selectedVC ? MOCK_HOLDINGS[selectedVC.id] || [] : [];

  return (
    <div className="flex min-h-screen bg-black text-white">
      <VCListSidebar
        vcs={MOCK_VCS}
        selectedVCId={selectedVCId}
        onSelectVC={setSelectedVCId}
      />
      <main className="flex-1 flex flex-col items-center justify-start pt-24 px-4 sm:px-12 bg-black/90 min-h-screen overflow-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 bg-gradient-to-r from-red-400 via-yellow-400 to-red-400 bg-clip-text text-transparent">
          VC Token Holdings Screener
        </h1>
        {selectedVC && (
          <VCHoldingsTable vcName={selectedVC.name} holdings={holdings} />
        )}
      </main>
    </div>
  );
};

export default Screener;
