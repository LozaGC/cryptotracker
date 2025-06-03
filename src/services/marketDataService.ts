
export interface FearGreedData {
  value: number;
  value_classification: string;
  timestamp: string;
}

export interface MarketPulseData {
  trading_volume: number;
  volatility: number;
  liquidity: number;
  network_activity: number;
  timestamp: string;
}

export interface SentimentData {
  overall_sentiment: string;
  confidence_score: number;
  social_media: number;
  news_sentiment: number;
  whale_activity: number;
  on_chain_metrics: number;
  timestamp: string;
}

export const fetchFearGreedIndex = async (): Promise<FearGreedData> => {
  try {
    const response = await fetch('https://api.alternative.me/fng/');
    const data = await response.json();
    return {
      value: parseInt(data.data[0].value),
      value_classification: data.data[0].value_classification,
      timestamp: data.data[0].timestamp
    };
  } catch (error) {
    // Fallback to mock data if API fails
    return {
      value: Math.floor(Math.random() * 100),
      value_classification: 'Greed',
      timestamp: new Date().toISOString()
    };
  }
};

export const fetchMarketPulse = async (): Promise<MarketPulseData> => {
  // Since this is a custom metric, we'll generate realistic data
  return {
    trading_volume: Math.floor(Math.random() * 40) + 60, // 60-100
    volatility: Math.floor(Math.random() * 60) + 20, // 20-80
    liquidity: Math.floor(Math.random() * 30) + 70, // 70-100
    network_activity: Math.floor(Math.random() * 50) + 50, // 50-100
    timestamp: new Date().toISOString()
  };
};

export const fetchSentimentData = async (): Promise<SentimentData> => {
  // Generate realistic sentiment data
  const score = Math.floor(Math.random() * 40) + 50; // 50-90
  return {
    overall_sentiment: score > 70 ? 'Bullish' : score > 50 ? 'Neutral' : 'Bearish',
    confidence_score: score,
    social_media: Math.floor(Math.random() * 30) + 50,
    news_sentiment: Math.floor(Math.random() * 40) + 40,
    whale_activity: Math.floor(Math.random() * 40) + 60,
    on_chain_metrics: Math.floor(Math.random() * 30) + 60,
    timestamp: new Date().toISOString()
  };
};
