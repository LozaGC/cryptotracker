
import Header from "@/components/Header";
import { Filter, Search, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Screener = () => {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-red-500/10 to-yellow-500/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-yellow-500/10 to-red-500/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-gradient-to-r from-red-500/10 to-yellow-500/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>
      
      <Header />
      <div className="pt-20 p-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-red-500/20 to-yellow-500/20 border border-red-500/30 shadow-lg shadow-red-500/20">
                <Filter className="w-8 h-8 text-red-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-red-400 via-yellow-400 to-red-400 bg-clip-text text-transparent">
                  Crypto Screener
                </h1>
                <p className="text-gray-400 flex items-center space-x-2">
                  <Search className="w-4 h-4 text-yellow-400" />
                  <span>Find and filter cryptocurrencies based on your criteria</span>
                </p>
              </div>
            </div>
          </header>

          {/* Search and Filter Section */}
          <Card className="mb-8 bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-red-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Filter className="w-5 h-5 text-red-400" />
                <span>Filter Cryptocurrencies</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Search
                  </label>
                  <Input
                    placeholder="Search by name or symbol..."
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Market Cap Range
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Min"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                    <Input
                      placeholder="Max"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Price Range
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Min $"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                    <Input
                      placeholder="Max $"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4 flex space-x-4">
                <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">
                  Apply Filters
                </Button>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Preview */}
          <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-red-500/20">
            <CardHeader>
              <CardTitle className="text-white">Screener Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-red-500/20 to-yellow-500/20 border border-red-500/30 mb-4">
                  <TrendingUp className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Ready to Screen
                </h3>
                <p className="text-gray-400 mb-4">
                  Apply filters above to find cryptocurrencies that match your criteria
                </p>
                <div className="flex justify-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span>Top Gainers</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingDown className="w-4 h-4 text-red-400" />
                    <span>Top Losers</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Screener;
