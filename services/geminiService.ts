import { GoogleGenAI } from "@google/genai";

const CACHE_KEY = 'bnb_yield_market_insight';
const BLOCKED_UNTIL_KEY = 'bnb_yield_gemini_blocked_until';
const CACHE_EXPIRY = 30 * 60 * 1000; // 30 minutes
const QUOTA_COOLDOWN = 60 * 60 * 1000; // 1 hour cooldown after quota error

interface CachedInsight {
  text: string;
  timestamp: number;
  vipLevel: number;
}

const fallbacks = [
  "BNB is maintaining a strong support level today. A perfect environment for high-velocity 5% daily yields! 📈✨",
  "Market volatility is decreasing, making this the ideal time to secure your aggressive daily staking rewards. 🛡️💰",
  "Whale activity in the BSC ecosystem suggests a positive trend. Your VIP status is your key to 5% ROI! 🐳🚀",
  "The 5% daily ROI protocol is running at peak efficiency. Don't forget to claim your task rewards! ⚡💎",
  "USDT liquidity on the Binance Smart Chain is at an all-time high, ensuring fast and stable withdrawals. 💵✅",
  "Bullish sentiment is building across the DeFi sector. Your 5% daily gains are leading the market! 🐂🚀",
  "Network congestion is low. It's a great time to process your daily tasks and maximize your 5% earnings. 🌐⚙️",
  "Accumulation phase detected in the BNB/USDT pair. Your 5% daily ROI outperforms all major assets! 📊💎"
];

function getRandomFallback() {
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

export async function getMarketInsight(vipLevel: number): Promise<string> {
  try {
    const blockedUntil = localStorage.getItem(BLOCKED_UNTIL_KEY);
    if (blockedUntil) {
      const blockedTime = parseInt(blockedUntil, 10);
      if (Date.now() < blockedTime) return getRandomFallback();
      else localStorage.removeItem(BLOCKED_UNTIL_KEY);
    }
  } catch (e) {}

  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed: CachedInsight = JSON.parse(cached);
      const isRecent = Date.now() - parsed.timestamp < CACHE_EXPIRY;
      if (isRecent && parsed.vipLevel === vipLevel) return parsed.text;
    }
  } catch (e) {}

  try {
    // Correctly initialize GoogleGenAI using process.env.API_KEY as per coding guidelines
    // and to resolve the ImportMeta.env TypeScript error.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a professional crypto investment advisor for BNB Yield Pro. The user is VIP level ${vipLevel}. Give a 1-sentence bullish market update about BNB/USDT to encourage them to earn their 5% daily yield. Use emojis.`,
    });
    
    if (!response || !response.text) return getRandomFallback();

    const text = response.text.trim();
    localStorage.setItem(CACHE_KEY, JSON.stringify({ text, timestamp: Date.now(), vipLevel }));

    return text;
  } catch (error: any) {
    const errorMsg = String(error?.message || "").toLowerCase();
    if (errorMsg.includes('429') || errorMsg.includes('quota')) {
      try { localStorage.setItem(BLOCKED_UNTIL_KEY, (Date.now() + QUOTA_COOLDOWN).toString()); } catch (e) {}
    }
    return getRandomFallback();
  }
}
