
import { Button } from "@/components/ui/button";
import { ChevronRight, BarChart3, TrendingUp, Shield, Zap, Brain, Globe, Sparkles, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-8">
        {/* Enhanced Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-3xl"></div>
          
          {/* Additional floating elements */}
          <div className="absolute top-20 left-10 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
          <div className="absolute bottom-32 right-20 w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 right-10 w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
          <div className="absolute top-2/3 left-20 w-3 h-3 bg-orange-300 rounded-full animate-pulse"></div>
        </div>

        <div className="relative z-10 text-center max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <Sparkles className="w-8 h-8 text-red-400 animate-pulse" />
              <h1 className="text-7xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-red-400 to-orange-400 bg-clip-text text-transparent hover:scale-105 transition-transform duration-500 cursor-default">
                Coin Rich
              </h1>
              <Sparkles className="w-8 h-8 text-orange-400 animate-pulse" />
            </div>
            <div className="h-1 w-32 bg-gradient-to-r from-red-500 to-orange-400 mx-auto mb-8"></div>
          </div>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed hover:text-gray-200 transition-colors duration-300">
            Advanced AI-Powered Technical Analysis for the Next Generation of Crypto Traders
          </p>
          
          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto hover:text-gray-300 transition-colors duration-300">
            Harness the power of artificial intelligence to analyze market trends, predict price movements, 
            and execute profitable trading strategies with military-grade precision.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button
              onClick={() => navigate('/dashboard')}
              className="group relative overflow-hidden bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-orange-600 text-white border-0 px-8 py-4 text-lg font-semibold rounded-lg shadow-lg transition-all duration-500 hover:shadow-red-500/40 hover:shadow-2xl hover:scale-110 transform"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-orange-400 opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                <span>Launch Dashboard</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
              </div>
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-24 px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-900/5 to-transparent"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 cursor-default">
              Advanced Trading Intelligence
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Experience the future of crypto trading with our AI-powered analysis engine
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "AI Market Analysis",
                description: "Advanced machine learning algorithms analyze market patterns and predict future price movements with unprecedented accuracy.",
                color: "from-red-500/20 to-orange-500/20"
              },
              {
                icon: BarChart3,
                title: "Real-time Analytics",
                description: "Live market data processing with millisecond precision. Get instant insights on market trends and opportunities.",
                color: "from-orange-500/20 to-red-500/20"
              },
              {
                icon: TrendingUp,
                title: "Predictive Modeling",
                description: "Our neural networks process historical data to forecast market movements and identify profitable trading opportunities.",
                color: "from-red-500/20 to-orange-500/20"
              },
              {
                icon: Shield,
                title: "Risk Management",
                description: "Intelligent risk assessment tools help you protect your portfolio with automated stop-loss and position sizing.",
                color: "from-orange-500/20 to-red-500/20"
              },
              {
                icon: Zap,
                title: "Lightning Execution",
                description: "Ultra-fast trade execution with direct exchange connectivity. Never miss a trading opportunity again.",
                color: "from-red-500/20 to-orange-500/20"
              },
              {
                icon: Globe,
                title: "Global Markets",
                description: "Access to worldwide cryptocurrency exchanges with unified portfolio management and cross-exchange arbitrage.",
                color: "from-orange-500/20 to-red-500/20"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-b from-gray-900/50 to-black/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8 hover:border-red-500/50 transition-all duration-500 hover:shadow-lg hover:shadow-red-500/20 hover:scale-105 transform cursor-pointer"
              >
                <div className={`absolute inset-0 bg-gradient-to-b ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl`}></div>
                <div className="relative z-10">
                  <feature.icon className="w-12 h-12 text-red-500 mb-6 group-hover:scale-125 group-hover:text-orange-400 transition-all duration-500" />
                  <h3 className="text-xl font-semibold mb-4 text-white group-hover:text-orange-300 transition-colors duration-300">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-orange-900/20"></div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-32 h-32 bg-red-500/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-orange-500/10 rounded-full blur-2xl"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 cursor-default">
            Ready to Dominate the Markets?
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto hover:text-gray-200 transition-colors duration-300">
            Join thousands of traders who are already using Coin Rich AI to maximize their profits and minimize their risks.
          </p>
          <Button
            onClick={() => navigate('/dashboard')}
            className="group relative overflow-hidden bg-gradient-to-r from-red-600 via-red-700 to-orange-600 hover:from-red-700 hover:via-orange-600 hover:to-red-700 text-white border-0 px-12 py-6 text-xl font-bold rounded-lg shadow-xl transition-all duration-500 hover:shadow-red-500/50 hover:shadow-3xl hover:scale-110 transform"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
            <div className="flex items-center space-x-3">
              <Zap className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
              <span>Start Trading Now</span>
              <ChevronRight className="w-6 h-6 group-hover:translate-x-3 transition-transform duration-300" />
            </div>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Landing;
