
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { TrendingUp, Menu, X, BarChart3, PieChart, MessageCircle, Sparkles } from "lucide-react";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: TrendingUp },
    { path: "/market", label: "Market", icon: BarChart3 },
    { path: "/portfolio", label: "Portfolio", icon: PieChart },
    { path: "/nft", label: "NFT", icon: Sparkles },
    { path: "/chat", label: "Chat AI", icon: MessageCircle },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
      <nav className="max-w-7xl mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <div className="p-2 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 group-hover:from-red-700 group-hover:to-orange-700 transition-all duration-300 group-hover:scale-110 transform">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              Coin Rich
            </span>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex items-center space-x-6">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`group flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                    isActive(item.path)
                      ? "bg-gradient-to-r from-red-600/30 to-orange-600/30 text-red-400 border border-red-500/50 shadow-lg shadow-red-500/25"
                      : "text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-gray-800/70 hover:to-gray-700/70 hover:shadow-lg hover:border hover:border-gray-600/50"
                  }`}
                >
                  <item.icon className={`w-4 h-4 transition-all duration-300 ${isActive(item.path) ? 'text-red-400' : 'group-hover:text-orange-400'}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Authentication Buttons - Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            <SignedOut>
              <SignInButton>
                <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-orange-600 text-white px-6 py-2 rounded-lg transition-all duration-300 hover:scale-105 transform hover:shadow-lg hover:shadow-red-500/30">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton>
                <Button variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-400 px-6 py-2 rounded-lg transition-all duration-300 hover:scale-105 transform">
                  Sign Up
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10 rounded-lg border-2 border-red-500/30 hover:border-red-400/60 transition-all duration-300 hover:scale-110 transform"
                  }
                }}
              />
            </SignedIn>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-all duration-300 hover:scale-110 transform"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-800">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setIsMenuOpen(false);
                  }}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 hover:scale-105 transform ${
                    isActive(item.path)
                      ? "bg-gradient-to-r from-red-600/20 to-orange-600/20 text-red-400 border border-red-500/30"
                      : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              ))}
              
              {/* Mobile Auth */}
              <div className="pt-4 border-t border-gray-800 space-y-2">
                <SignedOut>
                  <SignInButton>
                    <Button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-orange-600 text-white rounded-lg">
                      Sign In
                    </Button>
                  </SignInButton>
                  <SignUpButton>
                    <Button variant="outline" className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10">
                      Sign Up
                    </Button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <div className="flex justify-center">
                    <UserButton />
                  </div>
                </SignedIn>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
