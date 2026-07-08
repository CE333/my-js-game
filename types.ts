
export enum GameStatus {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
  LOADING_AI = 'LOADING_AI'
}

export type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter';
export type TimeOfDay = 'Day' | 'Night';
export type Language = 'en' | 'fa' | 'ar';

export enum View {
  LANDING = 'LANDING',
  SETUP = 'SETUP',
  HOME = 'HOME',
  GAME = 'GAME',
  DASHBOARD = 'DASHBOARD',
  SHOP = 'SHOP',
  ADMIN = 'ADMIN',
  ADS_MANAGER = 'ADS_MANAGER',
  REFERRAL = 'REFERRAL'
}

export interface AdminWallets {
  useMasterForAll: boolean;
  master: string;
  ads: string;
  swap: string;
  market: string;
  shop: string;
}

export interface AccountingStats {
  revenue: {
    ads: number; // Income from advertisers
    marketFees: number; // Transaction fees
    swapFees: number; // Spread/Fee
    shopSales: number; // In-app purchases
    vipSales: number; // New VIP revenue
    total: number;
  };
  expenses: {
    userWithdrawals: number;
    adRewards: number; // Coins given to users
    total: number;
  };
  netProfit: number;
}

export interface GameSettings {
  // Economy Pricing
  ce333Price: number; // USD Value
  energyPrice: number; // Coins
  revivePrice: number; // Coins
  shieldPrice: number; // Coins
  nitroPrice: number; // Coins
  
  // Ad Pricing
  adBannerCost: number; // USD/Day
  adFullscreenCost: number; // USD/Day
  adVideoCost: number; // USD/View

  baseRewardInterval: number;
  
  // Physics & Gameplay (Manual Override)
  useAi: boolean; // If false, use the values below
  gravity: number;
  jumpStrength: number;
  pipeSpeed: number;
  pipeSpawnRate: number;
  gapSize: number;

  // Wallet Config
  wallets: AdminWallets;
}

export interface GameConfig {
  gravity: number;
  jumpStrength: number;
  pipeSpeed: number;
  pipeSpawnRate: number; // Frames between pipes
  gapSize: number;
  themeName: string;
  themeDescription: string;
  primaryColor: string; // Hex for obstacles
  skyColor: string; // Hex for background (fallback/base)
  volatility: number; // 0 = static, > 0 = amount of vertical pipe movement
  season: Season;
  timeOfDay: TimeOfDay;
}

export interface Bird {
  x: number;
  y: number;
  velocity: number;
  radius: number;
  rotation: number;
  wingFrame: number; // For animation
}

export type ObstacleType = 
  'pipe' | 'bird_flock' | 'stone' | 'fire' | 
  'ice' | 'electro' | 'ghost' | 'blade' | 'portal' | 'toxic' |
  'laser' | 'magma' | 'black_hole' | 'crystal' | 'glitch' | 'vine';

export interface Pipe {
  x: number;
  baseHeight: number; // The original center point
  currentTopHeight: number; // Actual render position
  passed: boolean;
  moveSpeed: number; // Individual speed variance
  moveOffset: number; // Random start phase
  type: ObstacleType;
}

export interface Projectile {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  type: 'ball' | 'fireball';
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  type: 'snow' | 'leaf' | 'fire' | 'spark' | 'cloud' | 'shield_break';
  color: string;
}

export interface FarmObject {
  x: number;
  y: number;
  type: 'house' | 'cow' | 'sheep';
  variant: number; // For slight visual differences
  speed: number;
}

export interface BirdSkin {
  id: string;
  name: string;
  description: string;
  abilityText: string;
  price: number;
  type: 'Robot' | 'Plane' | 'Animal' | 'SciFi' | 'Fantasy' | 'Battle';
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
}

// --- NEW AVATAR & FLAG TYPES ---
export interface Avatar {
  id: string;
  name: string;
  price: number;
  gender: 'Male' | 'Female' | 'Robot';
  job: string;
  colors: { skin: string; hair: string; acc: string };
}

export interface Flag {
  id: string;
  name: string;
  price: number;
  colors: string[]; // [Left/Top, Mid, Right/Bottom]
  pattern: 'Vertical' | 'Horizontal';
}

export interface PlayerUpgrades {
  power: number; // Jump strength multiplier level (0-10)
  aerodynamics: number; // Gravity resistance level (0-10)
  agility: number; // Rotation/Response speed level (0-10)
}

export interface PlayerProfile {
  id: string;
  walletAddress: string | null;
  motherWalletAddress: string; // Admin setting
  motherWalletBalance: number; // Accumulated fees/payments
  balance: number;
  usdtBalance: number; // New USDT Balance
  ownedSkins: string[]; // IDs of owned skins
  equippedSkinId: string;
  
  // Customization
  hasCompletedSetup: boolean;
  hasAcceptedTerms: boolean; // NEW: Disclaimer acceptance
  avatarId: string;
  flagId: string | null;
  ownedAvatars: string[];
  ownedFlags: string[];

  // Inventory
  consumables: {
    revives: number;
    shields: number;
    nitros: number;
  };
  upgrades: PlayerUpgrades;
  bestScore: number;
  gamesPlayed: number;
  
  referralCount: number;
  claimedReferralRewards: number; // New: Tracks how many rewards (1 coin per 3) claimed

  // New Energy/Limit System
  dailyEnergy: number; // Max 9, recharges 3
  lastLoginDate: string; // YYYY-MM-DD
  accountCreationDate: string; // YYYY-MM-DD for Day 1 Bonus
  
  isBlacklisted: boolean;
  
  // VIP System
  isVip: boolean;
  vipExpiryDate: string | null; // ISO Date String
  vipDailyUsageUSD: number; // Track daily spending limit for VIP free actions

  // New Video Ad Tracking
  videoAdProgress: number; // 0 to 3
  dailyVideoWatchCount: number; // Max 9
  watchedAdHistory: string[]; // List of Ad IDs watched recently
}

export interface GameEffects {
  hasShield: boolean;
  hasNitro: boolean;
}

// --- MARKETPLACE ---
export interface MarketListing {
  id: string;
  sellerId: string;
  sellerName: string; // Mock name
  itemId: string; // Renamed from skinId to Generic itemId
  itemType: 'Bird' | 'Avatar' | 'Flag'; // New discriminator
  price: number;
}

export interface WithdrawalRequest {
  id: string;
  amount: number;
  destination: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  requestDate: number;
  unlockDate: number; // 24h later
}

// --- SUPPORT SYSTEM ---
export interface SupportTicket {
  id: string;
  userId: string;
  message: string;
  reply: string | null; // Null if no reply yet
  status: 'Open' | 'Replied';
  timestamp: number;
}

export type AdminRole = 'Master' | 'Support' | null;

// --- INFLUENCER SYSTEM ---
export interface InfluencerSubmission {
  id: string;
  userId: string;
  platform: 'YouTube' | 'Instagram' | 'X' | 'Other';
  link: string;
  viewsClaimed: number;
  screenshotUrl: string; // Mock URL
  status: 'Pending' | 'Approved' | 'Rejected';
  date: number;
}

// --- NEW TYPES FOR ADS & CRYPTO ---

export type CryptoSymbol = 'BTC' | 'ETH' | 'USDT' | 'BNB' | 'SOL' | 'XRP' | 'ADA' | 'DOGE' | 'TRX' | 'TON';

export interface CryptoCurrency {
  symbol: CryptoSymbol;
  name: string;
  priceUSD: number; // Mock price
}

export interface AdCampaign {
  id: string;
  title: string;
  content: string; // Text content
  link: string;
  type: 'Banner' | 'Fullscreen' | 'Video';
  days: number;
  viewsPurchased: number;
  status: 'Active' | 'Completed';
  cost: number;
  paidWith: 'CE333' | CryptoSymbol | 'ADMIN';
  videoUrl?: string; // Optional for Video type
}
