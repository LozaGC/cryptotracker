import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { AddAssetRequest, PortfolioEntry } from "@/services/portfolioApiService";

interface AddAssetFormProps {
  onAssetAdded: () => void;
  onAddAsset: (data: AddAssetRequest) => Promise<PortfolioEntry>;
  isLoading: boolean;
}

const AddAssetForm = ({ onAssetAdded, onAddAsset, isLoading }: AddAssetFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    symbol: '',
    quantity: '',
    use_real_time_price: true,
    custom_price: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.symbol || !formData.quantity) {
      toast({
        title: "Validation Error",
        description: "Symbol and quantity are required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.use_real_time_price && !formData.custom_price) {
      toast({
        title: "Validation Error", 
        description: "Custom price is required when not using real-time price",
        variant: "destructive",
      });
      return;
    }

    try {
      await onAddAsset({
        symbol: formData.symbol.trim().toUpperCase(),
        quantity: parseFloat(formData.quantity),
        use_real_time_price: formData.use_real_time_price,
        custom_price: formData.custom_price ? parseFloat(formData.custom_price) : undefined
      });
      
      setFormData({
        symbol: '',
        quantity: '',
        use_real_time_price: true,
        custom_price: ''
      });
      
      onAssetAdded();
      
      toast({
        title: "Success",
        description: "Asset added to portfolio successfully!",
      });
    } catch (error) {
      console.error('Add asset error:', error);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-800 hover:border-red-500/30 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-white flex items-center space-x-2">
          <TrendingUp className="w-6 h-6 text-red-400" />
          <span>Add New Asset</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="symbol" className="text-gray-300">Symbol</Label>
              <Input
                id="symbol"
                placeholder="e.g., BTC, ETH"
                value={formData.symbol}
                onChange={(e) => setFormData({...formData, symbol: e.target.value})}
                className="bg-gray-800 border-gray-700 text-white focus:border-red-500 transition-colors duration-300"
              />
            </div>
            <div>
              <Label htmlFor="quantity" className="text-gray-300">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                step="0.00000001"
                placeholder="0.5"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                className="bg-gray-800 border-gray-700 text-white focus:border-red-500 transition-colors duration-300"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="use-real-time"
              checked={formData.use_real_time_price}
              onCheckedChange={(checked) => setFormData({
                ...formData, 
                use_real_time_price: checked,
                custom_price: checked ? '' : formData.custom_price
              })}
              className="data-[state=checked]:bg-red-600"
            />
            <Label htmlFor="use-real-time" className="text-gray-300">
              Use real-time price from CoinGecko
            </Label>
          </div>

          {!formData.use_real_time_price && (
            <div>
              <Label htmlFor="custom-price" className="text-gray-300">Custom Price (USD)</Label>
              <Input
                id="custom-price"
                type="number"
                step="0.01"
                placeholder="28000"
                value={formData.custom_price}
                onChange={(e) => setFormData({...formData, custom_price: e.target.value})}
                className="bg-gray-800 border-gray-700 text-white focus:border-red-500 transition-colors duration-300"
              />
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all duration-300 hover:scale-105 transform"
          >
            <Plus className="w-4 h-4 mr-2" />
            {isLoading ? 'Adding Asset...' : 'Add Asset'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddAssetForm;
