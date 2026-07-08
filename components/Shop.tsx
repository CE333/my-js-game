
import React, { useState } from 'react';
import { PlayerProfile, MarketListing, GameSettings } from '../types';
import { BIRD_SKINS, AVATARS, FLAGS, MARKET_FEE_PERCENTAGE, VIP_MONTHLY_PRICE_USD, VIP_PRICE_COINS, MAX_DAILY_ENERGY } from '../constants';
import { ArrowLeft, Coins, Check, Lock, BatteryCharging, HeartPulse, Shield, Rocket, Users, Plus, X, ShoppingBag, Crown, AlertCircle, RefreshCw } from 'lucide-react';
import BirdPreview from './BirdPreview';
import AvatarPreview from './AvatarPreview';

interface ShopProps {
  profile: PlayerProfile;
  marketListings: MarketListing[];
  onBack: () => void;
  onBuy: (skinId: string) => void;
  onEquip: (skinId: string) => void;
  onBuyEnergy: () => void;
  onBuyRevive: () => void;
  onBuyShield: () => void;
  onBuyNitro: () => void;
  onBuyVIP: (method?: 'USD' | 'COINS') => void; 
  onListMarketItem: (itemId: string, price: number) => void;
  onBuyMarketItem: (listingId: string) => void;
  t: (key: string) => string;
  gameSettings: GameSettings;
  onRestorePurchases: () => void; // New Prop
}

const Shop: React.FC<ShopProps> = ({ 
  profile, marketListings, onBack, onBuy, onEquip, 
  onBuyEnergy, onBuyRevive, onBuyShield, onBuyNitro, onBuyVIP,
  onListMarketItem, onBuyMarketItem, t, gameSettings, onRestorePurchases
}) => {
  const [activeTab, setActiveTab] = useState<'birds' | 'gear' | 'market'>('birds');
  const [listingItemId, setListingItemId] = useState<string | null>(null);
  const [listingPrice, setListingPrice] = useState(100);

  const handleList = () => {
    if (listingItemId) {
      onListMarketItem(listingItemId, listingPrice);
      setListingItemId(null);
    }
  };

  const handleBuy = (skinId: string) => {
      onBuy(skinId);
  }

  // Get list of sellable items
  const sellableSkins = profile.ownedSkins.filter(id => id !== 'ce333').map(id => {
      const s = BIRD_SKINS.find(x => x.id === id);
      return { id, name: s?.name || id, type: 'Bird' };
  });
  const sellableAvatars = profile.ownedAvatars.filter(id => id !== 'male_default' && id !== 'female_default').map(id => {
      const a = AVATARS.find(x => x.id === id);
      return { id, name: a?.name || id, type: 'Avatar' };
  });
  const sellableFlags = profile.ownedFlags.filter(id => id !== 'none').map(id => {
      const f = FLAGS.find(x => x.id === id);
      return { id, name: f?.name || id, type: 'Flag' };
  });

  const allSellableItems = [...sellableSkins, ...sellableAvatars, ...sellableFlags];

  const calculatedFee = Math.floor(listingPrice * MARKET_FEE_PERCENTAGE);
  const sellerReceives = listingPrice - calculatedFee;

  return (
    <div className="absolute inset-0 bg-slate-900/85 backdrop-blur-md z-50 flex flex-col text-white pb-20">
       {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-white/10 bg-black/40">
         <div className="flex items-center gap-4">
             <button onClick={onBack} className="flex items-center gap-1 px-3 py-2 hover:bg-white/10 rounded-lg transition-colors border border-white/10">
                 <ArrowLeft size={20} />
                 <span className="text-sm font-bold">{t('back')}</span>
             </button>
             <h1 className="text-xl font-bold tracking-wider text-purple-400">{t('shop').toUpperCase()}</h1>
         </div>
         {/* RESTORE PURCHASES BUTTON */}
         <button onClick={onRestorePurchases} className="text-xs text-white/50 hover:text-white flex items-center gap-1 underline">
             <RefreshCw size={12}/> {t('restorePurchases')}
         </button>
      </div>

      {/* Tabs */}
      <div className="flex p-2 bg-black/40 gap-2">
         <button 
           onClick={() => setActiveTab('birds')} 
           className={`flex-1 py-3 rounded-xl font-bold transition-all ${activeTab === 'birds' ? 'bg-purple-600 text-white' : 'bg-white/5 text-slate-400'}`}
         >
           {t('birds')}
         </button>
         <button 
           onClick={() => setActiveTab('gear')} 
           className={`flex-1 py-3 rounded-xl font-bold transition-all ${activeTab === 'gear' ? 'bg-purple-600 text-white' : 'bg-white/5 text-slate-400'}`}
         >
           {t('gear')}
         </button>
         <button 
           onClick={() => setActiveTab('market')} 
           className={`flex-1 py-3 rounded-xl font-bold transition-all ${activeTab === 'market' ? 'bg-purple-600 text-white' : 'bg-white/5 text-slate-400'}`}
         >
           {t('market')}
         </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        
        {/* --- GEAR TAB --- */}
        {activeTab === 'gear' && (
           <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
               
               {/* VIP CARD */}
               <div className="bg-gradient-to-r from-yellow-900/50 to-amber-900/50 rounded-2xl p-6 border border-yellow-500/50 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-10"><Crown size={120} className="text-yellow-500"/></div>
                   <h2 className="text-2xl font-black text-yellow-400 mb-2 flex items-center gap-2"><Crown size={32}/> {t('vipClub')}</h2>
                   <p className="text-yellow-200/80 mb-6 max-w-xs">{t('vipDesc')}</p>
                   
                   {profile.isVip ? (
                       <div className="bg-yellow-500/20 border border-yellow-500 text-yellow-400 font-bold py-3 px-6 rounded-xl inline-flex items-center gap-2">
                           <Check size={20}/> {t('vipActive')}
                       </div>
                   ) : (
                       <div className="flex flex-col sm:flex-row gap-3">
                           <button 
                             onClick={() => onBuyVIP('USD')}
                             className="bg-yellow-500 hover:bg-yellow-400 text-black font-black py-4 px-6 rounded-xl shadow-[0_0_20px_rgba(234,179,8,0.5)] transform transition-transform hover:scale-105 active:scale-95 flex items-center gap-2 justify-center"
                           >
                               {t('subscribeVip')} 
                               <span className="text-xs bg-black/20 px-2 py-0.5 rounded ml-2">(${VIP_MONTHLY_PRICE_USD})</span>
                           </button>
                           <button 
                             onClick={() => onBuyVIP('COINS')}
                             className="bg-black/40 hover:bg-black/60 border border-yellow-500/50 text-yellow-400 font-bold py-4 px-6 rounded-xl flex items-center gap-2 justify-center"
                           >
                               <Coins size={16}/> {t('buyWithCoins')} ({VIP_PRICE_COINS})
                           </button>
                       </div>
                   )}
               </div>

               <div className="bg-black/40 rounded-2xl p-4 border border-white/10">
                   <h2 className="text-sm font-bold text-purple-200 uppercase tracking-widest flex items-center gap-2 mb-4">
                      <HeartPulse size={16}/> {t('consumables')}
                   </h2>
                   
                   <div className="grid grid-cols-1 gap-4">
                       <ShopItemRow 
                          icon={<BatteryCharging size={24} className="text-green-400"/>}
                          bg="bg-green-500/20"
                          borderColor="border-green-500/50"
                          title={t('dailyEnergy')}
                          desc={t('energyDesc')}
                          price={gameSettings.energyPrice}
                          balance={profile.balance}
                          owned={profile.dailyEnergy >= MAX_DAILY_ENERGY || profile.isVip}
                          ownedText={profile.isVip ? 'VIP ∞' : t('full')}
                          onBuy={onBuyEnergy}
                       />
                       <ShopItemRow 
                          icon={<HeartPulse size={24} className="text-red-400"/>}
                          bg="bg-red-500/20"
                          borderColor="border-red-500/50"
                          title={t('revivePotion')}
                          desc={`${t('reviveDesc')}: ${profile.consumables?.revives || 0}`}
                          price={gameSettings.revivePrice}
                          balance={profile.balance}
                          onBuy={onBuyRevive}
                       />
                       <ShopItemRow 
                          icon={<Shield size={24} className="text-cyan-400"/>}
                          bg="bg-cyan-500/20"
                          borderColor="border-cyan-500/50"
                          title={t('shield')}
                          desc={`${t('shieldDesc')} (${t('reviveDesc')}: ${profile.consumables?.shields || 0})`}
                          price={gameSettings.shieldPrice}
                          balance={profile.balance}
                          onBuy={onBuyShield}
                       />
                        <ShopItemRow 
                          icon={<Rocket size={24} className="text-orange-400"/>}
                          bg="bg-orange-500/20"
                          borderColor="border-orange-500/50"
                          title={t('nitro')}
                          desc={`${t('nitroDesc')} (${t('reviveDesc')}: ${profile.consumables?.nitros || 0})`}
                          price={gameSettings.nitroPrice}
                          balance={profile.balance}
                          onBuy={onBuyNitro}
                       />
                   </div>
               </div>
           </div>
        )}

        {/* --- BIRDS TAB --- */}
        {activeTab === 'birds' && (
           <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-left-8 duration-300">
              {BIRD_SKINS.map(skin => {
                 const owned = profile.ownedSkins.includes(skin.id);
                 const equipped = profile.equippedSkinId === skin.id;
                 const canAfford = profile.balance >= skin.price;

                 return (
                    <div 
                      key={skin.id}
                      className={`relative bg-black/40 border-2 rounded-2xl overflow-hidden flex flex-col transition-all
                          ${equipped ? 'border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)]' : 'border-white/10 hover:border-white/30'}
                      `}
                    >
                        <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full bg-black/60 text-[10px] uppercase font-bold text-white/70 border border-white/10">
                           {skin.type}
                        </div>
                        <div className="absolute top-2 right-2 z-10 px-2 py-0.5 rounded-full bg-black/60 text-[10px] font-bold border border-white/10" 
                             style={{ color: skin.rarity === 'Legendary' ? '#facc15' : (skin.rarity === 'Epic' ? '#c084fc' : (skin.rarity === 'Rare' ? '#60a5fa' : '#9ca3af')) }}>
                           {skin.rarity}
                        </div>

                        <div className="p-6 flex items-center justify-center bg-gradient-to-b from-white/5 to-transparent relative">
                            {skin.rarity === 'Legendary' && <div className="absolute inset-0 bg-yellow-500/10 animate-pulse"></div>}
                            <BirdPreview skinId={skin.id} size={90} />
                        </div>

                        <div className="p-4 flex flex-col gap-2 flex-1">
                            <div>
                               <h3 className="font-bold text-sm truncate">{skin.name}</h3>
                               <p className="text-[10px] text-white/50 line-clamp-2 min-h-[2.5em]">{skin.description}</p>
                               <div className="text-[10px] text-cyan-300 mt-1">{skin.abilityText}</div>
                            </div>

                            <div className="mt-auto">
                               {equipped ? (
                                  <button className="w-full py-2 rounded-lg bg-green-500/20 text-green-400 font-bold text-xs flex items-center justify-center gap-1 border border-green-500/50">
                                     <Check size={14}/> {t('equipped')}
                                  </button>
                               ) : owned ? (
                                  <button onClick={() => onEquip(skin.id)} className="w-full py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs">
                                     {t('equip')}
                                  </button>
                               ) : (
                                  <button 
                                     onClick={() => handleBuy(skin.id)}
                                     disabled={!canAfford}
                                     className={`w-full py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1
                                        ${canAfford ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg' : 'bg-slate-700 text-white/50 cursor-not-allowed'}
                                     `}
                                  >
                                     {canAfford ? <><ShoppingBag size={14}/> {t('buy')}</> : <Lock size={14}/>}
                                     <span className="ml-1 bg-black/30 px-1.5 py-0.5 rounded flex items-center gap-1">
                                        <Coins size={10} className="text-yellow-400"/> {skin.price}
                                     </span>
                                  </button>
                               )}
                            </div>
                        </div>
                    </div>
                 )
              })}
           </div>
        )}

        {/* --- MARKET TAB --- */}
        {activeTab === 'market' && (
           <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
               <div className="bg-gradient-to-r from-pink-900/40 to-purple-900/40 p-4 rounded-xl border border-white/10 mb-6 flex items-center justify-between">
                   <div>
                       <h3 className="font-bold text-pink-200">{t('market')}</h3>
                       <p className="text-xs text-white/50">{t('p2pDesc')}</p>
                   </div>
                   <button 
                     onClick={() => setListingItemId(allSellableItems.length > 0 ? allSellableItems[0].id : null)}
                     className="bg-pink-600 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-pink-500"
                   >
                       <Plus size={16}/> {t('listForSale')}
                   </button>
               </div>

               {/* Create Listing Modal */}
               {listingItemId && (
                   <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                       <div className="bg-slate-900 border border-pink-500/30 p-6 rounded-2xl w-full max-w-sm">
                           <h3 className="text-lg font-bold mb-4">{t('listForSale')}</h3>
                           <div className="mb-4">
                               <label className="text-xs text-white/50 block mb-2">{t('selectItem')}</label>
                               <select 
                                 value={listingItemId} 
                                 onChange={e => setListingItemId(e.target.value)}
                                 className="w-full bg-black/50 p-2 rounded border border-white/10"
                               >
                                   {allSellableItems.map(item => (
                                       <option key={item.id} value={item.id}>[{item.type}] {item.name}</option>
                                   ))}
                               </select>
                           </div>
                           <div className="mb-6">
                               <label className="text-xs text-white/50 block mb-2">{t('price')} (CE333)</label>
                               <input 
                                 type="number" 
                                 value={listingPrice}
                                 onChange={e => setListingPrice(Number(e.target.value))}
                                 className="w-full bg-black/50 p-2 rounded border border-white/10 text-xl font-bold text-yellow-400"
                               />
                           </div>
                           
                           {/* FEE WARNING */}
                           <div className="bg-red-900/20 p-3 rounded-lg border border-red-500/30 mb-6">
                               <div className="flex justify-between text-xs text-white/70 mb-1">
                                   <span>{t('price')}</span>
                                   <span>{listingPrice}</span>
                               </div>
                               <div className="flex justify-between text-xs text-red-400 mb-1">
                                   <span>{t('feeDeduction')}</span>
                                   <span>-{calculatedFee}</span>
                               </div>
                               <div className="border-t border-white/10 pt-2 flex justify-between font-bold text-green-400">
                                   <span>{t('youReceive')}</span>
                                   <span>{sellerReceives}</span>
                               </div>
                           </div>

                           <div className="flex gap-2">
                               <button onClick={() => setListingItemId(null)} className="flex-1 bg-slate-700 py-3 rounded-xl font-bold">{t('cancel')}</button>
                               <button onClick={handleList} className="flex-1 bg-pink-600 py-3 rounded-xl font-bold">{t('confirm')}</button>
                           </div>
                       </div>
                   </div>
               )}

               <div className="grid grid-cols-1 gap-3">
                   {marketListings.map(listing => {
                       let name = 'Unknown';
                       let ItemComponent: any = null;

                       if (listing.itemType === 'Bird') {
                           const skin = BIRD_SKINS.find(s => s.id === listing.itemId);
                           name = skin?.name || listing.itemId;
                           ItemComponent = <BirdPreview skinId={listing.itemId} size={40} />;
                       } else if (listing.itemType === 'Avatar') {
                           const av = AVATARS.find(a => a.id === listing.itemId);
                           name = av?.name || listing.itemId;
                           ItemComponent = <AvatarPreview avatarId={listing.itemId} flagId="none" size={40} />;
                       } else if (listing.itemType === 'Flag') {
                           const fl = FLAGS.find(f => f.id === listing.itemId);
                           name = fl?.name || listing.itemId;
                           ItemComponent = <div className="w-8 h-6 overflow-hidden rounded"><AvatarPreview avatarId="male_default" flagId={listing.itemId} size={40} /></div>;
                       }

                       return (
                           <div key={listing.id} className="bg-black/40 border border-white/10 p-3 rounded-xl flex items-center gap-4">
                               <div className="bg-white/5 p-2 rounded-lg relative">
                                   <div className="absolute -top-2 -left-2 bg-black/60 text-[8px] px-2 rounded-full border border-white/10">{listing.itemType}</div>
                                   {ItemComponent}
                               </div>
                               <div className="flex-1">
                                   <h4 className="font-bold text-sm">{name}</h4>
                                   <div className="flex items-center gap-1 text-xs text-white/50">
                                       <Users size={12}/> Seller: {listing.sellerName}
                                   </div>
                               </div>
                               <button 
                                 onClick={() => onBuyMarketItem(listing.id)}
                                 className="bg-white/10 hover:bg-green-500/20 hover:text-green-400 border border-white/10 hover:border-green-500/50 px-4 py-2 rounded-lg font-bold text-sm flex flex-col items-end min-w-[80px]"
                               >
                                   <span className="text-[10px] uppercase opacity-70">{t('buyItem')}</span>
                                   <span className="flex items-center gap-1 text-yellow-400">
                                       <Coins size={12}/> {listing.price}
                                   </span>
                               </button>
                           </div>
                       )
                   })}
                   {marketListings.length === 0 && (
                       <p className="text-center text-white/30 py-8">No active listings.</p>
                   )}
               </div>
           </div>
        )}
      </div>
    </div>
  );
};

const ShopItemRow = ({ icon, bg, borderColor, title, desc, price, balance, owned, ownedText, onBuy }: any) => (
  <div className={`flex items-center gap-4 p-4 rounded-xl border ${borderColor} ${bg} relative overflow-hidden`}>
      <div className="bg-black/20 p-3 rounded-full relative z-10">
          {icon}
      </div>
      <div className="flex-1 relative z-10">
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="text-xs opacity-70">{desc}</p>
      </div>
      <div className="relative z-10">
          {owned ? (
              <span className="text-xs font-bold bg-black/40 px-3 py-1 rounded-full">{ownedText || 'OWNED'}</span>
          ) : (
              <button 
                  onClick={onBuy}
                  disabled={balance < price}
                  className={`px-4 py-2 rounded-lg font-bold text-sm shadow-lg flex items-center gap-2
                      ${balance >= price ? 'bg-white text-slate-900 hover:scale-105 transition-transform' : 'bg-black/40 text-white/50 cursor-not-allowed'}
                  `}
              >
                  {balance < price && <Lock size={14}/>}
                  <Coins size={14} className="text-yellow-500"/> {price}
              </button>
          )}
      </div>
  </div>
);

export default Shop;