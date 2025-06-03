
import MarketStats from "@/components/MarketStats";
import CryptoChart from "@/components/CryptoChart";
import PortfolioCard from "@/components/PortfolioCard";
import CryptoList from "@/components/CryptoList";
import FearGreedIndex from "@/components/FearGreedIndex";
import SentimentAnalysis from "@/components/SentimentAnalysis";
import MarketPulse from "@/components/MarketPulse";
import { Button } from "@/components/ui/button";
import { MessageCircle, Zap, Brain, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background Elements with Brand Colors */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-red-500/10 to-yellow-500/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-yellow-500/10 to-red-500/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-gradient-to-r from-red-500/10 to-yellow-500/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>
      
      <Header />
      <div className="pt-20 p-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8 relative">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-red-500/20 to-yellow-500/20 border border-red-500/30 shadow-lg shadow-red-500/20">
                <Brain className="w-8 h-8 text-red-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-red-400 via-yellow-400 to-red-400 bg-clip-text text-transparent">
                  AI Trading Dashboard
                </h1>
                <p className="text-gray-400 flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span>Real-time market analysis powered by advanced AI</span>
                </p>
              </div>
            </div>
            
            {/* Enhanced Chat AI Button with Brand Colors */}
            <div className="absolute top-0 right-0">
              <Button
                onClick={() => navigate('/chat')}
                className="group relative overflow-hidden bg-gradient-to-r from-red-600 via-yellow-600 to-red-500 hover:from-red-700 hover:via-yellow-700 hover:to-red-600 text-black border-0 px-8 py-4 rounded-2xl font-semibold shadow-2xl shadow-red-500/40 transition-all duration-300 hover:shadow-3xl hover:shadow-red-500/60 hover:scale-105 btn-futuristic"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-red-400 to-yellow-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 animate-pulse-subtle"></div>
                <div className="flex items-center space-x-3">
                  <MessageCircle className="w-6 h-6" />
                  <span className="text-lg">Chat with AI</span>
                  <Target className="w-5 h-5 animate-spin" />
                </div>
              </Button>
            </div>
          </header>
          
          <MarketStats />
          
          {/* Real-time Sentiment Analysis Section with Brand Colors */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <FearGreedIndex />
            <SentimentAnalysis />
            <MarketPulse />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <div className="glass-card rounded-xl border border-red-500/20 shadow-lg shadow-red-500/10 bg-gradient-to-br from-gray-900/50 to-gray-800/30 p-2">
                <CryptoChart />
              </div>
            </div>
            <div>
              <PortfolioCard />
            </div>
          </div>
          
          <div className="glass-card rounded-xl border border-red-500/20 shadow-lg shadow-red-500/10 bg-gradient-to-br from-gray-900/50 to-gray-800/30">
            <CryptoList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
