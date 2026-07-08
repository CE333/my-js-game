
import { GameConfig, BirdSkin, PlayerProfile, CryptoCurrency, Avatar, Flag, AdCampaign, AccountingStats } from "./types";

// Logical dimensions for physics calculations. 
export const LOGICAL_WIDTH = 480;
export const LOGICAL_HEIGHT = 800;

// LIMITS
export const MAX_DAILY_ENERGY = 9; // Capacity
export const DAILY_RECHARGE_AMOUNT = 3; // Refill amount

export const MAX_RETRIES_PER_GAME = 3; // Free retries inside one session
export const MAX_REVIVE_INVENTORY = 9; // Inventory Capacity

// VIDEO AD RULES
export const MAX_DAILY_VIDEO_ADS = 9;
export const VIDEOS_FOR_REWARD = 3; // Watch 3 to get 1 Coin
export const AD_HISTORY_LIMIT = 6; // Gap before repeating ad

// ECONOMY ($0.10 per CE333)
export const MARKET_PRICE_USD = 0.10; // 1 CE333 = $0.10
export const MARKET_FEE_PERCENTAGE = 0.333; // 33.3% Fee on Market & Swap
export const ENERGY_REFILL_PRICE = 5; 
export const REVIVE_PRICE = 2;
export const SHIELD_PRICE = 10; // $1.00
export const NITRO_PRICE = 8; // $0.80

// VIP
export const VIP_MONTHLY_PRICE_USD = 33.30;
export const VIP_PRICE_COINS = 333; // Approx equivalent if paying in coins
export const VIP_DAILY_LIMIT_USD = 2.0; // Max free usage value per day

// REFERRAL & INFLUENCER
export const REFERRAL_REWARD_PER_STEP = 1; // 1 Coin
export const REFERRAL_STEP = 3; // Per 3 Invites
export const REFERRAL_CAP = 333; // Max invites to get paid for
export const INFLUENCER_REWARD_RATE = 100; // Coins
export const INFLUENCER_VIEW_STEP = 3000; // Per 3000 views

// REWARDS
export const SCORE_THRESHOLD_EASY = 10;
export const SCORE_THRESHOLD_HARD = 20;
export const SCORE_THRESHOLD_CRAZY = 30;
export const GAME_COMPLETION_REWARD = 1; // Bonus for finishing

// NEW: Interval Rewards (Pipes Passed)
export const REWARD_INTERVAL_EASY = 33;
export const REWARD_INTERVAL_HARD = 22;
export const REWARD_INTERVAL_CRAZY = 11;

export const DEFAULT_CONFIG: GameConfig = {
  gravity: 0.32, // Slightly increased for snappier feel
  jumpStrength: -7.0, // Base jump
  pipeSpeed: 3,
  pipeSpawnRate: 100,
  gapSize: 170,
  themeName: "آغاز طبیعت",
  themeDescription: "یک روز بهاری زیبا برای پرواز انرژی خلاق.",
  primaryColor: "#22c55e", 
  skyColor: "#38bdf8", 
  volatility: 0,
  season: 'Spring',
  timeOfDay: 'Day'
};

export const TICKER_PROMPTS = [
  'marketPrice',
  'ticker_1',
  'ticker_2',
  'ticker_3',
  'ticker_4',
  'ticker_5',
  'vipPromo' // New ticker item
];

// MUSIC
export const MUSIC_URL = "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3";

// MOCK ACCOUNTING DATA
export const ACCOUNTING_STATS: AccountingStats = {
    revenue: {
        ads: 1540,
        marketFees: 320,
        swapFees: 150,
        shopSales: 890,
        vipSales: 3330, // Mock VIP sales
        total: 6230
    },
    expenses: {
        userWithdrawals: 1200,
        adRewards: 450,
        total: 1650
    },
    netProfit: 4580
};

// HOUSE ADS (Fallback when no external ads match)
export const HOUSE_ADS: AdCampaign[] = [
    { id: 'ce333_video_1', title: 'CE333 Token', content: 'The future of gaming.', link: 'https://ce333.io', type: 'Video', days: 999, viewsPurchased: 999999, status: 'Active', cost: 0, paidWith: 'CE333' },
    { id: 'vip_promo_banner', title: 'Go VIP', content: 'Unlimited Energy', link: 'vip', type: 'Banner', days: 999, viewsPurchased: 999999, status: 'Active', cost: 0, paidWith: 'ADMIN' },
    { id: 'ce333_banner', title: 'Staking Live', content: 'Stake CE333 now', link: '', type: 'Banner', days: 999, viewsPurchased: 999999, status: 'Active', cost: 0, paidWith: 'CE333' }
];

// MOCK AD INVENTORY (Simulating Advertiser Network)
export const MOCK_VIDEO_ADS: AdCampaign[] = [
    { id: 'ad_1', title: 'Crypto Exchange', content: 'Trade now!', link: '', type: 'Video', days: 0, viewsPurchased: 1000, status: 'Active', cost: 10, paidWith: 'USDT' },
    { id: 'ad_2', title: 'Mobile Game Legend', content: 'Play Free', link: '', type: 'Video', days: 0, viewsPurchased: 1000, status: 'Active', cost: 10, paidWith: 'USDT' },
    { id: 'ad_3', title: 'Energy Drink', content: 'Boost up', link: '', type: 'Video', days: 0, viewsPurchased: 1000, status: 'Active', cost: 10, paidWith: 'USDT' },
    { id: 'ad_4', title: 'Tech Gadgets', content: 'New Phone', link: '', type: 'Video', days: 0, viewsPurchased: 1000, status: 'Active', cost: 10, paidWith: 'USDT' },
    { id: 'ad_5', title: 'Fashion Week', content: 'Style', link: '', type: 'Video', days: 0, viewsPurchased: 1000, status: 'Active', cost: 10, paidWith: 'USDT' },
    { id: 'ad_6', title: 'Car Insurance', content: 'Save money', link: '', type: 'Video', days: 0, viewsPurchased: 1000, status: 'Active', cost: 10, paidWith: 'USDT' },
    { id: 'ad_7', title: 'Travel Agency', content: 'Fly away', link: '', type: 'Video', days: 0, viewsPurchased: 1000, status: 'Active', cost: 10, paidWith: 'USDT' },
    { id: 'ad_8', title: 'Online Course', content: 'Learn React', link: '', type: 'Video', days: 0, viewsPurchased: 1000, status: 'Active', cost: 10, paidWith: 'USDT' },
    { id: 'ad_9', title: 'Fitness App', content: 'Get fit', link: '', type: 'Video', days: 0, viewsPurchased: 1000, status: 'Active', cost: 10, paidWith: 'USDT' },
    { id: 'ad_10', title: 'Food Delivery', content: 'Yummy', link: '', type: 'Video', days: 0, viewsPurchased: 1000, status: 'Active', cost: 10, paidWith: 'USDT' },
    { id: 'ad_11', title: 'Streaming Service', content: 'Watch Movies', link: '', type: 'Video', days: 0, viewsPurchased: 1000, status: 'Active', cost: 10, paidWith: 'USDT' },
    { id: 'ad_12', title: 'Social Media', content: 'Connect', link: '', type: 'Video', days: 0, viewsPurchased: 1000, status: 'Active', cost: 10, paidWith: 'USDT' },
];

export const AVATARS: Avatar[] = [
  // FREE STARTERS
  { id: 'male_default', name: 'Adam', price: 0, gender: 'Male', job: 'Civilian', colors: { skin: '#f5d0b0', hair: '#4a3627', acc: '#3b82f6' } },
  { id: 'female_default', name: 'Eve', price: 0, gender: 'Female', job: 'Civilian', colors: { skin: '#f5d0b0', hair: '#eab308', acc: '#ec4899' } },
  
  // ORIGINAL PAID
  { id: 'doctor_m', name: 'Dr. John', price: 50, gender: 'Male', job: 'Doctor', colors: { skin: '#eec', hair: '#333', acc: '#fff' } },
  { id: 'doctor_f', name: 'Dr. Sarah', price: 50, gender: 'Female', job: 'Doctor', colors: { skin: '#eec', hair: '#500', acc: '#fff' } },
  { id: 'pilot_m', name: 'Capt. Maverick', price: 80, gender: 'Male', job: 'Pilot', colors: { skin: '#dcb', hair: '#421', acc: '#1e3a8a' } },
  { id: 'pilot_f', name: 'Capt. Marvel', price: 80, gender: 'Female', job: 'Pilot', colors: { skin: '#dcb', hair: '#eb5', acc: '#1e3a8a' } },
  { id: 'soldier_m', name: 'Sgt. Solid', price: 100, gender: 'Male', job: 'Soldier', colors: { skin: '#b97', hair: '#000', acc: '#3f6212' } },
  { id: 'soldier_f', name: 'Lt. Jane', price: 100, gender: 'Female', job: 'Soldier', colors: { skin: '#b97', hair: '#222', acc: '#3f6212' } },
  { id: 'ninja_m', name: 'Shadow', price: 150, gender: 'Male', job: 'Ninja', colors: { skin: '#ffe', hair: '#000', acc: '#111' } },
  { id: 'ninja_f', name: 'Kunoichi', price: 150, gender: 'Female', job: 'Ninja', colors: { skin: '#ffe', hair: '#000', acc: '#111' } },
  { id: 'cyber_m', name: 'Netrunner', price: 200, gender: 'Male', job: 'Hacker', colors: { skin: '#2dd4bf', hair: '#d946ef', acc: '#000' } },
  { id: 'cyber_f', name: 'Glitch', price: 200, gender: 'Female', job: 'Hacker', colors: { skin: '#a78bfa', hair: '#22d3ee', acc: '#000' } },
  { id: 'king', name: 'King Arthur', price: 500, gender: 'Male', job: 'Royal', colors: { skin: '#f5d0b0', hair: '#9ca3af', acc: '#eab308' } },
  { id: 'queen', name: 'Queen Lizzy', price: 500, gender: 'Female', job: 'Royal', colors: { skin: '#f5d0b0', hair: '#fff', acc: '#eab308' } },
  { id: 'astro_m', name: 'Starman', price: 300, gender: 'Male', job: 'Astronaut', colors: { skin: '#f5d0b0', hair: '#333', acc: '#fff' } },
  
  // NEW JOBS (Set 1)
  { id: 'chef_m', name: 'Chef Gordon', price: 60, gender: 'Male', job: 'Chef', colors: { skin: '#f5d0b0', hair: '#eab308', acc: '#ffffff' } },
  { id: 'fire_f', name: 'Chief Blaze', price: 70, gender: 'Female', job: 'Firefighter', colors: { skin: '#dcb', hair: '#000', acc: '#ef4444' } },
  { id: 'police_m', name: 'Officer Bob', price: 70, gender: 'Male', job: 'Police', colors: { skin: '#eec', hair: '#421', acc: '#1e3a8a' } },
  { id: 'artist_f', name: 'Bella', price: 60, gender: 'Female', job: 'Artist', colors: { skin: '#f5d0b0', hair: '#ef4444', acc: '#000000' } }, 
  { id: 'sci_m', name: 'Dr. Einstein', price: 90, gender: 'Male', job: 'Scientist', colors: { skin: '#eec', hair: '#fff', acc: '#22d3ee' } },
  { id: 'farmer_m', name: 'Old Joe', price: 40, gender: 'Male', job: 'Farmer', colors: { skin: '#b97', hair: '#ccc', acc: '#fde047' } }, 
  { id: 'athlete_f', name: 'Runner Jen', price: 60, gender: 'Female', job: 'Athlete', colors: { skin: '#dcb', hair: '#333', acc: '#f472b6' } }, 
  { id: 'music_m', name: 'DJ Beat', price: 80, gender: 'Male', job: 'Musician', colors: { skin: '#b97', hair: '#000', acc: '#a855f7' } }, 
  { id: 'det_m', name: 'Sherlock', price: 80, gender: 'Male', job: 'Detective', colors: { skin: '#eec', hair: '#444', acc: '#78350f' } }, 
  { id: 'pirate_f', name: 'Mary Read', price: 110, gender: 'Female', job: 'Pirate', colors: { skin: '#dcb', hair: '#500', acc: '#ef4444' } }, 

  // NEW JOBS (Set 2 - 10 New)
  { id: 'teacher_f', name: 'Ms. Honey', price: 50, gender: 'Female', job: 'Teacher', colors: { skin: '#eec', hair: '#a52a2a', acc: '#f472b6' } },
  { id: 'builder_m', name: 'Bob Build', price: 50, gender: 'Male', job: 'Builder', colors: { skin: '#b97', hair: '#333', acc: '#f97316' } }, // Hard hat
  { id: 'nurse_f', name: 'Nurse Joy', price: 60, gender: 'Female', job: 'Nurse', colors: { skin: '#ffe', hair: '#f87171', acc: '#ffffff' } },
  { id: 'magic_m', name: 'Houdini', price: 90, gender: 'Male', job: 'Magician', colors: { skin: '#eec', hair: '#000', acc: '#000' } }, // Top hat
  { id: 'cowboy_m', name: 'Clint', price: 70, gender: 'Male', job: 'Cowboy', colors: { skin: '#b97', hair: '#500', acc: '#78350f' } }, // Cowboy hat
  { id: 'clown_m', name: 'Joker', price: 40, gender: 'Male', job: 'Clown', colors: { skin: '#fff', hair: '#22c55e', acc: '#ef4444' } }, 
  { id: 'vampire_m', name: 'Dracula', price: 120, gender: 'Male', job: 'Vampire', colors: { skin: '#e2e8f0', hair: '#000', acc: '#000' } }, 
  { id: 'zombie_m', name: 'Walker', price: 80, gender: 'Male', job: 'Zombie', colors: { skin: '#86efac', hair: '#333', acc: '#4b5563' } },
  { id: 'santa_m', name: 'Claus', price: 200, gender: 'Male', job: 'Santa', colors: { skin: '#fecaca', hair: '#fff', acc: '#ef4444' } },
  { id: 'diver_f', name: 'Marina', price: 80, gender: 'Female', job: 'Diver', colors: { skin: '#dcb', hair: '#333', acc: '#0ea5e9' } },

  // NEW JOBS (Set 3 - 10 Latest - Realistic/Fantasy)
  { id: 'viking_m', name: 'Ragnar', price: 120, gender: 'Male', job: 'Viking', colors: { skin: '#f5d0b0', hair: '#eab308', acc: '#9ca3af' } },
  { id: 'samurai_m', name: 'Kenji', price: 140, gender: 'Male', job: 'Samurai', colors: { skin: '#f5d0b0', hair: '#000000', acc: '#dc2626' } },
  { id: 'wizard_m', name: 'Gandalf', price: 150, gender: 'Male', job: 'Wizard', colors: { skin: '#f5d0b0', hair: '#d1d5db', acc: '#4b5563' } },
  { id: 'miner_m', name: 'Digger', price: 60, gender: 'Male', job: 'Miner', colors: { skin: '#b97', hair: '#333', acc: '#f59e0b' } },
  { id: 'agent_m', name: '007', price: 90, gender: 'Male', job: 'Agent', colors: { skin: '#f5d0b0', hair: '#000', acc: '#000' } },
  { id: 'punk_m', name: 'Rocker', price: 70, gender: 'Male', job: 'Punk', colors: { skin: '#f5d0b0', hair: '#ec4899', acc: '#000' } },
  { id: 'rapper_m', name: 'Lil Zee', price: 80, gender: 'Male', job: 'Rapper', colors: { skin: '#8b5cf6', hair: '#000', acc: '#fbbf24' } },
  { id: 'hippie_f', name: 'Flower', price: 50, gender: 'Female', job: 'Hippie', colors: { skin: '#f5d0b0', hair: '#fca5a5', acc: '#a855f7' } },
  { id: 'biker_m', name: 'Axel', price: 90, gender: 'Male', job: 'Biker', colors: { skin: '#f5d0b0', hair: '#000', acc: '#000' } },
  { id: 'cyborg_x', name: 'Unit 99', price: 250, gender: 'Robot', job: 'CyborgX', colors: { skin: '#334155', hair: '#94a3b8', acc: '#ef4444' } },

  { id: 'robot_1', name: 'Bot X1', price: 400, gender: 'Robot', job: 'Droid', colors: { skin: '#94a3b8', hair: '#64748b', acc: '#3b82f6' } },
];

export const FLAGS: Flag[] = [
  { id: 'none', name: 'None', price: 0, colors: ['transparent', 'transparent', 'transparent'], pattern: 'Vertical' },
  // Original
  { id: 'ir', name: 'Iran', price: 50, colors: ['#22c55e', '#ffffff', '#ef4444'], pattern: 'Horizontal' },
  { id: 'us', name: 'USA', price: 50, colors: ['#3b82f6', '#ffffff', '#ef4444'], pattern: 'Horizontal' }, 
  { id: 'de', name: 'Germany', price: 50, colors: ['#000000', '#ef4444', '#eab308'], pattern: 'Horizontal' },
  { id: 'fr', name: 'France', price: 50, colors: ['#3b82f6', '#ffffff', '#ef4444'], pattern: 'Vertical' },
  { id: 'gb', name: 'UK', price: 50, colors: ['#1e3a8a', '#ffffff', '#ef4444'], pattern: 'Vertical' }, 
  { id: 'jp', name: 'Japan', price: 50, colors: ['#ffffff', '#ef4444', '#ffffff'], pattern: 'Vertical' }, 
  { id: 'cn', name: 'China', price: 50, colors: ['#ef4444', '#eab308', '#ef4444'], pattern: 'Horizontal' },
  { id: 'ru', name: 'Russia', price: 50, colors: ['#ffffff', '#3b82f6', '#ef4444'], pattern: 'Horizontal' },
  { id: 'tr', name: 'Turkey', price: 50, colors: ['#ef4444', '#ffffff', '#ef4444'], pattern: 'Horizontal' },
  { id: 'ca', name: 'Canada', price: 50, colors: ['#ef4444', '#ffffff', '#ef4444'], pattern: 'Vertical' },
  { id: 'br', name: 'Brazil', price: 50, colors: ['#22c55e', '#eab308', '#1e3a8a'], pattern: 'Horizontal' }, 
  { id: 'it', name: 'Italy', price: 50, colors: ['#22c55e', '#ffffff', '#ef4444'], pattern: 'Vertical' },
  { id: 'es', name: 'Spain', price: 50, colors: ['#ef4444', '#eab308', '#ef4444'], pattern: 'Horizontal' },
  { id: 'in', name: 'India', price: 50, colors: ['#f97316', '#ffffff', '#22c55e'], pattern: 'Horizontal' },
  { id: 'kr', name: 'S. Korea', price: 50, colors: ['#ffffff', '#ef4444', '#3b82f6'], pattern: 'Horizontal' }, 
  { id: 'au', name: 'Australia', price: 50, colors: ['#1e3a8a', '#ffffff', '#ef4444'], pattern: 'Vertical' },
  { id: 'ar', name: 'Argentina', price: 50, colors: ['#60a5fa', '#ffffff', '#60a5fa'], pattern: 'Horizontal' },
  { id: 'mx', name: 'Mexico', price: 50, colors: ['#16a34a', '#ffffff', '#ef4444'], pattern: 'Vertical' },
  
  // NEW ASIAN FLAGS (Set 1)
  { id: 'sa', name: 'Saudi Arabia', price: 50, colors: ['#15803d', '#ffffff', '#15803d'], pattern: 'Horizontal' },
  { id: 'ae', name: 'UAE', price: 50, colors: ['#ef4444', '#22c55e', '#000000'], pattern: 'Vertical' }, 
  { id: 'qa', name: 'Qatar', price: 50, colors: ['#ffffff', '#881337', '#881337'], pattern: 'Vertical' },
  { id: 'pk', name: 'Pakistan', price: 50, colors: ['#ffffff', '#15803d', '#15803d'], pattern: 'Vertical' },
  { id: 'th', name: 'Thailand', price: 50, colors: ['#ef4444', '#ffffff', '#1e3a8a'], pattern: 'Horizontal' },
  { id: 'vn', name: 'Vietnam', price: 50, colors: ['#ef4444', '#eab308', '#ef4444'], pattern: 'Horizontal' },
  { id: 'id', name: 'Indonesia', price: 50, colors: ['#ef4444', '#ffffff', '#ffffff'], pattern: 'Horizontal' },
  { id: 'my', name: 'Malaysia', price: 50, colors: ['#ef4444', '#1e3a8a', '#eab308'], pattern: 'Horizontal' },
  { id: 'ph', name: 'Philippines', price: 50, colors: ['#1e3a8a', '#ef4444', '#eab308'], pattern: 'Horizontal' },
  { id: 'sg', name: 'Singapore', price: 50, colors: ['#ef4444', '#ffffff', '#ffffff'], pattern: 'Horizontal' },

  // NEW ASIAN FLAGS (Set 2 - 10 New)
  { id: 'bd', name: 'Bangladesh', price: 50, colors: ['#006a4e', '#f42a41', '#006a4e'], pattern: 'Horizontal' },
  { id: 'lk', name: 'Sri Lanka', price: 50, colors: ['#fecb00', '#8d153a', '#eb7400'], pattern: 'Vertical' },
  { id: 'np', name: 'Nepal', price: 50, colors: ['#dc143c', '#ffffff', '#003893'], pattern: 'Vertical' }, // Custom shape needed
  { id: 'tw', name: 'Taiwan', price: 50, colors: ['#fe0000', '#000095', '#ffffff'], pattern: 'Horizontal' },
  { id: 'hk', name: 'Hong Kong', price: 50, colors: ['#de2910', '#ffffff', '#de2910'], pattern: 'Vertical' },
  { id: 'kw', name: 'Kuwait', price: 50, colors: ['#14903b', '#ffffff', '#be0027'], pattern: 'Horizontal' },
  { id: 'jo', name: 'Jordan', price: 50, colors: ['#000000', '#ffffff', '#007a3d'], pattern: 'Horizontal' },
  { id: 'lb', name: 'Lebanon', price: 50, colors: ['#ed1c24', '#ffffff', '#ed1c24'], pattern: 'Horizontal' },
  { id: 'iq', name: 'Iraq', price: 50, colors: ['#ce1126', '#ffffff', '#000000'], pattern: 'Horizontal' },
  { id: 'kz', name: 'Kazakhstan', price: 50, colors: ['#00aec7', '#fec50c', '#00aec7'], pattern: 'Horizontal' },

  // NEW FLAGS (Set 3 - 10 Latest - Real World)
  { id: 'ch', name: 'Switzerland', price: 50, colors: ['#ef4444', '#fff', '#ef4444'], pattern: 'Vertical' },
  { id: 'se', name: 'Sweden', price: 50, colors: ['#006aa7', '#fecc00', '#006aa7'], pattern: 'Horizontal' },
  { id: 'no', name: 'Norway', price: 50, colors: ['#ba0c2f', '#fff', '#00205b'], pattern: 'Horizontal' },
  { id: 'gr', name: 'Greece', price: 50, colors: ['#0d5eaf', '#fff', '#0d5eaf'], pattern: 'Horizontal' },
  { id: 'pt', name: 'Portugal', price: 50, colors: ['#006600', '#ff0000', '#ff0000'], pattern: 'Vertical' },
  { id: 'ua', name: 'Ukraine', price: 50, colors: ['#0057b7', '#ffd700', '#0057b7'], pattern: 'Horizontal' },
  { id: 'eg', name: 'Egypt', price: 50, colors: ['#ce1126', '#ffffff', '#000000'], pattern: 'Horizontal' },
  { id: 'be', name: 'Belgium', price: 50, colors: ['#000000', '#fddf00', '#ef4444'], pattern: 'Vertical' },
  { id: 'nl', name: 'Netherlands', price: 50, colors: ['#ae1c28', '#ffffff', '#21468b'], pattern: 'Horizontal' },
  { id: 'at', name: 'Austria', price: 50, colors: ['#ef4444', '#ffffff', '#ef4444'], pattern: 'Horizontal' },
];

export const INITIAL_PLAYER_PROFILE: PlayerProfile = {
  id: 'guest_user',
  walletAddress: null,
  motherWalletAddress: "0xMotherWalletDefaultAdmin",
  motherWalletBalance: 0,
  isBlacklisted: false,
  balance: 0, 
  usdtBalance: 0, 
  ownedSkins: ['ce333'],
  equippedSkinId: 'ce333',
  consumables: {
    revives: 0, 
    shields: 0,
    nitros: 0
  },
  
  // Customization Defaults
  hasCompletedSetup: false,
  hasAcceptedTerms: false, 
  avatarId: 'male_default',
  flagId: 'none',
  ownedAvatars: ['male_default', 'female_default'],
  ownedFlags: ['none'],

  upgrades: {
    power: 1,
    aerodynamics: 1,
    agility: 1
  },
  bestScore: 0,
  gamesPlayed: 0,
  
  referralCount: 0,
  claimedReferralRewards: 0,

  dailyEnergy: 9, 
  lastLoginDate: new Date().toISOString().split('T')[0],
  accountCreationDate: new Date().toISOString().split('T')[0],

  // New Video Ad Tracking
  videoAdProgress: 0,
  dailyVideoWatchCount: 0,
  watchedAdHistory: [],
  
  // VIP
  isVip: false,
  vipExpiryDate: null,
  vipDailyUsageUSD: 0
};

export const UPGRADE_COST_BASE = 10; 
export const UPGRADE_MULTIPLIER = 1.5; 

export const REFERRAL_REWARD = 1; // 1 Coin

export const CRYPTO_CURRENCIES: CryptoCurrency[] = [
  { symbol: 'BTC', name: 'Bitcoin', priceUSD: 65000 },
  { symbol: 'ETH', name: 'Ethereum', priceUSD: 3500 },
  { symbol: 'USDT', name: 'Tether', priceUSD: 1 },
  { symbol: 'BNB', name: 'Binance Coin', priceUSD: 600 },
  { symbol: 'SOL', name: 'Solana', priceUSD: 140 },
  { symbol: 'XRP', name: 'Ripple', priceUSD: 0.6 },
  { symbol: 'ADA', name: 'Cardano', priceUSD: 0.45 },
  { symbol: 'DOGE', name: 'Dogecoin', priceUSD: 0.12 },
  { symbol: 'TRX', name: 'Tron', priceUSD: 0.11 },
  { symbol: 'TON', name: 'Toncoin', priceUSD: 7.2 },
];

export const AD_PRICING = {
  BANNER_DAILY_COST_USD: 5, 
  FULLSCREEN_DAILY_COST_USD: 20, 
  VIDEO_VIEW_COST_USD: 0.20, // NEW: $0.20 per video view (1 CE333 Reward + Fee)
  CE333_CONVERSION_RATE: 0.10 // 1 CE333 = $0.10
};

// --- NEW SKIN CATALOG ---
export const BIRD_SKINS: BirdSkin[] = [
  // STARTER
  {
    id: 'ce333',
    name: 'CE-333 Core',
    description: 'The original energy core.',
    abilityText: 'Balanced stats.',
    price: 0,
    type: 'Robot',
    rarity: 'Common'
  },
  // COMMONS
  {
    id: 'happy_blob',
    name: 'Happy Blob',
    description: 'Always smiling.',
    abilityText: 'Standard flight.',
    price: 20,
    type: 'Animal',
    rarity: 'Common'
  },
  {
    id: 'tall_jim',
    name: 'Tall Jim',
    description: 'Aerodynamic height.',
    abilityText: 'Vertical hitbox.',
    price: 30,
    type: 'Animal',
    rarity: 'Common'
  },
  {
    id: 'angry_cube',
    name: 'Blocky Mad',
    description: 'Furious square.',
    abilityText: 'Boxy hitbox.',
    price: 40,
    type: 'SciFi',
    rarity: 'Common'
  },
  // BATTLE CLASS
  { id: 'recruit_joe', name: 'Recruit Joe', description: 'Basic training gear.', abilityText: 'Camo Hat.', price: 50, type: 'Battle', rarity: 'Common' },
  { id: 'sgt_rock', name: 'Sgt. Rock', description: 'Battle hardened.', abilityText: 'Helmet protection.', price: 80, type: 'Battle', rarity: 'Common' },
  { id: 'pilot_ace', name: 'Ace Pilot', description: 'Master of skies.', abilityText: 'Flight goggles.', price: 120, type: 'Battle', rarity: 'Rare' },
  { id: 'spec_ops', name: 'Spec Ops', description: 'Night vision ready.', abilityText: 'Tactical Visor.', price: 150, type: 'Battle', rarity: 'Rare' },
  { id: 'tank_buster', name: 'Tank Buster', description: 'Heavy plating.', abilityText: 'Armored Look.', price: 180, type: 'Battle', rarity: 'Rare' },
  { id: 'mecha_mk1', name: 'Mecha MK1', description: 'Robotic prototype.', abilityText: 'Steel Frame.', price: 250, type: 'Battle', rarity: 'Epic' },
  { id: 'cyborg_soldier', name: 'Cyber Soldier', description: 'Augmented warrior.', abilityText: 'Red Eye.', price: 300, type: 'Battle', rarity: 'Epic' },
  { id: 'general_star', name: 'General Star', description: 'Leader of the fleet.', abilityText: 'Gold Medals.', price: 400, type: 'Battle', rarity: 'Epic' },
  { id: 'void_walker', name: 'Void Walker', description: 'Space marine.', abilityText: 'Purple Glow.', price: 500, type: 'Battle', rarity: 'Legendary' },
  { id: 'doom_slayer', name: 'Doom Bringer', description: 'Hell walker.', abilityText: 'Fire Aura.', price: 1000, type: 'Battle', rarity: 'Legendary' },

  // OTHERS
  { id: 'cool_dude', name: 'Shades', description: 'Too cool.', abilityText: 'Smoother rotation.', price: 100, type: 'Animal', rarity: 'Rare' },
  { id: 'ninja_stealth', name: 'Shadow Ninja', description: 'Silent.', abilityText: 'Dark trail.', price: 150, type: 'Fantasy', rarity: 'Rare' },
  { id: 'rocket_tube', name: 'Rocket Tube', description: 'Rocket shape.', abilityText: 'Fast climb.', price: 200, type: 'SciFi', rarity: 'Rare' },
  { id: 'king_gold', name: 'King Midas', description: 'Royal.', abilityText: 'Gold trail.', price: 500, type: 'Fantasy', rarity: 'Epic' },
  { id: 'phoenix_fire', name: 'Phoenix', description: 'Eternal fire.', abilityText: 'Fire trail.', price: 1000, type: 'Fantasy', rarity: 'Legendary' },
  { id: 'dragon_lord', name: 'Dragon', description: 'Ruler.', abilityText: 'Intimidating.', price: 1000, type: 'Fantasy', rarity: 'Legendary' },

  // 10 NEW SKINS (Unique & Attractive)
  { id: 'bat_bird', name: 'Vampire Bat', description: 'Sleeps upside down.', abilityText: 'Pointy Wings.', price: 150, type: 'Animal', rarity: 'Rare' },
  { id: 'bee_buzz', name: 'Buzzy Bee', description: 'Stings.', abilityText: 'Stripes.', price: 120, type: 'Animal', rarity: 'Rare' },
  { id: 'ufo_saucer', name: 'UFO', description: 'Unidentified Flying Object.', abilityText: 'Dome.', price: 250, type: 'SciFi', rarity: 'Epic' },
  { id: 'ghost_boo', name: 'Spooky', description: 'Transparent.', abilityText: 'Fade Effect.', price: 180, type: 'Fantasy', rarity: 'Rare' },
  { id: 'skeleton_bone', name: 'Bones', description: 'Scary skeleton.', abilityText: 'White Frame.', price: 200, type: 'Fantasy', rarity: 'Epic' },
  { id: 'rainbow_dash', name: 'Rainbow', description: 'Colorful trail.', abilityText: 'Prism Color.', price: 350, type: 'Fantasy', rarity: 'Epic' },
  { id: 'golden_eagle', name: 'Golden Eagle', description: 'Majestic predator.', abilityText: 'Gold Sheen.', price: 600, type: 'Animal', rarity: 'Legendary' },
  { id: 'owl_wise', name: 'Wise Owl', description: 'Sees everything.', abilityText: 'Big Eyes.', price: 140, type: 'Animal', rarity: 'Rare' },
  { id: 'parrot_party', name: 'Party Parrot', description: 'Loves to dance.', abilityText: 'Multi-Color.', price: 160, type: 'Animal', rarity: 'Rare' },
  { id: 'toucan_tropic', name: 'Toucan', description: 'Tropical vibes.', abilityText: 'Big Beak.', price: 180, type: 'Animal', rarity: 'Rare' }
];
