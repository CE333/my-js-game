
import React, { useState, useEffect, useCallback, useRef } from 'react';
import GameCanvas from './components/GameCanvas';
import Dashboard from './components/Dashboard';
import Shop from './components/Shop';
import Admin from './components/Admin';
import AdsManager from './components/AdsManager';
import Referral from './components/Referral';
import Landing from './components/Landing';
import WelcomeSetup from './components/WelcomeSetup';
import { GameStatus, GameConfig, PlayerProfile, View, AdCampaign, Language, GameEffects, MarketListing, GameSettings, WithdrawalRequest, InfluencerSubmission, SupportTicket } from './types';
import { TRANSLATIONS } from './translations';
import { 
  DEFAULT_CONFIG, 
  INITIAL_PLAYER_PROFILE, 
  BIRD_SKINS, 
  UPGRADE_COST_BASE, 
  UPGRADE_MULTIPLIER, 
  REFERRAL_REWARD_PER_STEP,
  REFERRAL_STEP,
  REFERRAL_CAP,
  INFLUENCER_REWARD_RATE,
  INFLUENCER_VIEW_STEP,
  MAX_DAILY_ENERGY,
  DAILY_RECHARGE_AMOUNT,
  MAX_RETRIES_PER_GAME,
  MAX_REVIVE_INVENTORY,
  ENERGY_REFILL_PRICE,
  REVIVE_PRICE,
  SHIELD_PRICE,
  NITRO_PRICE,
  SCORE_THRESHOLD_EASY,
  SCORE_THRESHOLD_HARD,
  SCORE_THRESHOLD_CRAZY,
  REWARD_INTERVAL_EASY,
  REWARD_INTERVAL_HARD,
  REWARD_INTERVAL_CRAZY,
  GAME_COMPLETION_REWARD,
  MARKET_PRICE_USD,
  MARKET_FEE_PERCENTAGE,
  MAX_DAILY_VIDEO_ADS,
  VIDEOS_FOR_REWARD,
  AD_HISTORY_LIMIT,
  MOCK_VIDEO_ADS,
  HOUSE_ADS,
  TICKER_PROMPTS,
  AD_PRICING,
  VIP_MONTHLY_PRICE_USD,
  VIP_PRICE_COINS,
  VIP_DAILY_LIMIT_USD,
  MUSIC_URL,
  AVATARS,
  FLAGS,
  ACCOUNTING_STATS
} from './constants';
import { generateChallenge } from './services/geminiService';
import { SecureStorage } from './services/SecureStorage';
import { 
  Play, 
  RotateCcw, 
  Cpu, 
  Zap, 
  Feather, 
  Trophy,
  Loader2,
  Wind,
  Sun,
  Moon,
  CloudSnow,
  Wallet,
  ShoppingBag,
  LayoutDashboard,
  Settings,
  Coins,
  Megaphone,
  Users,
  ExternalLink,
  Battery,
  Heart,
  Home,
  HeartPulse,
  LogOut,
  Shield,
  Rocket,
  Tv,
  Gift,
  X,
  BatteryCharging,
  CheckCircle,
  PlayCircle,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  Crown,
  Volume2,
  VolumeX,
  DollarSign,
  FileText
} from 'lucide-react';
import AvatarPreview from './components/AvatarPreview';

export default function App() {
  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [view, setView] = useState<View>(View.LANDING); // Start at Landing
  const [score, setScore] = useState(0);
  const [config, setConfig] = useState<GameConfig>(DEFAULT_CONFIG);
  const [triggerJump, setTriggerJump] = useState(0);
  const [aiError, setAiError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState(0); 
  
  const [gameEffects, setGameEffects] = useState<GameEffects>({ hasShield: false, hasNitro: false });
  const [language, setLanguage] = useState<Language>('en');

  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [showRewardMenu, setShowRewardMenu] = useState(false);
  
  const [playingVideo, setPlayingVideo] = useState(false);
  const [videoTimer, setVideoTimer] = useState(20);
  const [currentAdId, setCurrentAdId] = useState<string | null>(null);

  // MUSIC
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // TICKER STATE
  const [tickerIndex, setTickerIndex] = useState(0);
  useEffect(() => {
     const interval = setInterval(() => {
         setTickerIndex(prev => (prev + 1) % TICKER_PROMPTS.length);
     }, 4000);
     return () => clearInterval(interval);
  }, []);

  // Initialize Secure Storage
  useEffect(() => {
    SecureStorage.init();
  }, []);

  const t = (key: string) => {
    // @ts-ignore
    return TRANSLATIONS[language]?.[key] || key;
  };
  
  const [retriesLeft, setRetriesLeft] = useState(MAX_RETRIES_PER_GAME);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Hard' | 'Crazy'>('Easy');
  
  const [profile, setProfile] = useState<PlayerProfile>(() => {
    try {
        const saved = localStorage.getItem('ce333-profile');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (!parsed.consumables) parsed.consumables = { revives: 3, shields: 0, nitros: 0 };
            if (parsed.hasCompletedSetup === undefined) parsed.hasCompletedSetup = false;
            if (parsed.hasAcceptedTerms === undefined) parsed.hasAcceptedTerms = false;
            if (!parsed.avatarId) parsed.avatarId = 'male_default';
            if (!parsed.flagId) parsed.flagId = 'none';
            if (!parsed.ownedAvatars) parsed.ownedAvatars = ['male_default', 'female_default'];
            if (!parsed.ownedFlags) parsed.ownedFlags = ['none'];
            if (parsed.isBlacklisted === undefined) parsed.isBlacklisted = false;
            if (parsed.videoAdProgress === undefined) parsed.videoAdProgress = 0;
            if (parsed.dailyVideoWatchCount === undefined) parsed.dailyVideoWatchCount = 0;
            if (parsed.watchedAdHistory === undefined) parsed.watchedAdHistory = [];
            if (parsed.claimedReferralRewards === undefined) parsed.claimedReferralRewards = 0;
            if (parsed.isVip === undefined) parsed.isVip = false;
            if (parsed.vipExpiryDate === undefined) parsed.vipExpiryDate = null;
            if (parsed.vipDailyUsageUSD === undefined) parsed.vipDailyUsageUSD = 0;
            if (parsed.accountCreationDate === undefined) parsed.accountCreationDate = new Date().toISOString().split('T')[0];
            if (parsed.usdtBalance === undefined) parsed.usdtBalance = 0;
            return parsed;
        }
    } catch (e) {
        console.warn("Failed to parse profile from local storage");
    }
    return INITIAL_PLAYER_PROFILE;
  });

  const [userAds, setUserAds] = useState<AdCampaign[]>([]);
  const [marketListings, setMarketListings] = useState<MarketListing[]>([
      { id: 'm1', sellerId: 'bot1', sellerName: 'TraderJoe', itemId: 'cool_dude', itemType: 'Bird', price: 90 },
      { id: 'm2', sellerId: 'bot2', sellerName: 'CryptoKing', itemId: 'ninja_stealth', itemType: 'Bird', price: 140 },
  ]);
  
  const [influencerSubmissions, setInfluencerSubmissions] = useState<InfluencerSubmission[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);

  const [gameSettings, setGameSettings] = useState<GameSettings>({
      useAi: true, 
      gravity: 0.25,
      jumpStrength: -7.0,
      pipeSpeed: 3.0,
      gapSize: 170,
      pipeSpawnRate: 100,
      baseRewardInterval: 33,
      // Dynamic Economy
      ce333Price: 0.10,
      energyPrice: ENERGY_REFILL_PRICE,
      revivePrice: REVIVE_PRICE,
      shieldPrice: SHIELD_PRICE,
      nitroPrice: NITRO_PRICE,
      // Dynamic Ad Pricing
      adBannerCost: AD_PRICING.BANNER_DAILY_COST_USD,
      adFullscreenCost: AD_PRICING.FULLSCREEN_DAILY_COST_USD,
      adVideoCost: AD_PRICING.VIDEO_VIEW_COST_USD,
      
      wallets: {
          useMasterForAll: true,
          master: "0xMasterWallet123...",
          ads: "",
          swap: "",
          market: "",
          shop: ""
      }
  });

  // Track Fees
  const [accountingStats, setAccountingStats] = useState(ACCOUNTING_STATS);

  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);

  useEffect(() => {
    localStorage.setItem('ce333-profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
     if (!gameSettings.useAi) {
         setConfig(prev => ({
             ...prev,
             gravity: gameSettings.gravity,
             jumpStrength: gameSettings.jumpStrength,
             pipeSpeed: gameSettings.pipeSpeed,
             gapSize: gameSettings.gapSize,
             pipeSpawnRate: gameSettings.pipeSpawnRate,
             themeName: "Admin Override",
             themeDescription: "Manual Configuration Mode"
         }));
     }
  }, [gameSettings]);

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Music Logic
  useEffect(() => {
      if (audioRef.current) {
          audioRef.current.volume = 0.4;
          if (isMuted) {
              audioRef.current.pause();
          } else {
              // Try to play if user has interacted
              const playPromise = audioRef.current.play();
              if (playPromise !== undefined) {
                  playPromise.catch(() => {
                      // Auto-play prevented
                  });
              }
          }
      }
  }, [isMuted, status]); // Re-try play when status changes (user interaction)

  const toggleMute = () => setIsMuted(!isMuted);

  const checkVipStatus = () => {
      if (profile.isVip && profile.vipExpiryDate) {
          const now = new Date();
          const expiry = new Date(profile.vipExpiryDate);
          if (expiry < now) {
              setProfile(p => ({ ...p, isVip: false, vipExpiryDate: null }));
              return false;
          }
          return true;
      }
      return false;
  };

  const isDayOneBonus = () => {
      const today = new Date().toISOString().split('T')[0];
      return profile.accountCreationDate === today;
  };

  const isVipActive = profile.isVip || isDayOneBonus();

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (profile.lastLoginDate !== today) {
      const newEnergy = Math.min(MAX_DAILY_ENERGY, profile.dailyEnergy + DAILY_RECHARGE_AMOUNT);
      const currentRevives = profile.consumables?.revives || 0;
      const newRevives = Math.min(MAX_REVIVE_INVENTORY, currentRevives + DAILY_RECHARGE_AMOUNT);

      setProfile(p => ({
        ...p,
        lastLoginDate: today,
        dailyEnergy: newEnergy,
        dailyVideoWatchCount: 0, 
        vipDailyUsageUSD: 0, // RESET VIP USAGE
        consumables: {
          ...p.consumables,
          revives: newRevives
        }
      }));
    }
    // Periodic VIP check
    checkVipStatus();
  }, [profile.lastLoginDate]);

  const handleStart = () => {
    if (profile.isBlacklisted) {
        alert(t('accountBlacklisted'));
        return;
    }
    
    // VIP or Day 1 Bonus: Unlimited Energy
    if (!isVipActive) {
        if (profile.dailyEnergy <= 0) {
          setShowRewardMenu(true);
          return;
        }
        setProfile(p => ({...p, dailyEnergy: p.dailyEnergy - 1}));
    }

    setRetriesLeft(MAX_RETRIES_PER_GAME);
    setGameEffects({ hasShield: false, hasNitro: false });
    
    setSessionId(prev => prev + 1); 
    setScore(0);
    setStatus(GameStatus.PLAYING);
    setView(View.GAME);
    setProfile(p => ({...p, gamesPlayed: p.gamesPlayed + 1}));
    
    // Start music if not playing
    if (audioRef.current && !isMuted) {
        audioRef.current.play().catch(() => {});
    }
  };

  const handleRetry = () => {
    if (retriesLeft > 0) {
      setRetriesLeft(prev => prev - 1);
      setGameEffects({ hasShield: false, hasNitro: false });
      setStatus(GameStatus.PLAYING); 
    }
  };

  const handleUseRevivePotion = () => {
      const hasPotion = (profile.consumables?.revives || 0) > 0;
      const isDay1 = isDayOneBonus();
      const isVip = profile.isVip;
      
      // Calculate costs ($0.20 per revive approx)
      const costUSD = 0.20;
      const canVipAfford = isVip && (profile.vipDailyUsageUSD + costUSD <= VIP_DAILY_LIMIT_USD);

      if (isDay1) {
          // Free Day 1
          setRetriesLeft(1);
          setGameEffects({ hasShield: false, hasNitro: false });
          setStatus(GameStatus.PLAYING);
      } else if (canVipAfford) {
          // Free VIP (within limit)
          setProfile(p => ({ ...p, vipDailyUsageUSD: p.vipDailyUsageUSD + costUSD }));
          setRetriesLeft(1);
          setGameEffects({ hasShield: false, hasNitro: false });
          setStatus(GameStatus.PLAYING);
      } else if (hasPotion) {
          // Use Inventory
          setProfile(p => ({
              ...p,
              consumables: {
                  ...p.consumables,
                  revives: (p.consumables?.revives || 0) - 1
              }
          }));
          setRetriesLeft(1);
          setGameEffects({ hasShield: false, hasNitro: false });
          setStatus(GameStatus.PLAYING); 
      } else {
          alert("No Potion & VIP Limit Reached ($2.00/day)");
      }
  };

  const activateShield = () => {
      if (gameEffects.hasShield) return;
      
      const hasStock = (profile.consumables.shields || 0) > 0;
      const isDay1 = isDayOneBonus();
      const isVip = profile.isVip;
      
      // Cost approx $1.00
      const costUSD = 1.00;
      const canVipAfford = isVip && (profile.vipDailyUsageUSD + costUSD <= VIP_DAILY_LIMIT_USD);

      if (isDay1) {
          setGameEffects(prev => ({ ...prev, hasShield: true }));
      } else if (canVipAfford) {
          setProfile(p => ({ ...p, vipDailyUsageUSD: p.vipDailyUsageUSD + costUSD }));
          setGameEffects(prev => ({ ...prev, hasShield: true }));
      } else if (hasStock) {
          setProfile(p => ({
                ...p,
                consumables: { ...p.consumables, shields: p.consumables.shields - 1 }
          }));
          setGameEffects(prev => ({ ...prev, hasShield: true }));
      } else {
          alert(isVip ? "VIP Daily Limit Reached for free items ($2.00)" : "No Shields!");
      }
  };

  const activateNitro = () => {
      if (gameEffects.hasNitro) return;

      const hasStock = (profile.consumables.nitros || 0) > 0;
      const isDay1 = isDayOneBonus();
      const isVip = profile.isVip;
      
      // Cost approx $0.80
      const costUSD = 0.80;
      const canVipAfford = isVip && (profile.vipDailyUsageUSD + costUSD <= VIP_DAILY_LIMIT_USD);

      if (isDay1) {
          setGameEffects(prev => ({ ...prev, hasNitro: true }));
      } else if (canVipAfford) {
          setProfile(p => ({ ...p, vipDailyUsageUSD: p.vipDailyUsageUSD + costUSD }));
          setGameEffects(prev => ({ ...prev, hasNitro: true }));
      } else if (hasStock) {
          setProfile(p => ({
                 ...p,
                 consumables: { ...p.consumables, nitros: p.consumables.nitros - 1 }
          }));
          setGameEffects(prev => ({ ...prev, hasNitro: true }));
      } else {
          alert(isVip ? "VIP Daily Limit Reached for free items ($2.00)" : "No Nitro!");
      }
  };

  const handleShieldBreak = useCallback(() => {
      setGameEffects(prev => ({ ...prev, hasShield: false }));
  }, []);
  
  const lastScoreRef = useRef(0);

  const handleScoreUpdate = useCallback((newScore: number) => {
    setScore(newScore);
    
    if (newScore > lastScoreRef.current) {
        let threshold = REWARD_INTERVAL_EASY;
        if (difficulty === 'Hard') threshold = REWARD_INTERVAL_HARD;
        if (difficulty === 'Crazy') threshold = REWARD_INTERVAL_CRAZY;

        if (newScore % threshold === 0) {
            setProfile(p => ({ ...p, balance: p.balance + 1 }));
        }
    }
    lastScoreRef.current = newScore;
  }, [difficulty]); 

  const handleGameOver = useCallback((finalScore: number) => {
    setStatus(GameStatus.GAME_OVER);
    lastScoreRef.current = 0; 
    setProfile(prev => ({
        ...prev,
        bestScore: Math.max(prev.bestScore, finalScore)
    }));
  }, []);

  const handleGenerateChallenge = async (diff: 'Easy' | 'Hard' | 'Crazy') => {
    setDifficulty(diff);
    
    if (!gameSettings.useAi) {
        return; 
    }

    setStatus(GameStatus.LOADING_AI);
    setAiError(null);
    try {
      const newConfig = await generateChallenge(diff);
      setConfig(newConfig);
      setStatus(GameStatus.IDLE);
    } catch (e) {
      console.error(e);
      setAiError("AI Connection Error");
      setStatus(GameStatus.IDLE);
    }
  };

  const handleBuySkin = (skinId: string) => {
    const skin = BIRD_SKINS.find(s => s.id === skinId);
    if (!skin) return;
    if (profile.balance >= skin.price && !profile.ownedSkins.includes(skinId)) {
      setProfile(p => ({
        ...p,
        balance: p.balance - skin.price,
        ownedSkins: [...p.ownedSkins, skinId],
        equippedSkinId: skinId // AUTO EQUIP ON BUY
      }));
    }
  };

  const handleBuyAvatar = (avatarId: string) => {
      const item = AVATARS.find(a => a.id === avatarId);
      if (!item) return;
      if (profile.balance >= item.price && !profile.ownedAvatars.includes(avatarId)) {
          setProfile(p => ({
              ...p,
              balance: p.balance - item.price,
              ownedAvatars: [...p.ownedAvatars, avatarId],
              avatarId: avatarId // Auto equip
          }));
      }
  };

  const handleBuyFlag = (flagId: string) => {
      const item = FLAGS.find(f => f.id === flagId);
      if (!item) return;
      if (profile.balance >= item.price && !profile.ownedFlags.includes(flagId)) {
          setProfile(p => ({
              ...p,
              balance: p.balance - item.price,
              ownedFlags: [...p.ownedFlags, flagId],
              flagId: flagId // Auto equip
          }));
      }
  };

  const handleEquipAvatar = (id: string) => {
      if (profile.ownedAvatars.includes(id)) {
          setProfile(p => ({ ...p, avatarId: id }));
      }
  };

  const handleEquipFlag = (id: string) => {
      if (profile.ownedFlags.includes(id)) {
          setProfile(p => ({ ...p, flagId: id }));
      }
  };

  const handleBuyEnergy = () => {
    const price = gameSettings.energyPrice;
    if (profile.balance >= price && profile.dailyEnergy < MAX_DAILY_ENERGY) {
      const newEnergy = Math.min(MAX_DAILY_ENERGY, profile.dailyEnergy + 3);
      setProfile(p => ({
        ...p,
        balance: p.balance - price,
        dailyEnergy: newEnergy
      }));
    }
  };

  const handleBuyRevive = () => {
      const price = gameSettings.revivePrice;
      if (profile.balance >= price) {
          setProfile(p => ({
              ...p,
              balance: p.balance - price,
              consumables: { ...p.consumables, revives: (p.consumables.revives || 0) + 1 }
          }));
      }
  };

  const handleBuyShield = () => {
      const price = gameSettings.shieldPrice;
      if (profile.balance >= price) {
          setProfile(p => ({
              ...p,
              balance: p.balance - price,
              consumables: { ...p.consumables, shields: (p.consumables.shields || 0) + 1 }
          }));
      }
  };

  const handleBuyNitro = () => {
      const price = gameSettings.nitroPrice;
      if (profile.balance >= price) {
          setProfile(p => ({
              ...p,
              balance: p.balance - price,
              consumables: { ...p.consumables, nitros: (p.consumables.nitros || 0) + 1 }
          }));
      }
  };

  const handleBuyVIP = (method: 'USD' | 'COINS' = 'USD') => {
      const now = new Date();
      // If already VIP, extend. If not, start new.
      let currentExpiry = profile.vipExpiryDate ? new Date(profile.vipExpiryDate) : now;
      if (currentExpiry < now) currentExpiry = now;
      
      const nextMonth = new Date(currentExpiry);
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      if (method === 'COINS') {
          if (profile.balance >= VIP_PRICE_COINS) {
              setProfile(p => ({
                  ...p,
                  balance: p.balance - VIP_PRICE_COINS,
                  isVip: true,
                  vipExpiryDate: nextMonth.toISOString()
              }));
              alert("VIP Subscription Activated with Coins!");
          } else {
              alert(`Insufficient Funds. VIP costs ${VIP_PRICE_COINS} CE333.`);
          }
      } else {
          // Simulated USD Purchase
          setProfile(p => ({
              ...p,
              isVip: true,
              vipExpiryDate: nextMonth.toISOString()
          }));
          alert("VIP Subscription Activated (Simulated USD)!");
      }
  };

  const handleEquipSkin = (skinId: string) => {
    if (profile.ownedSkins.includes(skinId)) {
      setProfile(p => ({ ...p, equippedSkinId: skinId }));
    }
  };

  const handleUpgrade = (type: 'power' | 'aerodynamics' | 'agility') => {
    const currentLevel = profile.upgrades[type];
    if (currentLevel >= 10) return;
    const cost = Math.floor(UPGRADE_COST_BASE * Math.pow(UPGRADE_MULTIPLIER, currentLevel - 1));
    if (profile.balance >= cost) {
      setProfile(p => ({
        ...p,
        balance: p.balance - cost,
        upgrades: { ...p.upgrades, [type]: currentLevel + 1 }
      }));
    }
  };

  const handlePublishAd = (campaign: AdCampaign, cost: number, currency: string) => {
    if (currency === 'CE333' && cost > 0) {
      setProfile(p => ({...p, balance: p.balance - cost}));
    }
    // If Admin (cost 0 or ADMIN currency), no deduction
    setUserAds(prev => [campaign, ...prev]);
  };

  const handleSimulateInvite = () => {
    // CAP at 333 invites for payment
    if (profile.referralCount >= REFERRAL_CAP) {
        alert(t('referralCap'));
        return;
    }
    
    setProfile(p => {
        const newCount = p.referralCount + 1;
        let newBalance = p.balance;
        let newClaimed = p.claimedReferralRewards;
        
        // Every 3 invites = 1 Coin
        if (newCount % REFERRAL_STEP === 0) {
            newBalance += REFERRAL_REWARD_PER_STEP;
            newClaimed += 1;
        }

        return {
            ...p,
            referralCount: newCount,
            balance: newBalance,
            claimedReferralRewards: newClaimed
        };
    });
  };
  
  const handleSubmitProof = (platform: 'YouTube'|'Instagram'|'X'|'Other', link: string, views: number, screenshot: string) => {
      const newSub: InfluencerSubmission = {
          id: Math.random().toString(36).substr(2, 9),
          userId: profile.id,
          platform,
          link,
          viewsClaimed: views,
          screenshotUrl: screenshot,
          status: 'Pending',
          date: Date.now()
      };
      setInfluencerSubmissions(prev => [newSub, ...prev]);
  };
  
  const handleReviewSubmission = (id: string, status: 'Approved' | 'Rejected') => {
      setInfluencerSubmissions(prev => prev.map(s => {
          if (s.id === id) {
              if (status === 'Approved') {
                  // Calculate Reward: 100 coins per 3000 views
                  const reward = Math.floor(s.viewsClaimed / INFLUENCER_VIEW_STEP) * INFLUENCER_REWARD_RATE;
                  if (reward > 0) adminAddCoinsToUser(reward);
              }
              return { ...s, status };
          }
          return s;
      }));
  };

  // --- SUPPORT TICKET HANDLERS ---
  const handleContactSupport = (msg: string) => {
     const newTicket: SupportTicket = {
         id: Math.random().toString(36).substr(2, 9),
         userId: profile.id,
         message: msg,
         reply: null,
         status: 'Open',
         timestamp: Date.now()
     };
     setSupportTickets(prev => [newTicket, ...prev]);
  };

  const handleReplyTicket = (id: string, reply: string) => {
      setSupportTickets(prev => prev.map(t => {
          if (t.id === id) {
              return { ...t, reply, status: 'Replied' };
          }
          return t;
      }));
  };
  
  const adminAddCoinsToUser = (amount: number) => {
      setProfile(p => ({ ...p, balance: p.balance + amount }));
  };

  const handleSetupComplete = (avatarId: string) => {
     setProfile(p => ({
        ...p,
        hasCompletedSetup: true,
        avatarId: avatarId,
        consumables: {
           revives: p.consumables.revives,
           shields: p.consumables.shields + 1, 
           nitros: p.consumables.nitros + 1 
        }
     }));
     setView(View.HOME);
  };

  const handleListMarketItem = (itemId: string, price: number) => {
      let isOwned = false;
      let itemType: 'Bird' | 'Avatar' | 'Flag' = 'Bird';

      if (profile.ownedSkins.includes(itemId)) { isOwned = true; itemType = 'Bird'; }
      else if (profile.ownedAvatars.includes(itemId)) { isOwned = true; itemType = 'Avatar'; }
      else if (profile.ownedFlags.includes(itemId)) { isOwned = true; itemType = 'Flag'; }

      if (!isOwned) return;

      const newListing: MarketListing = {
          id: Math.random().toString(36).substr(2, 9),
          sellerId: profile.id,
          sellerName: 'You',
          itemId,
          itemType,
          price
      };
      setMarketListings(prev => [newListing, ...prev]);
      
      // Remove from owned inventory temporarily while listed? (Simplification: Keep it, just block usage if desired, but for now just list)
  };

  const handleBuyMarketItem = (listingId: string) => {
      const listing = marketListings.find(l => l.id === listingId);
      if (!listing) return;
      if (profile.balance < listing.price) {
          alert("Insufficient Balance");
          return;
      }
      
      // Calculate Fee (33.3%)
      const fee = Math.floor(listing.price * MARKET_FEE_PERCENTAGE);
      const sellerReceives = listing.price - fee;

      // Update Buyer Profile
      setProfile(p => {
          let newSkins = [...p.ownedSkins];
          let newAvatars = [...p.ownedAvatars];
          let newFlags = [...p.ownedFlags];

          if (listing.itemType === 'Bird' && !newSkins.includes(listing.itemId)) newSkins.push(listing.itemId);
          if (listing.itemType === 'Avatar' && !newAvatars.includes(listing.itemId)) newAvatars.push(listing.itemId);
          if (listing.itemType === 'Flag' && !newFlags.includes(listing.itemId)) newFlags.push(listing.itemId);

          return {
              ...p,
              balance: p.balance - listing.price,
              ownedSkins: newSkins,
              ownedAvatars: newAvatars,
              ownedFlags: newFlags
          };
      });
      
      // Update Accounting
      setAccountingStats(prev => ({
          ...prev,
          revenue: {
              ...prev.revenue,
              marketFees: prev.revenue.marketFees + fee,
              total: prev.revenue.total + fee
          },
          netProfit: prev.netProfit + fee
      }));

      // Simulate Seller Balance update (In a real app, this would update seller's DB record)
      // seller.balance += sellerReceives;

      setMarketListings(prev => prev.filter(l => l.id !== listingId));
      alert(`Item Bought! Fee collected: ${fee}`);
  };

  const handleConnectWallet = () => setProfile(p => ({ ...p, walletAddress: "0x71C...9A23" }));
  const handleDisconnectWallet = () => setProfile(p => ({ ...p, walletAddress: null }));
  const handleUpdateMotherWallet = (addr: string) => setProfile(p => ({...p, motherWalletAddress: addr}));
  
  const handleBanUser = (id: string, ban: boolean) => {
      if (id === profile.id) {
          setProfile(p => ({ ...p, isBlacklisted: ban }));
      } else {
          alert(`User ${id} ${ban ? 'banned' : 'unbanned'} (Simulation)`);
      }
  };
  
  const handleAdminToggleVip = (id: string, isVip: boolean) => {
      if (id === profile.id) {
          const expiry = isVip ? new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString() : null;
          setProfile(p => ({ ...p, isVip, vipExpiryDate: expiry }));
      } else {
          alert("VIP status updated for mock user.");
      }
  };
  
  const handleWithdraw = (amount: number, dest: string) => {
      const req: WithdrawalRequest = {
          id: Math.random().toString(36).substr(2, 9),
          amount,
          destination: dest,
          status: 'Pending',
          requestDate: Date.now(),
          unlockDate: Date.now() + 24 * 60 * 60 * 1000 
      };
      setWithdrawals(prev => [req, ...prev]);
  };

  // --- SWAP LOGIC (33.3% FEE) ---
  const handleSwap = (amount: number) => {
      if (amount <= 0 || amount > profile.balance) {
          alert("Invalid swap amount");
          return;
      }
      
      // Calculate Fee (33.3%)
      const feeCoins = Math.floor(amount * MARKET_FEE_PERCENTAGE);
      const swapAmountAfterFee = amount - feeCoins;
      
      // Calculate conversion: amount * price
      const usdtValue = swapAmountAfterFee * gameSettings.ce333Price;
      
      setProfile(p => ({
          ...p,
          balance: p.balance - amount,
          usdtBalance: (p.usdtBalance || 0) + usdtValue
      }));

      // Update Accounting
      setAccountingStats(prev => ({
          ...prev,
          revenue: {
              ...prev.revenue,
              swapFees: prev.revenue.swapFees + feeCoins,
              total: prev.revenue.total + feeCoins
          },
          netProfit: prev.netProfit + feeCoins
      }));

      alert(`Swapped ${amount} CE333. Fee: ${feeCoins} CE333. Received: $${usdtValue.toFixed(2)} USDT`);
  };

  const adminReset = () => {
    setProfile(INITIAL_PLAYER_PROFILE);
    window.location.reload();
  };
  
  const adminAddCoins = (amount: number = 1000) => {
    setProfile(p => ({...p, balance: p.balance + amount}));
  };
  
  const handleWatchAdForEnergy = () => {
      setIsWatchingAd(true);
      setTimeout(() => {
          setIsWatchingAd(false);
          setProfile(p => ({...p, dailyEnergy: Math.min(MAX_DAILY_ENERGY, p.dailyEnergy + 3)}));
      }, 3000); 
  };
  
  const startVideoAd = () => {
      if (profile.dailyVideoWatchCount >= MAX_DAILY_VIDEO_ADS) {
          alert(t('dailyLimitReached'));
          return;
      }

      // Filter available ads. If none, use HOUSE ADS.
      let availableAds = MOCK_VIDEO_ADS.filter(ad => !profile.watchedAdHistory.includes(ad.id));
      
      // Also add any active USER ADS (including ADMIN ads) of type Video
      const customVideoAds = userAds.filter(ad => ad.type === 'Video' && ad.status === 'Active');
      availableAds = [...availableAds, ...customVideoAds];
      
      let selectedAd: AdCampaign;
      
      if (availableAds.length === 0) {
          // Fallback to House Ad for CE333
          const houseAd = HOUSE_ADS.find(a => a.type === 'Video') || HOUSE_ADS[0];
          selectedAd = { ...houseAd, id: 'house_' + Date.now() }; // Make ID unique to bypass history for now or loop it
      } else {
          selectedAd = availableAds[Math.floor(Math.random() * availableAds.length)];
      }
      
      setCurrentAdId(selectedAd.id);
      setShowRewardMenu(false);
      setPlayingVideo(true);
      setVideoTimer(20);
  };

  useEffect(() => {
     let interval: any;
     if (playingVideo && videoTimer > 0) {
         interval = setInterval(() => {
             setVideoTimer(prev => prev - 1);
         }, 1000);
     } else if (playingVideo && videoTimer === 0) {
         setTimeout(() => {
             setPlayingVideo(false);
             
             setProfile(p => {
                 const newHistory = [currentAdId!, ...p.watchedAdHistory].slice(0, AD_HISTORY_LIMIT);
                 const newProgress = p.videoAdProgress + 1;
                 const newDailyCount = p.dailyVideoWatchCount + 1;
                 
                 let newBalance = p.balance;
                 let finalProgress = newProgress;
                 
                 if (newProgress >= VIDEOS_FOR_REWARD) {
                     newBalance += 1;
                     finalProgress = 0; 
                 }

                 return {
                     ...p,
                     dailyVideoWatchCount: newDailyCount,
                     watchedAdHistory: newHistory,
                     videoAdProgress: finalProgress,
                     balance: newBalance
                 };
             });
             
         }, 1000);
     }
     return () => clearInterval(interval);
  }, [playingVideo, videoTimer, currentAdId]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
      if (status === GameStatus.PLAYING) {
        setTriggerJump(prev => prev + 1);
      }
    }
  }, [status]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const getThemeIcon = () => {
    if (config.timeOfDay === 'Night') return <Moon className="w-6 h-6 text-yellow-200" />;
    if (config.season === 'Winter') return <CloudSnow className="w-6 h-6 text-blue-200" />;
    if (config.season === 'Autumn') return <Wind className="w-6 h-6 text-orange-300" />;
    return <Sun className="w-6 h-6 text-yellow-400" />;
  };

  const handleAcceptTerms = () => {
      setProfile(p => ({ ...p, hasAcceptedTerms: true }));
  };

  // --- ACCOUNT MANAGEMENT ---
  const handleDeleteAccount = () => {
      if (confirm(t('deleteAccountConfirm'))) {
          localStorage.removeItem('ce333-profile');
          setProfile(INITIAL_PLAYER_PROFILE);
          setView(View.LANDING);
          window.location.reload();
      }
  };

  const handleRestorePurchases = () => {
      // In a real app, this would query the IAP API (Google Play Billing / App Store Kit).
      // Here we simulate a successful restoration.
      alert(t('restoreSuccess'));
  };

  if (view === View.LANDING) {
    return <Landing 
        onEnter={() => {
            if (!profile.hasCompletedSetup) {
                setView(View.SETUP);
            } else {
                setView(View.HOME);
            }
        }} 
        lang={language} 
        setLang={setLanguage} 
        t={t}
        onOpenAds={() => setView(View.ADS_MANAGER)} // PASS AD HANDLER
    />;
  }

  // --- DISCLAIMER MODAL (STRICT COMPLIANCE) ---
  if (!profile.hasAcceptedTerms && view !== View.LANDING) {
      return (
          <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-lg flex items-center justify-center p-6 text-slate-900" dir={language === 'fa' || language === 'ar' ? 'rtl' : 'ltr'}>
              <div className="bg-[#f0f0f0] max-w-md w-full rounded-sm shadow-2xl p-8 border-4 border-double border-slate-400 relative overflow-hidden transform rotate-1 animate-in zoom-in duration-300">
                  {/* Paper texture effect */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none" style={{backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")'}}></div>
                  
                  <div className="flex flex-col items-center text-center gap-4 relative z-10">
                      <Shield size={48} className="text-slate-600 mb-2"/>
                      <h2 className="text-2xl font-black uppercase tracking-widest border-b-2 border-slate-800 pb-2 mb-2 w-full">{t('termsTitle')}</h2>
                      
                      <p className="text-sm font-serif leading-relaxed text-justify px-4">
                          {t('termsText')}
                      </p>
                      
                      <div className="w-full h-px bg-slate-300 my-4"></div>
                      
                      <button 
                        onClick={handleAcceptTerms}
                        className="bg-slate-800 text-white px-8 py-4 w-full font-bold text-lg hover:bg-slate-700 transition-colors shadow-lg flex items-center justify-center gap-2 group"
                      >
                          <CheckCircle className="group-hover:text-green-400 transition-colors"/>
                          {t('iAccept')}
                      </button>
                  </div>
              </div>
          </div>
      );
  }

  if (view === View.SETUP) {
     return <WelcomeSetup onComplete={handleSetupComplete} t={t} />;
  }
  
  const currentTickerPrompt = TICKER_PROMPTS[tickerIndex];

  return (
    <div dir={language === 'fa' || language === 'ar' ? 'rtl' : 'ltr'} className="fixed inset-0 overflow-hidden bg-black select-none font-sans flex flex-col">
      
      {/* Background Game Canvas */}
      <div className="absolute inset-0 z-0">
         <GameCanvas 
            status={status}
            config={config}
            playerProfile={profile}
            gameEffects={gameEffects}
            onGameOver={handleGameOver}
            onScoreUpdate={handleScoreUpdate}
            onShieldBreak={handleShieldBreak}
            triggerJump={triggerJump}
            width={windowSize.width}
            height={windowSize.height}
            sessionId={sessionId}
        />
      </div>
      
      {/* MUSIC PLAYER */}
      <audio ref={audioRef} src={MUSIC_URL} loop />

      {/* ROTATING MARKET TICKER (UPDATED LARGER UI) */}
      <div className="absolute top-0 inset-x-0 bg-slate-900/90 backdrop-blur-md z-[60] h-10 border-b border-white/10 overflow-hidden flex items-center justify-center">
          <div key={tickerIndex} className="flex items-center gap-2 text-sm font-bold font-mono tracking-wider animate-in fade-in slide-in-from-top-2 duration-500">
              {currentTickerPrompt === 'marketPrice' ? (
                   <span className="text-green-400 flex items-center gap-2"><TrendingUp size={16}/> MARKET: 1 CE333 = ${gameSettings.ce333Price.toFixed(2)} USD</span>
              ) : (
                   <span className="text-cyan-300 flex items-center gap-2"><Megaphone size={16} className="text-yellow-400"/> {t(currentTickerPrompt)}</span>
              )}
          </div>
      </div>

      {/* FIXED HEADER: AVATAR & COINS (UPDATED LAYOUT) */}
      {view !== View.LANDING && view !== View.SETUP && (
         <>
             {/* LEFT SIDE: AVATAR / COINS / USDT / ENERGY */}
             <div className="absolute top-12 left-6 z-[70] flex flex-col items-center gap-1.5">
                 {/* AVATAR - Oval Shape */}
                 <div className="relative cursor-pointer transition-transform hover:scale-110 mt-2" onClick={() => setView(View.DASHBOARD)}>
                      <div className="w-[70px] h-[56px] rounded-[24px] border-2 border-cyan-400 overflow-hidden bg-black/50 shadow-xl flex items-center justify-center">
                          <div className="w-full h-full transform scale-110">
                             <AvatarPreview avatarId={profile.avatarId} flagId={profile.flagId} size={70} />
                          </div>
                      </div>
                      {isVipActive && (
                        <div className="absolute -top-3 -right-3 animate-bounce">
                           <Crown size={24} className="text-yellow-400 fill-yellow-500 drop-shadow-md"/>
                        </div>
                      )}
                 </div>

                 {/* COINS */}
                 <div className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full flex items-center gap-1 border border-white/10 w-full justify-center">
                    <Coins size={10} className="text-yellow-400"/>
                    <span className="text-white font-mono text-[10px] font-bold">{profile.balance}</span>
                 </div>

                 {/* USDT */}
                 <div className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full flex items-center gap-1 border border-green-500/30 w-full justify-center">
                    <DollarSign size={10} className="text-green-400"/>
                    <span className="text-green-400 font-mono text-[10px] font-bold">{profile.usdtBalance?.toFixed(2) || '0.00'}</span>
                 </div>

                 {/* DAILY ENERGY */}
                 <div className={`bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full flex items-center gap-1 border border-white/10 w-full justify-center ${profile.dailyEnergy === 0 && !isVipActive ? 'border-red-500/50' : ''}`}>
                    {isVipActive ? (
                        <>
                           <Zap size={10} className="text-yellow-400 fill-yellow-400"/>
                           <span className="text-[10px] font-bold font-mono text-yellow-400">VIP</span>
                        </>
                    ) : (
                        <>
                           <Battery size={10} className={profile.dailyEnergy > 0 ? 'text-green-400' : 'text-red-400'}/>
                           <span className={`text-[10px] font-bold font-mono ${profile.dailyEnergy > 0 ? 'text-white' : 'text-red-400'}`}>
                               {profile.dailyEnergy}
                           </span>
                        </>
                    )}
                 </div>
                 
             </div>

             {/* RIGHT SIDE: CE333 AD BANNER & CONTROLS */}
             <div className="absolute top-14 right-6 z-[60] flex flex-col items-end animate-in fade-in slide-in-from-right gap-2">
                  <div className="bg-gradient-to-r from-blue-900/90 to-cyan-900/90 p-2 rounded-xl border border-cyan-500/30 shadow-lg flex items-center gap-3 animate-pulse cursor-pointer hover:scale-105 transition-transform">
                      <div className="flex items-center gap-2">
                          <div className="bg-white/10 p-1.5 rounded-lg"><Coins className="text-cyan-400" size={16}/></div>
                          <div className="text-left">
                              <p className="text-[10px] text-cyan-200 font-bold tracking-wider">CE333 TOKEN</p>
                              <p className="text-[9px] text-white/70">Stake & Earn</p>
                          </div>
                      </div>
                  </div>
                  
                  <div className="flex gap-2">
                      {/* AUDIO TOGGLE */}
                      <button onClick={toggleMute} className="text-white/70 hover:text-white bg-black/40 p-2 rounded-full border border-white/10">
                          {isMuted ? <VolumeX size={16}/> : <Volume2 size={16} className="text-green-400"/>}
                      </button>

                      {/* ADMIN ICON */}
                      {status === GameStatus.IDLE && (
                        <button onClick={() => setView(View.ADMIN)} className="text-white/30 hover:text-white transition-colors bg-black/20 p-2 rounded-full">
                           <Settings size={16}/>
                        </button>
                      )}
                  </div>
             </div>
         </>
      )}

      {/* --- HUD --- */}
      {status === GameStatus.PLAYING && (
        <>
          <div className="absolute top-24 inset-x-0 flex justify-center pointer-events-none z-20">
            <span className="text-8xl font-black text-white drop-shadow-[0_8px_8px_rgba(0,0,0,0.5)]" 
                  style={{ WebkitTextStroke: '3px rgba(0,0,0,0.5)' }}>
              {score}
            </span>
          </div>
          
          <div className="absolute bottom-24 right-4 z-30 flex flex-col gap-3">
             {/* SHIELD BTN */}
             {((profile.consumables.shields || 0) > 0 || gameEffects.hasShield || isDayOneBonus() || (profile.isVip && profile.vipDailyUsageUSD < VIP_DAILY_LIMIT_USD)) && (
                <button 
                  onClick={activateShield}
                  disabled={gameEffects.hasShield}
                  className={`w-14 h-14 rounded-full flex items-center justify-center border-2 shadow-xl transition-all
                     ${gameEffects.hasShield ? 'bg-cyan-500/50 border-cyan-400 animate-pulse' : 'bg-black/60 border-cyan-500/30 hover:bg-cyan-900/50'}
                  `}
                >
                   <Shield size={24} className="text-cyan-300" />
                   {isDayOneBonus() ? (
                        <span className="absolute -top-1 -right-1 bg-yellow-500 text-[8px] w-5 h-5 flex items-center justify-center rounded-full text-white font-bold">∞</span>
                   ) : profile.isVip && profile.vipDailyUsageUSD < VIP_DAILY_LIMIT_USD ? (
                        <span className="absolute -top-1 -right-1 bg-yellow-500 text-[8px] w-5 h-5 flex items-center justify-center rounded-full text-white font-bold">$</span>
                   ) : (
                        <span className="absolute -top-1 -right-1 bg-cyan-600 text-[10px] w-5 h-5 flex items-center justify-center rounded-full text-white">
                            {profile.consumables.shields || 0}
                        </span>
                   )}
                </button>
             )}

             {/* NITRO BTN */}
             {((profile.consumables.nitros || 0) > 0 || gameEffects.hasNitro || isDayOneBonus() || (profile.isVip && profile.vipDailyUsageUSD < VIP_DAILY_LIMIT_USD)) && (
                <button 
                  onClick={activateNitro}
                  disabled={gameEffects.hasNitro}
                  className={`w-14 h-14 rounded-full flex items-center justify-center border-2 shadow-xl transition-all
                     ${gameEffects.hasNitro ? 'bg-orange-500/50 border-orange-400 animate-pulse' : 'bg-black/60 border-orange-500/30 hover:bg-orange-900/50'}
                  `}
                >
                   <Rocket size={24} className="text-orange-300" />
                   {isDayOneBonus() ? (
                        <span className="absolute -top-1 -right-1 bg-yellow-500 text-[8px] w-5 h-5 flex items-center justify-center rounded-full text-white font-bold">∞</span>
                   ) : profile.isVip && profile.vipDailyUsageUSD < VIP_DAILY_LIMIT_USD ? (
                        <span className="absolute -top-1 -right-1 bg-yellow-500 text-[8px] w-5 h-5 flex items-center justify-center rounded-full text-white font-bold">$</span>
                   ) : (
                        <span className="absolute -top-1 -right-1 bg-orange-600 text-[10px] w-5 h-5 flex items-center justify-center rounded-full text-white">
                            {profile.consumables.nitros || 0}
                        </span>
                   )}
                </button>
             )}
          </div>
        </>
      )}

      {/* --- MENUS --- */}
      {status !== GameStatus.PLAYING && (
        <div className="absolute inset-0 z-30 flex flex-col pt-10"> 
            
            {view === View.HOME && status === GameStatus.IDLE && (
                <div className="absolute right-4 top-1/3 z-40 flex flex-col gap-4 animate-in fade-in slide-in-from-right-10">
                    <button 
                        onClick={() => setShowRewardMenu(true)}
                        className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.5)] animate-bounce hover:scale-110 transition-transform border-2 border-white"
                    >
                        <Gift size={24} className="text-white" />
                    </button>
                </div>
            )}
            
            {playingVideo && (
                 <div className="absolute inset-0 z-[100] bg-black flex flex-col items-center justify-center animate-in fade-in duration-300">
                     <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative aspect-video flex flex-col items-center justify-center">
                         {videoTimer > 0 ? (
                             <>
                                 <div className="absolute top-4 left-4 bg-red-600 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider animate-pulse">
                                     LIVE
                                 </div>
                                 <PlayCircle size={64} className="text-white/20 animate-ping absolute"/>
                                 <p className="text-white font-bold text-lg z-10">{t('watchingVideo')}</p>
                                 <p className="text-white/50 text-sm z-10 mt-2">{t('videoCampaign')}</p>
                                 
                                 <div className="absolute bottom-0 left-0 h-1 bg-red-600 transition-all duration-1000 ease-linear" style={{ width: `${(videoTimer / 20) * 100}%` }}></div>
                                 <div className="absolute top-4 right-4 bg-black/60 px-3 py-1 rounded-full text-xs font-mono">
                                     {videoTimer}s
                                 </div>
                             </>
                         ) : (
                             <div className="flex flex-col items-center gap-4">
                                 <CheckCircle size={64} className="text-green-400 animate-bounce"/>
                                 <h2 className="text-2xl font-bold text-white">Video Complete</h2>
                                 <div className="text-white/60">
                                     {profile.videoAdProgress === 0 ? (
                                         <div className="flex items-center gap-2 text-yellow-400 font-bold text-xl">
                                             <Coins size={24}/> +1 CE333
                                         </div>
                                     ) : (
                                         <p>Progress: {profile.videoAdProgress}/3</p>
                                     )}
                                 </div>
                             </div>
                         )}
                     </div>
                     {videoTimer > 0 && <p className="text-white/30 text-xs mt-4">Do not close window</p>}
                 </div>
            )}

            {showRewardMenu && (
                <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-slate-900 border border-yellow-500/30 p-6 rounded-2xl w-full max-w-sm relative shadow-2xl">
                        <button onClick={() => setShowRewardMenu(false)} className="absolute top-2 right-2 text-white/50 hover:text-white p-2"><X size={20}/></button>
                        <h3 className="text-xl font-bold text-yellow-400 mb-6 flex items-center gap-2"><Gift size={24}/> {t('specialOffers')}</h3>

                        <div className="space-y-4">
                             {/* Energy Ad */}
                             {profile.dailyEnergy < MAX_DAILY_ENERGY && !isVipActive ? (
                                <button 
                                    onClick={() => { handleWatchAdForEnergy(); setShowRewardMenu(false); }}
                                    disabled={isWatchingAd}
                                    className="w-full bg-slate-800 hover:bg-slate-700 border border-green-500/30 p-4 rounded-xl flex items-center justify-between group transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="bg-green-500/20 p-2 rounded-lg text-green-400"><BatteryCharging size={24}/></div>
                                        <div className="text-left">
                                            <p className="font-bold text-white text-sm">{t('watchAdEnergy')}</p>
                                            <p className="text-xs text-white/50">Refill +3 Energy</p>
                                        </div>
                                    </div>
                                    <Tv size={20} className="text-white/30 group-hover:text-white"/>
                                </button>
                             ) : (
                                <div className="w-full bg-slate-800/50 p-4 rounded-xl flex items-center gap-3 opacity-50 border border-white/5">
                                    <CheckCircle size={24} className="text-green-500"/>
                                    <p className="text-sm font-bold text-white">{isVipActive ? 'VIP Infinite Energy' : 'Energy Full'}</p>
                                </div>
                             )}
                             
                             {/* WATCH VIDEO CLIP */}
                             {profile.dailyVideoWatchCount < MAX_DAILY_VIDEO_ADS ? (
                                 <button 
                                    onClick={startVideoAd}
                                    className="w-full bg-gradient-to-r from-red-900/40 to-slate-800 hover:from-red-900/60 border border-red-500/30 p-4 rounded-xl flex items-center justify-between group transition-colors"
                                 >
                                     <div className="flex items-center gap-3">
                                        <div className="bg-red-500/20 p-2 rounded-lg text-red-400"><PlayCircle size={24}/></div>
                                        <div className="text-left">
                                             <p className="font-bold text-white text-sm">{t('watchVideo')}</p>
                                             <div className="flex items-center gap-1 text-xs text-white/50">
                                                 <span>{t('videoProgress')}:</span>
                                                 <div className="flex gap-1">
                                                     {[0, 1, 2].map(i => (
                                                         <div key={i} className={`w-2 h-2 rounded-full ${i < profile.videoAdProgress ? 'bg-green-400' : 'bg-white/20'}`}></div>
                                                     ))}
                                                 </div>
                                             </div>
                                             <p className="text-[10px] text-green-400 font-mono mt-0.5">{t('videoReward')}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <Play size={20} className="text-white/30 group-hover:text-white fill-current"/>
                                        <span className="text-[9px] text-white/30">{profile.dailyVideoWatchCount}/{MAX_DAILY_VIDEO_ADS}</span>
                                    </div>
                                 </button>
                             ) : (
                                 <div className="w-full bg-slate-800/50 p-4 rounded-xl flex items-center gap-3 opacity-50 border border-white/5">
                                    <AlertTriangle size={24} className="text-red-500"/>
                                    <p className="text-sm font-bold text-white">{t('dailyLimitReached')}</p>
                                </div>
                             )}
                        </div>
                    </div>
                </div>
            )}

            <div className="flex-1 relative flex items-center justify-center">
                
                {view === View.DASHBOARD && (
                    <Dashboard 
                    profile={profile} 
                    onBack={() => setView(View.HOME)} 
                    onUpgrade={handleUpgrade}
                    onEquip={handleEquipSkin}
                    onConnectWallet={handleConnectWallet}
                    onDisconnectWallet={handleDisconnectWallet}
                    onContactSupport={handleContactSupport}
                    onSwap={handleSwap}
                    supportTickets={supportTickets}
                    t={t}
                    onBuyAvatar={handleBuyAvatar}
                    onBuyFlag={handleBuyFlag}
                    onEquipAvatar={handleEquipAvatar}
                    onEquipFlag={handleEquipFlag}
                    onDeleteAccount={handleDeleteAccount} // PASS DELETE HANDLER
                    />
                )}

                {view === View.SHOP && (
                    <Shop 
                    profile={profile} 
                    marketListings={marketListings}
                    onBack={() => setView(View.HOME)} 
                    onBuy={handleBuySkin}
                    onEquip={handleEquipSkin}
                    onBuyEnergy={handleBuyEnergy}
                    onBuyRevive={handleBuyRevive}
                    onBuyShield={handleBuyShield}
                    onBuyNitro={handleBuyNitro}
                    onBuyVIP={handleBuyVIP}
                    onListMarketItem={handleListMarketItem}
                    onBuyMarketItem={handleBuyMarketItem}
                    t={t}
                    gameSettings={gameSettings} 
                    onRestorePurchases={handleRestorePurchases} // PASS RESTORE HANDLER
                    />
                )}

                {view === View.ADMIN && (
                    <Admin 
                    profile={profile}
                    gameSettings={gameSettings}
                    withdrawals={withdrawals}
                    onBack={() => setView(View.HOME)}
                    onReset={adminReset}
                    onAddCoins={adminAddCoins}
                    onUpdateMotherWallet={handleUpdateMotherWallet}
                    onUpdateGameSettings={setGameSettings}
                    onBanUser={handleBanUser}
                    onWithdraw={handleWithdraw}
                    onToggleVip={handleAdminToggleVip}
                    influencerSubmissions={influencerSubmissions}
                    onReviewSubmission={handleReviewSubmission}
                    supportTickets={supportTickets}
                    onReplyTicket={handleReplyTicket}
                    onPublishAd={handlePublishAd}
                    userAds={userAds}
                    t={t}
                    />
                )}

                {view === View.ADS_MANAGER && (
                    <AdsManager 
                    profile={profile}
                    onBack={() => setView(View.HOME)}
                    onPublish={handlePublishAd}
                    t={t}
                    gameSettings={gameSettings}
                    />
                )}

                {view === View.REFERRAL && (
                    <Referral 
                    profile={profile}
                    onBack={() => setView(View.HOME)}
                    onSimulateInvite={handleSimulateInvite}
                    onSubmitProof={handleSubmitProof}
                    t={t}
                    />
                )}

                {(view === View.HOME || view === View.GAME) && (
                    <div className="bg-white/10 border border-white/20 p-6 md:p-8 rounded-3xl shadow-2xl max-w-md w-full mx-4 backdrop-blur-md relative overflow-hidden flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300 mt-20 md:mt-0">
                        
                        {status === GameStatus.LOADING_AI ? (
                            <div className="flex flex-col items-center gap-6 py-8 text-white">
                                <Loader2 className="w-16 h-16 animate-spin text-cyan-300" />
                                <div className="text-center">
                                <p className="text-2xl font-bold mb-2">{t('loadingAi')}</p>
                                </div>
                            </div>
                        ) : (
                        <>
                            <div className="flex flex-col items-center text-center gap-2">
                            {status === GameStatus.GAME_OVER ? (
                                <>
                                    <h2 className="text-4xl font-black text-red-500 drop-shadow-md">{t('gameOver')}</h2>
                                    <div className="flex items-center justify-center gap-4 mt-2">
                                        <div className="flex items-center gap-2 text-white bg-slate-800/50 px-3 py-1 rounded-lg">
                                            <span>Score: {score}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-1">
                                        {[...Array(MAX_RETRIES_PER_GAME)].map((_, i) => (
                                            <Heart key={i} size={20} className={i < retriesLeft ? "text-red-500 fill-red-500" : "text-slate-600"} />
                                        ))}
                                    </div>
                                    {isVipActive && <div className="text-xs text-yellow-400 font-bold mt-1 bg-yellow-500/10 px-2 rounded border border-yellow-500/20">{t('vipHardcore')}</div>}
                                </>
                            ) : (
                                <>
                                    <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 drop-shadow-lg">
                                        Creative Energy
                                    </h1>
                                    <div className="text-3xl font-black text-white tracking-[0.5em] opacity-80 mt-[-5px]">333</div>
                                </>
                            )}
                            </div>

                            {status === GameStatus.IDLE && (
                            <div className="w-full bg-black/20 rounded-2xl p-4 border border-white/10 flex flex-col items-center gap-2">
                                {/* DAY 1 BONUS BANNER */}
                                {isDayOneBonus() && (
                                    <div className="w-full bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg p-3 text-center mb-2 animate-pulse shadow-lg">
                                        <h3 className="text-white font-black text-sm flex items-center justify-center gap-2"><Gift size={16}/> {t('dayOneBonus')}</h3>
                                        <p className="text-[10px] text-white/90">{t('dayOneDesc')}</p>
                                    </div>
                                )}
                                
                                <div className="flex items-center gap-2 text-white/90 font-bold text-lg">
                                {getThemeIcon()}
                                <span>{config.themeName}</span>
                                </div>
                                <p className="text-white/60 text-sm leading-relaxed max-w-[90%] text-center line-clamp-2">
                                {config.themeDescription}
                                </p>
                            </div>
                            )}

                            {/* VIP BANNER IN MENU */}
                            {status === GameStatus.IDLE && !isVipActive && (
                                <button 
                                  onClick={() => setView(View.SHOP)}
                                  className="w-full bg-gradient-to-r from-yellow-900/50 to-amber-900/50 border border-yellow-500/30 rounded-xl p-3 flex items-center justify-between group hover:border-yellow-500/60 transition-colors"
                                >
                                   <div className="flex items-center gap-3">
                                       <div className="bg-yellow-500/20 p-2 rounded-full text-yellow-400"><Crown size={20}/></div>
                                       <div className="text-left">
                                           <p className="font-bold text-yellow-200 text-sm">{t('getVipNow')}</p>
                                           <p className="text-[10px] text-yellow-100/50">{t('vipDesc')}</p>
                                       </div>
                                   </div>
                                   <ChevronRight size={16} className="text-yellow-500/50 group-hover:text-yellow-400"/>
                                </button>
                            )}

                            {status === GameStatus.IDLE ? (
                                <div className="space-y-3 w-full">
                                    <button 
                                    onClick={handleStart}
                                    disabled={!isVipActive && profile.dailyEnergy <= 0}
                                    className={`w-full py-4 rounded-2xl font-bold text-xl shadow-lg transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3 group
                                        ${isVipActive || profile.dailyEnergy > 0 ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-500/20' : 'bg-slate-700 text-slate-400 cursor-not-allowed'}
                                    `}
                                    >
                                    <Play className="fill-current"/>
                                    {isVipActive || profile.dailyEnergy > 0 ? t('start') : t('outOfEnergy')}
                                    </button>
                                </div>
                            ) : (
                            <div className="grid grid-cols-1 gap-3 w-full">
                                {retriesLeft > 0 ? (
                                    <button 
                                    onClick={handleRetry}
                                    className="bg-green-600 hover:bg-green-500 text-white py-3 rounded-xl font-bold shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
                                    >
                                    <RotateCcw size={18} /> {t('freeRetry')} ({retriesLeft})
                                    </button>
                                ) : (profile.consumables?.revives || 0) > 0 || isDayOneBonus() || (isVipActive && profile.vipDailyUsageUSD < VIP_DAILY_LIMIT_USD) ? (
                                    <button 
                                        onClick={handleUseRevivePotion}
                                        className="bg-pink-600 hover:bg-pink-500 text-white py-3 rounded-xl font-bold shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <HeartPulse size={18} /> 
                                        {isDayOneBonus() ? '∞' : profile.consumables.revives} 
                                        {isVipActive && !isDayOneBonus() ? <span className="text-[10px] bg-yellow-500/30 px-1 rounded">VIP FREE</span> : ''}
                                        {t('usePotion')}
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => setView(View.SHOP)}
                                        className="bg-slate-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                                    >
                                       <ShoppingBag size={18}/> {t('buyRevives')}
                                    </button>
                                )}
                                
                                <button 
                                    onClick={() => setStatus(GameStatus.IDLE)}
                                    className="bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl font-bold shadow-lg transition-transform active:scale-95"
                                >
                                    {t('mainMenu')}
                                </button>
                            </div>
                            )}

                            {status === GameStatus.IDLE && gameSettings.useAi && (
                            <div className="w-full">
                                <div className="grid grid-cols-3 gap-3">
                                <button onClick={() => handleGenerateChallenge('Easy')} 
                                    className={`challenge-btn from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 ${difficulty === 'Easy' ? 'ring-2 ring-white scale-105' : 'opacity-80'}`}>
                                    <Feather size={18} /><span>{t('easy')}</span>
                                </button>
                                <button onClick={() => handleGenerateChallenge('Hard')} 
                                    className={`challenge-btn from-orange-600 to-red-700 hover:from-orange-500 hover:to-red-600 ${difficulty === 'Hard' ? 'ring-2 ring-white scale-105' : 'opacity-80'}`}>
                                    <Zap size={18} /><span>{t('hard')}</span>
                                </button>
                                <button onClick={() => handleGenerateChallenge('Crazy')} 
                                    className={`challenge-btn from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 ${difficulty === 'Crazy' ? 'ring-2 ring-white scale-105' : 'opacity-80'}`}>
                                    <Cpu size={18} /><span>{t('crazy')}</span>
                                </button>
                                </div>
                            </div>
                            )}

                             {/* INVITE FRIENDS BOTTOM CARD */}
                             {status === GameStatus.IDLE && (
                                 <button 
                                    onClick={() => setView(View.REFERRAL)}
                                    className="w-full bg-slate-800/80 hover:bg-slate-700 border border-white/10 rounded-xl p-3 flex items-center justify-between transition-colors group"
                                 >
                                     <div className="flex items-center gap-3">
                                         <div className="bg-green-500/20 p-2 rounded-lg text-green-400">
                                             <Users size={20}/>
                                         </div>
                                         <div className="text-left">
                                             <p className="font-bold text-white text-sm group-hover:text-green-200">{t('inviteEarn')}</p>
                                             <p className="text-[10px] text-white/50">{t('inviteFriends')}</p>
                                         </div>
                                     </div>
                                     <ChevronRight size={16} className="text-white/50 group-hover:text-white"/>
                                 </button>
                             )}

                            {status === GameStatus.IDLE && (
                                <button onClick={() => setView(View.LANDING)} className="w-full bg-slate-800 hover:bg-slate-700 text-white/70 hover:text-white flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-colors">
                                    <LogOut size={16} /> {t('backToTitle')}
                                </button>
                            )}

                             {aiError && (
                                <div className="text-center text-red-300 text-xs bg-red-900/80 py-1 rounded">
                                    {aiError}
                                </div>
                            )}
                        </>
                        )}
                    </div>
                )}
            </div>

            <div className="bg-slate-900/90 backdrop-blur-md border-t border-white/10 pb-6 pt-3 px-6 flex justify-between items-center z-[100]">
               <button onClick={() => setView(View.HOME)} className={`flex flex-col items-center gap-1 transition-colors ${view === View.HOME || view === View.GAME ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}>
                   <Home size={24} />
                   <span className="text-[10px] font-bold">{t('home')}</span>
               </button>
               <button onClick={() => setView(View.DASHBOARD)} className={`flex flex-col items-center gap-1 transition-colors ${view === View.DASHBOARD ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}>
                   <LayoutDashboard size={24} />
                   <span className="text-[10px] font-bold">{t('dash')}</span>
               </button>
               
               <div className="relative -top-5">
                   <button onClick={handleStart} className="bg-gradient-to-r from-cyan-500 to-blue-600 p-4 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.5)] border-4 border-slate-900 transform active:scale-95 transition-transform hover:scale-110">
                       <Play fill="white" className="text-white ml-1"/>
                   </button>
               </div>

               <button onClick={() => setView(View.SHOP)} className={`flex flex-col items-center gap-1 transition-colors ${view === View.SHOP ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}>
                   <ShoppingBag size={24} />
                   <span className="text-[10px] font-bold">{t('shop')}</span>
               </button>
               
               <button onClick={() => setView(View.ADS_MANAGER)} className={`flex flex-col items-center gap-1 transition-colors ${view === View.ADS_MANAGER ? 'text-pink-400' : 'text-slate-500 hover:text-pink-300'}`}>
                   <Megaphone size={24} />
                   <span className="text-[10px] font-bold">{t('ads')}</span>
               </button>
            </div>
            
        </div>
      )}

      <style>{`
        .challenge-btn {
          @apply bg-gradient-to-b text-white py-3 rounded-xl font-bold text-sm shadow-lg transition-all active:scale-95 flex flex-col items-center gap-1 border border-white/10;
        }
      `}</style>
    </div>
  );
}