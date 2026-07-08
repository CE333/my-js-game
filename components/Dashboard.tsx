
import React, { useState } from 'react';
import { PlayerProfile, SupportTicket } from '../types';
import { BIRD_SKINS, UPGRADE_COST_BASE, UPGRADE_MULTIPLIER, MAX_DAILY_ENERGY, AVATARS, FLAGS, MARKET_FEE_PERCENTAGE } from '../constants';
import { Zap, Wind, Move, ArrowLeft, Coins, Wallet, Battery, User, Flag as FlagIcon, LogOut, RefreshCw, Mail, Send, Check, MessageSquare, Crown, Lock, Info, Trash2 } from 'lucide-react';
import BirdPreview from './BirdPreview';
import AvatarPreview from './AvatarPreview';

interface DashboardProps {
  profile: PlayerProfile;
  onBack: () => void;
  onUpgrade: (type: 'power' | 'aerodynamics' | 'agility') => void;
  onEquip: (skinId: string) => void;
  onConnectWallet: () => void;
  onDisconnectWallet: () => void;
  onContactSupport: (msg: string) => void;
  onSwap: (amount: number) => void;
  supportTickets: SupportTicket[];
  t: (key: string) => string;
  onBuyAvatar: (id: string) => void;
  onBuyFlag: (id: string) => void;
  onEquipAvatar: (id: string) => void;
  onEquipFlag: (id: string) => void;
  onDeleteAccount: () => void; // New Prop
}

const Dashboard: React.FC<DashboardProps> = ({ 
  profile, onBack, onUpgrade, onEquip, 
  onConnectWallet, onDisconnectWallet, onContactSupport, onSwap, supportTickets, t,
  onBuyAvatar, onBuyFlag, onEquipAvatar, onEquipFlag, onDeleteAccount
}) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'profile' | 'swap' | 'contact'>('stats');
  const currentSkin = BIRD_SKINS.find(s => s.id === profile.equippedSkinId);
  
  // Swap State
  const [swapAmount, setSwapAmount] = useState(100);
  const conversionRate = 0.10; // 1 CE333 = $0.10

  // Contact State
  const [contactMsg, setContactMsg] = useState('');
  const [msgSent, setMsgSent] = useState(false);

  // Filter user tickets
  const userTickets = supportTickets.filter(t => t.userId === profile.id).sort((a,b) => b.timestamp - a.timestamp);

  const getUpgradeCost = (currentLevel: number) => {
    return Math.floor(UPGRADE_COST_BASE * Math.pow(UPGRADE_MULTIPLIER, currentLevel - 1));
  };

  const handleSendMessage = () => {
    if(!contactMsg.trim()) return;
    onContactSupport(contactMsg);
    setMsgSent(true);
    setTimeout(() => {
        setContactMsg('');
        setMsgSent(false);
    }, 2000);
  }

  const handleSwapConfirm = () => {
      onSwap(swapAmount);
  }

  // Swap Calculations
  const swapFee = Math.floor(swapAmount * MARKET_FEE_PERCENTAGE);
  const netSwapAmount = Math.max(0, swapAmount - swapFee);
  const usdtReceived = (netSwapAmount * conversionRate).toFixed(2);

  return (
    <div className="absolute inset-0 bg-slate-900/85 backdrop-blur-md z-50 flex flex-col text-white overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-white/10 bg-black/40">
        <button onClick={onBack} className="flex items-center gap-1 px-3 py-2 hover:bg-white/10 rounded-lg transition-colors border border-white/10">
          <ArrowLeft size={20} />
          <span className="text-sm font-bold">{t('back')}</span>
        </button>
        <h1 className="text-xl font-bold tracking-wider text-cyan-400">{t('dashboard')}</h1>
        <div className="flex items-center gap-2 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
          <Coins size={16} className="text-yellow-400" />
          <span className="font-mono text-yellow-200">{profile.balance} CE333</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-2 bg-black/40 gap-2 overflow-x-auto">
         <button onClick={() => setActiveTab('stats')} className={`flex-1 py-3 px-4 rounded-xl font-bold whitespace-nowrap ${activeTab === 'stats' ? 'bg-cyan-600' : 'bg-white/5 text-slate-400'}`}>{t('dashboard')}</button>
         <button onClick={() => setActiveTab('profile')} className={`flex-1 py-3 px-4 rounded-xl font-bold whitespace-nowrap ${activeTab === 'profile' ? 'bg-cyan-600' : 'bg-white/5 text-slate-400'}`}>{t('profile')}</button>
         <button onClick={() => setActiveTab('swap')} className={`flex-1 py-3 px-4 rounded-xl font-bold whitespace-nowrap ${activeTab === 'swap' ? 'bg-cyan-600' : 'bg-white/5 text-slate-400'}`}>{t('swap')}</button>
         <button onClick={() => setActiveTab('contact')} className={`flex-1 py-3 px-4 rounded-xl font-bold whitespace-nowrap ${activeTab === 'contact' ? 'bg-cyan-600' : 'bg-white/5 text-slate-400'}`}>{t('contactAdmin')}</button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        
        {/* --- SWAP TAB --- */}
        {activeTab === 'swap' && (
           <div className="max-w-md mx-auto space-y-6 animate-in fade-in slide-in-from-right-8">
               <div className="text-center">
                   <h2 className="text-2xl font-bold text-cyan-400 mb-2">{t('swap')}</h2>
                   <p className="text-white/60 text-sm">{t('swapDesc')}</p>
                   
                   <div className="mt-4 bg-green-500/10 border border-green-500/30 p-3 rounded-xl inline-block">
                       <span className="text-green-400 font-bold text-sm">USDT Balance: ${profile.usdtBalance?.toFixed(2) || '0.00'}</span>
                   </div>
               </div>
               
               <div className="bg-black/40 border border-white/10 rounded-2xl p-6 relative">
                   <label className="text-xs text-white/50 mb-2 block uppercase">{t('youPay')}</label>
                   <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-xl mb-4">
                       <input 
                         type="number" 
                         value={swapAmount} 
                         onChange={(e) => setSwapAmount(Math.max(0, Number(e.target.value)))}
                         className="bg-transparent text-2xl font-bold w-full outline-none"
                       />
                       <span className="text-yellow-400 font-bold flex items-center gap-1"><Coins size={16}/> CE333</span>
                   </div>

                   {/* FEE BREAKDOWN */}
                   <div className="bg-red-900/20 p-3 rounded-lg border border-red-500/20 mb-6 text-xs space-y-1">
                       <div className="flex justify-between text-white/70">
                           <span>Gross Amount</span>
                           <span>{swapAmount} CE333</span>
                       </div>
                       <div className="flex justify-between text-red-400">
                           <span className="flex items-center gap-1"><Info size={10}/> Fee (33.3%)</span>
                           <span>-{swapFee} CE333</span>
                       </div>
                       <div className="border-t border-white/10 pt-1 flex justify-between font-bold text-white">
                           <span>Net Amount</span>
                           <span>{netSwapAmount} CE333</span>
                       </div>
                   </div>

                   <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-cyan-600 p-2 rounded-full border-4 border-slate-900 z-10 shadow-lg">
                       <RefreshCw size={24} className="text-white"/>
                   </div>

                   <label className="text-xs text-white/50 mb-2 block uppercase pt-2">{t('youGet')}</label>
                   <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-xl border border-green-500/30">
                       <div className="text-2xl font-bold w-full text-green-400">
                           {usdtReceived}
                       </div>
                       <span className="text-green-400 font-bold">USDT</span>
                   </div>
               </div>

               <button 
                 onClick={handleSwapConfirm}
                 disabled={profile.balance < swapAmount || swapAmount <= 0}
                 className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2
                    ${profile.balance >= swapAmount ? 'bg-cyan-600 hover:bg-cyan-500' : 'bg-slate-700 cursor-not-allowed text-white/50'}
                 `}
               >
                   {t('confirm')}
               </button>
           </div>
        )}

        {/* --- CONTACT TAB --- */}
        {activeTab === 'contact' && (
           <div className="max-w-md mx-auto space-y-6 animate-in fade-in slide-in-from-right-8">
               <div className="text-center">
                   <h2 className="text-2xl font-bold text-cyan-400 mb-2">{t('contactAdmin')}</h2>
                   <p className="text-white/60 text-sm">{t('supportDesc')}</p>
               </div>
               
               <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
                   <label className="text-xs text-white/50 mb-2 block">Message</label>
                   <textarea 
                     rows={4}
                     value={contactMsg}
                     onChange={(e) => setContactMsg(e.target.value)}
                     className="w-full bg-slate-800/50 rounded-xl p-4 outline-none focus:border-cyan-500 border border-transparent transition-colors mb-4"
                     placeholder="Type your message here..."
                   />
                   
                   <button 
                     onClick={handleSendMessage}
                     disabled={!contactMsg || msgSent}
                     className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-bold flex items-center justify-center gap-2"
                   >
                      {msgSent ? <Check size={20}/> : <Send size={20}/>}
                      {msgSent ? t('ticketSent') : t('sendMessage')}
                   </button>
               </div>

               {/* TICKET HISTORY */}
               {userTickets.length > 0 && (
                   <div className="space-y-4">
                       <h3 className="font-bold text-lg text-white/80">{t('yourTickets')}</h3>
                       {userTickets.map(ticket => (
                           <div key={ticket.id} className="bg-slate-800/50 rounded-xl p-4 border border-white/5">
                               <div className="flex justify-between items-start mb-2">
                                   <span className={`text-[10px] px-2 py-0.5 rounded-full ${ticket.status === 'Open' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>
                                       {ticket.status}
                                   </span>
                                   <span className="text-[10px] text-white/30">{new Date(ticket.timestamp).toLocaleDateString()}</span>
                               </div>
                               <p className="text-white/80 text-sm mb-3 bg-black/20 p-3 rounded-lg">{ticket.message}</p>
                               {ticket.reply && (
                                   <div className="bg-cyan-900/30 p-3 rounded-lg border-l-2 border-cyan-500">
                                       <p className="text-xs text-cyan-300 font-bold mb-1">{t('adminReply')}:</p>
                                       <p className="text-sm text-white/90">{ticket.reply}</p>
                                   </div>
                               )}
                           </div>
                       ))}
                   </div>
               )}
           </div>
        )}

        {/* --- PROFILE TAB --- */}
        {activeTab === 'profile' && (
           <div className="space-y-8 animate-in fade-in slide-in-from-right-8">
              <div className="flex flex-col items-center">
                 <div className="relative">
                    <AvatarPreview avatarId={profile.avatarId} flagId={profile.flagId} size={150} />
                    <div className="absolute -bottom-3 bg-cyan-600 text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20 shadow-lg">
                       {AVATARS.find(a => a.id === profile.avatarId)?.name}
                    </div>
                 </div>
              </div>

              {/* BIRD SELECTION */}
              <div className="bg-black/40 p-4 rounded-2xl border border-white/10">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold flex items-center gap-2 text-purple-200">
                        <Check size={20}/> {t('birds')}
                    </h3>
                    <span className="text-xs text-white/50 bg-white/10 px-2 py-1 rounded">
                        Owned: {profile.ownedSkins.length} / {BIRD_SKINS.length}
                    </span>
                 </div>
                 <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {profile.ownedSkins.map(skinId => {
                       const skin = BIRD_SKINS.find(s => s.id === skinId);
                       if (!skin) return null;
                       const equipped = profile.equippedSkinId === skin.id;
                       return (
                          <div 
                            key={skin.id} 
                            onClick={() => onEquip(skin.id)}
                            className={`p-2 rounded-xl flex flex-col items-center gap-2 border cursor-pointer transition-all hover:scale-105
                                ${equipped ? 'border-purple-400 bg-purple-900/40 shadow-lg' : 'border-white/10 bg-white/5 hover:bg-white/10'}
                            `}
                          >
                             <BirdPreview skinId={skin.id} size={50} />
                             <p className="text-[10px] font-bold truncate w-full text-center">{skin.name}</p>
                             {equipped && <span className="text-[8px] bg-purple-500 text-white px-2 rounded-full">Active</span>}
                          </div>
                       )
                    })}
                 </div>
              </div>

              {/* AVATAR SHOP/SELECT */}
              <div className="bg-black/40 p-4 rounded-2xl border border-white/10">
                 <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-cyan-200"><User size={20}/> {t('avatars')}</h3>
                 <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {AVATARS.map(av => {
                       const owned = profile.ownedAvatars.includes(av.id);
                       const equipped = profile.avatarId === av.id;
                       return (
                          <div 
                            key={av.id} 
                            onClick={() => owned ? onEquipAvatar(av.id) : onBuyAvatar(av.id)}
                            className={`p-2 rounded-xl flex flex-col items-center gap-2 border cursor-pointer hover:scale-105 transition-all
                                ${equipped ? 'border-cyan-400 bg-cyan-900/40' : owned ? 'border-green-500/30 bg-green-900/10' : 'border-white/10 bg-white/5'}
                            `}
                          >
                             <AvatarPreview avatarId={av.id} flagId="none" size={60} />
                             <p className="text-[10px] font-bold truncate w-full text-center">{av.name}</p>
                             {owned ? (
                                <span className={`text-[10px] ${equipped ? 'text-cyan-400' : 'text-green-400'}`}>{equipped ? t('equipped') : 'Owned'}</span>
                             ) : (
                                <div className="flex items-center gap-1 text-[10px] text-yellow-300">
                                   <Coins size={10}/> {av.price} <Lock size={10} className="text-white/30 ml-1"/>
                                </div>
                             )}
                          </div>
                       )
                    })}
                 </div>
              </div>

              {/* FLAG SHOP/SELECT */}
              <div className="bg-black/40 p-4 rounded-2xl border border-white/10">
                 <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-cyan-200"><FlagIcon size={20}/> {t('flags')}</h3>
                 <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {FLAGS.map(flag => {
                       const owned = profile.ownedFlags.includes(flag.id);
                       const equipped = profile.flagId === flag.id;
                       return (
                          <div 
                            key={flag.id} 
                            onClick={() => owned ? onEquipFlag(flag.id) : onBuyFlag(flag.id)}
                            className={`p-2 rounded-xl flex flex-col items-center gap-2 border cursor-pointer hover:scale-105 transition-all
                                ${equipped ? 'border-cyan-400 bg-cyan-900/40' : owned ? 'border-green-500/30 bg-green-900/10' : 'border-white/10 bg-white/5'}
                            `}
                          >
                             <div className="w-12 h-8 rounded border border-white/20 overflow-hidden flex relative">
                                <AvatarPreview avatarId={profile.avatarId} flagId={flag.id} size={50} />
                             </div>
                             <p className="text-[10px] font-bold truncate w-full text-center">{flag.name}</p>
                             {owned ? (
                                <span className={`text-[10px] ${equipped ? 'text-cyan-400' : 'text-green-400'}`}>{equipped ? t('equipped') : 'Owned'}</span>
                             ) : (
                                <div className="flex items-center gap-1 text-[10px] text-yellow-300">
                                   <Coins size={10}/> {flag.price} <Lock size={10} className="text-white/30 ml-1"/>
                                </div>
                             )}
                          </div>
                       )
                    })}
                 </div>
              </div>

              {/* DELETE ACCOUNT (Google Play Requirement) */}
              <div className="pt-4 border-t border-white/10">
                  <button 
                    onClick={onDeleteAccount}
                    className="w-full bg-red-900/30 hover:bg-red-900/50 border border-red-500/30 text-red-400 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                      <Trash2 size={18}/> {t('deleteAccount')}
                  </button>
              </div>

           </div>
        )}

        {/* --- STATS TAB --- */}
        {activeTab === 'stats' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-left-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Wallet Connection */}
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-5 rounded-2xl border border-white/10 flex flex-col justify-between">
                  <div>
                    <p className="text-slate-400 text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                      <Wallet size={14}/> {t('userWallet')}
                    </p>
                    {profile.walletAddress ? (
                      <div className="text-green-400 font-mono text-lg truncate mb-2">
                          {profile.walletAddress}
                      </div>
                    ) : (
                      <p className="text-white/50 text-sm">{t('notConnected')}</p>
                    )}
                  </div>
                  {profile.walletAddress ? (
                    <button 
                      onClick={onDisconnectWallet}
                      className="mt-4 w-full bg-red-900/30 hover:bg-red-900/50 border border-red-800/50 text-red-400 py-2 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
                    >
                      <LogOut size={14}/> {t('disconnect')}
                    </button>
                  ) : (
                    <button 
                      onClick={onConnectWallet}
                      className="mt-4 w-full bg-blue-600 hover:bg-blue-500 py-2 rounded-lg text-sm font-bold transition-colors"
                    >
                      {t('connectWallet')}
                    </button>
                  )}
              </div>

              {/* Energy Status */}
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-5 rounded-2xl border border-white/10 relative overflow-hidden">
                  <p className="text-slate-400 text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                      <Battery size={14}/> {t('dailyEnergy')}
                  </p>
                  <div className="flex items-end gap-2">
                    {profile.isVip ? (
                        <span className="text-4xl font-black text-yellow-400 flex items-center gap-2"><Crown/> ∞</span>
                    ) : (
                        <>
                            <span className={`text-4xl font-black ${profile.dailyEnergy > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {profile.dailyEnergy}
                            </span>
                            <span className="text-slate-500 mb-1">/ {MAX_DAILY_ENERGY}</span>
                        </>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-2">{t('resetsDaily')}</p>
              </div>
            </div>

            {/* VIP Status */}
            {profile.isVip && (
                <div className="bg-gradient-to-r from-yellow-900/30 to-amber-900/30 p-4 rounded-2xl border border-yellow-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-yellow-500 p-2 rounded-full text-black"><Crown size={24}/></div>
                        <div>
                            <h3 className="font-black text-yellow-400 text-lg">VIP MEMBER</h3>
                            <p className="text-xs text-yellow-200/70">Unlimited Energy Active</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Overview */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/40 p-4 rounded-2xl border border-white/10">
                <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">{t('totalGames')}</p>
                <p className="text-2xl font-black">{profile.gamesPlayed}</p>
              </div>
              <div className="bg-black/40 p-4 rounded-2xl border border-white/10">
                <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">{t('bestScore')}</p>
                <p className="text-2xl font-black text-green-400">{profile.bestScore}</p>
              </div>
            </div>

            {/* Current Bird */}
            <div className="bg-blue-900/30 p-6 rounded-3xl border border-blue-500/20 relative overflow-hidden backdrop-blur-sm">
              <div className="absolute top-0 right-0 p-32 bg-blue-500/10 blur-3xl rounded-full"></div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="mb-4 filter drop-shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                    <BirdPreview skinId={profile.equippedSkinId} size={120} />
                </div>
                <h2 className="text-2xl font-bold text-white">{currentSkin?.name}</h2>
                <p className="text-cyan-200/60 text-sm mb-4">{currentSkin?.type} Class • {currentSkin?.rarity}</p>
                <div className="bg-black/30 px-4 py-2 rounded-lg text-sm text-cyan-100 border border-cyan-500/30">
                  {currentSkin?.abilityText}
                </div>
              </div>
            </div>

            {/* Upgrades */}
            <div className="bg-black/40 p-4 rounded-2xl border border-white/10">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Zap className="text-yellow-400" size={20} />
                {t('perfUpgrades')}
              </h3>
              
              <div className="space-y-4">
                <UpgradeRow 
                  label={t('power')} 
                  level={profile.upgrades.power} 
                  cost={getUpgradeCost(profile.upgrades.power)} 
                  icon={<Zap size={18} />}
                  color="text-yellow-400"
                  balance={profile.balance}
                  onBuy={() => onUpgrade('power')}
                  t={t}
                />
                <UpgradeRow 
                  label={t('aero')} 
                  level={profile.upgrades.aerodynamics} 
                  cost={getUpgradeCost(profile.upgrades.aerodynamics)} 
                  icon={<Wind size={18} />}
                  color="text-blue-400"
                  balance={profile.balance}
                  onBuy={() => onUpgrade('aerodynamics')}
                  t={t}
                />
                <UpgradeRow 
                  label={t('agility')} 
                  level={profile.upgrades.agility} 
                  cost={getUpgradeCost(profile.upgrades.agility)} 
                  icon={<Move size={18} />}
                  color="text-green-400"
                  balance={profile.balance}
                  onBuy={() => onUpgrade('agility')}
                  t={t}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ... UpgradeRow (Kept same as before) ...
const UpgradeRow = ({ label, level, cost, icon, color, balance, onBuy, t }: any) => (
  <div className="bg-white/5 p-4 rounded-xl flex items-center justify-between border border-white/5">
    <div className="flex items-center gap-3">
      <div className={`p-2 bg-white/5 rounded-lg ${color}`}>{icon}</div>
      <div>
        <p className="font-bold text-sm">{label}</p>
        <div className="flex gap-1 mt-1">
          {[...Array(10)].map((_, i) => (
            <div key={i} className={`w-2 h-1.5 rounded-sm ${i < level ? 'bg-cyan-400' : 'bg-slate-700'}`}></div>
          ))}
        </div>
      </div>
    </div>
    <button 
      disabled={balance < cost || level >= 10}
      onClick={onBuy}
      className={`px-4 py-2 rounded-lg font-bold text-sm flex flex-col items-center min-w-[80px] transition-all
        ${balance >= cost && level < 10 ? 'bg-cyan-600 hover:bg-cyan-500 text-white' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}
      `}
    >
      {level >= 10 ? (
        <span>{t('max')}</span>
      ) : (
        <>
          <span className="text-[10px] opacity-70">{t('upgrade')}</span>
          <span className="flex items-center gap-1">
             <Coins size={10} /> {cost}
          </span>
        </>
      )}
    </button>
  </div>
);

export default Dashboard;