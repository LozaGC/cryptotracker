
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Bot, User, Brain, TrendingUp, Zap } from "lucide-react";
import Header from "@/components/Header";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm your AI trading assistant. I can help you analyze crypto markets, provide trading insights, and answer questions about your portfolio. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(input),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('bitcoin') || input.includes('btc')) {
      return "Based on current market analysis, Bitcoin is showing strong momentum above the $65,000 support level. Technical indicators suggest a potential breakout towards $75,000, but watch for resistance at $70,000. Consider dollar-cost averaging if you're looking to accumulate.";
    }
    
    if (input.includes('ethereum') || input.includes('eth')) {
      return "Ethereum is displaying bullish patterns with the upcoming network upgrades. The ETH/BTC ratio is strengthening, indicating outperformance potential. Key levels to watch: Support at $3,200, resistance at $4,000.";
    }
    
    if (input.includes('portfolio') || input.includes('holdings')) {
      return "Your portfolio shows a healthy diversification across major cryptocurrencies. Consider rebalancing if any single asset exceeds 40% of your total holdings. The current risk-reward ratio looks favorable for long-term growth.";
    }
    
    if (input.includes('market') || input.includes('trend')) {
      return "The overall crypto market sentiment is cautiously optimistic. We're seeing increased institutional adoption and regulatory clarity. Key factors to monitor: Federal Reserve policy, institutional inflows, and regulatory developments.";
    }
    
    if (input.includes('buy') || input.includes('sell') || input.includes('trade')) {
      return "For trading decisions, I recommend analyzing multiple timeframes and using proper risk management. Set stop-losses at 2-3% below entry points and consider taking profits at predefined targets. Never risk more than 1-2% of your portfolio on a single trade.";
    }
    
    return "I can help you with crypto market analysis, trading strategies, portfolio management, and technical analysis. Try asking about specific cryptocurrencies, market trends, or trading advice!";
  };

  const quickQuestions = [
    "What's the Bitcoin outlook?",
    "Analyze my portfolio",
    "Market sentiment today?",
    "Best trading strategy?"
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="pt-20 p-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8 text-center">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30">
                <Brain className="w-8 h-8 text-red-400" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                AI Neural Assistant
              </h1>
            </div>
            <p className="text-gray-400">Advanced Crypto Analysis Engine</p>
          </header>

          {/* Chat Container */}
          <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-800 mb-6">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white flex items-center">
                <Bot className="w-6 h-6 mr-2 text-red-400" />
                Chat Interface
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Messages */}
              <div className="h-96 overflow-y-auto mb-4 space-y-4 scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-red-500">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white'
                          : 'bg-gray-800 text-gray-100 border border-gray-700'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        <div className="flex-shrink-0">
                          {message.type === 'user' ? (
                            <User className="w-4 h-4 mt-0.5" />
                          ) : (
                            <Bot className="w-4 h-4 mt-0.5 text-red-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-800 border border-gray-700 px-4 py-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Bot className="w-4 h-4 text-red-400" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Questions */}
              <div className="mb-4">
                <p className="text-sm text-gray-400 mb-2">Quick questions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setInput(question)}
                      className="text-xs border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-red-500"
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Input Area */}
              <div className="flex space-x-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask me anything about crypto trading..."
                  className="flex-1 bg-gray-800 border-gray-700 text-white"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isLoading}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* AI Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-800 hover:border-red-500/30 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Market Analysis</h3>
                <p className="text-gray-400 text-sm">Real-time analysis of crypto markets with AI-powered insights.</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-800 hover:border-red-500/30 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <Brain className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Predictive Modeling</h3>
                <p className="text-gray-400 text-sm">Advanced algorithms predict price movements and market trends.</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-800 hover:border-red-500/30 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <Zap className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Instant Insights</h3>
                <p className="text-gray-400 text-sm">Get immediate answers to your trading questions and strategies.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
