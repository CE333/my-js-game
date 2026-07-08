
import React, { useState } from 'react';
import { PlayerProfile, GameSettings, WithdrawalRequest, InfluencerSubmission, SupportTicket, AdminRole, AdCampaign } from '../types';
import { ACCOUNTING_STATS, INFLUENCER_VIEW_STEP, INFLUENCER_REWARD_RATE } from '../constants';
import { ArrowLeft, Database, ShieldAlert, PlusCircle, Trash2, Wallet, Settings, Lock, LogOut, Clock, CheckCircle, ToggleRight, ToggleLeft, Eye, EyeOff, Calculator, DollarSign, PieChart, CreditCard, Star, ExternalLink, XCircle, MessageSquare, Send, User, Megaphone, Film, Layout, Coins, Crown } from 'lucide-react';
import { SecureStorage } from '../services/SecureStorage';

interface AdminProps {
  onBack: () => void;
  onReset: () => void;
  onAddCoins: (amount: number) => void;
  onUpdateMotherWallet: (addr: string) => void;
  onUpdateGameSettings: (s: GameSettings) => void;
  onBanUser: (id: string, ban: boolean) => void;
  onToggleVip: (id: string, isVip: boolean) => void; 
  onWithdraw: (amount: number, dest: string) => void;
  profile: PlayerProfile;
  gameSettings: GameSettings;
  withdrawals: WithdrawalRequest[];
  influencerSubmissions?: InfluencerSubmission[]; 
  onReviewSubmission?: (id: string, status: 'Approved' | 'Rejected') => void;
  supportTickets?: SupportTicket[];
  onReplyTicket?: (id: string, reply: string) => void;
  onPublishAd?: (campaign: AdCampaign, cost: number, currency: string) => void;
  userAds?: AdCampaign[];
  t: (key: string) => string;
}

const Admin: React.FC<AdminProps> = ({ 
  onBack, onReset, onAddCoins, onUpdateMotherWallet, onUpdateGameSettings, 
  onBanUser, onToggleVip, onWithdraw, profile, gameSettings, withdrawals, influencerSubmissions = [], onReviewSubmission, supportTickets = [], onReplyTicket, 
  onPublishAd, userAds = [], t 
}) => {
  const [authStage, setAuthStage] = useState<'login' | 'code' | 'dashboard'>('login');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'users' | 'wallet' | 'accounting' | 'influencers' | 'support' | 'admin_ads'>('support'); 
  const [adminRole, setAdminRole] = useState<AdminRole>(null);

  // Support Reply State
  const [replyText, setReplyText] = useState('');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  // Config States
  const [settings, setSettings] = useState(gameSettings);
  const [wallets, setWallets] = useState(gameSettings.wallets);
  const [userIdInput, setUserIdInput] = useState('');
  const [giftAmount, setGiftAmount] = useState(1000);
  
  // Admin Ad States
  const [adTitle, setAdTitle] = useState('');
  const [adContent, setAdContent] = useState('');
  const [adLink, setAdLink] = useState('');
  const [adType, setAdType] = useState<'Banner' | 'Fullscreen' | 'Video'>('Banner');
  const [adVideoUrl, setAdVideoUrl] = useState('');

  // SECURE VALIDATION LOGIC
  const handleLogin = () => {
      // In a real app, this would check against the server.
      // Here we check against our "Secure" local storage logic for the demo.
      // We allow the specific email, or any email ending in @support.ce333 for testing agents
      if(email.trim().toLowerCase().includes('hos14187@gmail.com') || email.includes('@support.ce333')) {
          setAuthStage('code');
      } else {
          alert('Invalid Admin Identity');
      }
  };

  const handleCode = () => {
      // Use SecureStorage to validate instead of hardcoded strings
      if (SecureStorage.validateAdmin('hos14187@gmail.com', code)) {
          setAdminRole('Master');
          setActiveTab('config'); 
          setAuthStage('dashboard');
      } else if (SecureStorage.validateSupport(code)) {
          setAdminRole('Support');
          setActiveTab('support'); 
          setAuthStage('dashboard');
      } else {
          alert('Access Denied');
      }
  };

  const saveSettings = () => {
      onUpdateGameSettings({
          ...settings,
          wallets: wallets
      });
      alert('Global Settings & Wallets Updated Successfully.');
  };

  const submitReply = (ticketId: string) => {
      if(!replyText.trim() || !onReplyTicket) return;
      onReplyTicket(ticketId, replyText);
      setReplyText('');
      setSelectedTicketId(null);
  };

  const createAdminAd = () => {
      if (!onPublishAd) return;
      const newAd: AdCampaign = {
          id: 'ADMIN_' + Math.random().toString(36).substr(2, 9),
          title: adTitle,
          content: adContent,
          link: adType === 'Video' ? adVideoUrl : adLink,
          type: adType,
          days: 365, // Admin ads run for a long time by default
          viewsPurchased: 999999,
          status: 'Active',
          cost: 0,
          paidWith: 'ADMIN',
          videoUrl: adVideoUrl
      };
      onPublishAd(newAd, 0, 'ADMIN');
      alert('Admin Ad Created Successfully');
      setAdTitle(''); setAdContent(''); setAdLink(''); setAdVideoUrl('');
  };

  const adminAdsList = userAds.filter(ad => ad.paidWith === 'ADMIN');

  if (authStage === 'login' || authStage === 'code') {
      return (
        <div className="absolute inset-0 bg-slate-950/95 z-50 flex items-center justify-center p-6 backdrop-blur-xl">
            <div className="bg-slate-900 border border-red-900/50 p-8 rounded-2xl w-full max-w-sm text-center shadow-2xl">
                <ShieldAlert size={48} className="text-red-500 mx-auto mb-4 animate-pulse"/>
                <h2 className="text-2xl font-bold text-red-400 mb-2">{t('loginRequired')}</h2>
                
                {authStage === 'login' ? (
                    <div className="space-y-4">
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={t('email')} className="w-full bg-black/50 border border-red-900/30 rounded-lg p-3 text-white outline-none"/>
                        <button onClick={handleLogin} className="w-full bg-red-800 hover:bg-red-700 py-3 rounded-lg font-bold text-white">{t('login')}</button>
                        <p className="text-white/30 text-xs">{t('agentLoginNote')}</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="relative">
                            <input type={showPassword ? "text" : "password"} value={code} onChange={e => setCode(e.target.value)} placeholder="Passphrase" className="w-full bg-black/50 border border-red-900/30 rounded-lg p-3 text-white text-center outline-none"/>
                            <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-white/30"><Eye size={16}/></button>
                        </div>
                        <button onClick={handleCode} className="w-full bg-red-800 hover:bg-red-700 py-3 rounded-lg font-bold text-white">{t('confirm')}</button>
                    </div>
                )}
                <button onClick={onBack} className="mt-6 text-white/30 text-sm">{t('cancel')}</button>
            </div>
        </div>
      );
  }

  return (
    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex flex-col text-red-100 font-mono p-4 md:p-8 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-red-900/30">
        <div className="flex items-center gap-4">
            <button onClick={onBack} className="flex items-center gap-1 px-3 py-2 border border-red-900 rounded hover:bg-red-900/20">
            <ArrowLeft size={20} />
            <span className="text-sm font-bold">{t('back')}</span>
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-red-500 flex items-center gap-2">
                <ShieldAlert /> {adminRole === 'Master' ? t('adminConsole') : t('supportLogin')}
            </h1>
        </div>
        <button onClick={() => setAuthStage('login')} className="text-red-800 hover:text-red-500"><LogOut/></button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
          {adminRole === 'Master' && (
              <>
                <button onClick={() => setActiveTab('config')} className={`px-4 py-2 rounded whitespace-nowrap ${activeTab==='config'?'bg-red-900':'bg-black/40'}`}>{t('gameSettings')}</button>
                <button onClick={() => setActiveTab('admin_ads')} className={`px-4 py-2 rounded whitespace-nowrap ${activeTab==='admin_ads'?'bg-red-900':'bg-black/40'}`}>{t('adminAds')}</button>
                <button onClick={() => setActiveTab('accounting')} className={`px-4 py-2 rounded whitespace-nowrap ${activeTab==='accounting'?'bg-red-900':'bg-black/40'}`}>{t('accounting')}</button>
                <button onClick={() => setActiveTab('users')} className={`px-4 py-2 rounded whitespace-nowrap ${activeTab==='users'?'bg-red-900':'bg-black/40'}`}>{t('blacklist')}</button>
                <button onClick={() => setActiveTab('wallet')} className={`px-4 py-2 rounded whitespace-nowrap ${activeTab==='wallet'?'bg-red-900':'bg-black/40'}`}>{t('withdrawals')}</button>
                <button onClick={() => setActiveTab('influencers')} className={`px-4 py-2 rounded whitespace-nowrap ${activeTab==='influencers'?'bg-red-900':'bg-black/40'}`}>{t('influencers')}</button>
              </>
          )}
          <button onClick={() => setActiveTab('support')} className={`px-4 py-2 rounded whitespace-nowrap ${activeTab==='support'?'bg-red-900':'bg-black/40'}`}>{t('support')}</button>
      </div>

      <div className="flex-1 overflow-y-auto">
        
        {/* --- SUPPORT TAB --- */}
        {activeTab === 'support' && (
            <div className="h-full flex flex-col md:flex-row gap-6">
                <div className="flex-1 bg-black/40 border border-red-900/30 rounded-xl p-4 overflow-y-auto">
                    <h2 className="text-lg font-bold text-red-300 mb-4 flex items-center gap-2"><MessageSquare size={18}/> {t('support')}</h2>
                    {supportTickets.length === 0 ? <p className="text-white/30">{t('noTickets')}</p> : 
                        supportTickets.sort((a,b) => b.timestamp - a.timestamp).map(ticket => (
                            <div key={ticket.id} className="bg-black/30 p-3 rounded-lg mb-3 border border-white/5">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        <User size={14} className="text-white/50"/>
                                        <span className="text-xs font-bold text-white/70">User: {ticket.userId.substr(0,8)}...</span>
                                    </div>
                                    <span className={`text-[10px] px-2 py-0.5 rounded ${ticket.status === 'Open' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>{ticket.status}</span>
                                </div>
                                <p className="mt-2 text-sm text-white/90 bg-white/5 p-2 rounded">{ticket.message}</p>
                                
                                {ticket.reply ? (
                                    <div className="mt-2 pl-2 border-l-2 border-green-500">
                                        <p className="text-xs text-green-400 font-bold">Reply:</p>
                                        <p className="text-xs text-white/70">{ticket.reply}</p>
                                    </div>
                                ) : (
                                    <div className="mt-2">
                                        {selectedTicketId === ticket.id ? (
                                            <div className="mt-2 animate-in fade-in">
                                                <textarea 
                                                   value={replyText} 
                                                   onChange={e => setReplyText(e.target.value)} 
                                                   className="w-full bg-black/50 border border-red-900/30 rounded p-2 text-sm mb-2" 
                                                   placeholder="Type reply..."
                                                />
                                                <div className="flex gap-2">
                                                    <button onClick={() => submitReply(ticket.id)} className="bg-green-700 px-3 py-1 rounded text-xs flex items-center gap-1"><Send size={12}/> {t('sendReply')}</button>
                                                    <button onClick={() => setSelectedTicketId(null)} className="bg-red-900/50 px-3 py-1 rounded text-xs">{t('cancel')}</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button onClick={() => setSelectedTicketId(ticket.id)} className="text-xs text-blue-400 hover:underline flex items-center gap-1"><MessageSquare size={12}/> {t('reply')}</button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    }
                </div>
            </div>
        )}

        {/* --- CONFIG TAB --- */}
        {adminRole === 'Master' && activeTab === 'config' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="border border-red-900/50 p-6 rounded bg-black/40">
                        <h2 className="text-xl font-bold text-red-400 flex items-center gap-2 mb-4"><Settings size={20}/> Game Physics</h2>
                        <div className="bg-red-900/20 p-4 rounded-lg flex justify-between items-center">
                            <span>Use AI Generator</span>
                            <button onClick={() => setSettings({...settings, useAi: !settings.useAi})}>
                                {settings.useAi ? <ToggleRight className="text-green-400" size={32}/> : <ToggleLeft className="text-white/30" size={32}/>}
                            </button>
                        </div>
                    </div>

                    <div className="border border-red-900/50 p-6 rounded bg-black/40">
                        <h2 className="text-xl font-bold text-red-400 flex items-center gap-2 mb-4"><CreditCard size={20}/> {t('walletConfig')}</h2>
                        <div className="bg-red-900/20 p-4 rounded-lg flex justify-between items-center mb-4">
                            <span>{t('useMasterForAll')}</span>
                            <button onClick={() => setWallets({...wallets, useMasterForAll: !wallets.useMasterForAll})}>
                                {wallets.useMasterForAll ? <ToggleRight className="text-green-400" size={32}/> : <ToggleLeft className="text-white/30" size={32}/>}
                            </button>
                        </div>
                        <div>
                            <label className="text-xs text-red-400/50 block">{t('masterWallet')}</label>
                            <input value={wallets.master} onChange={e => setWallets({...wallets, master: e.target.value})} className="w-full bg-black/50 border border-red-900/30 rounded p-2 text-sm font-mono"/>
                        </div>
                    </div>
                </div>

                <div className="border border-red-900/50 p-6 rounded bg-black/40 space-y-6">
                    <h2 className="text-xl font-bold text-yellow-400 flex items-center gap-2"><DollarSign size={20}/> {t('pricingConfig')}</h2>
                    
                    <div>
                        <h3 className="text-sm font-bold text-white/70 mb-2 border-b border-white/10 pb-1">{t('itemPrices')}</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-white/50 block">{t('energyPrice')}</label>
                                <input type="number" value={settings.energyPrice} onChange={e => setSettings({...settings, energyPrice: Number(e.target.value)})} className="w-full bg-black/50 border border-white/10 rounded p-1"/>
                            </div>
                            <div>
                                <label className="text-xs text-white/50 block">{t('revivePrice')}</label>
                                <input type="number" value={settings.revivePrice} onChange={e => setSettings({...settings, revivePrice: Number(e.target.value)})} className="w-full bg-black/50 border border-white/10 rounded p-1"/>
                            </div>
                            <div>
                                <label className="text-xs text-white/50 block">{t('shieldPrice')}</label>
                                <input type="number" value={settings.shieldPrice} onChange={e => setSettings({...settings, shieldPrice: Number(e.target.value)})} className="w-full bg-black/50 border border-white/10 rounded p-1"/>
                            </div>
                            <div>
                                <label className="text-xs text-white/50 block">{t('nitroPrice')}</label>
                                <input type="number" value={settings.nitroPrice} onChange={e => setSettings({...settings, nitroPrice: Number(e.target.value)})} className="w-full bg-black/50 border border-white/10 rounded p-1"/>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-white/70 mb-2 border-b border-white/10 pb-1">{t('adPrices')}</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-white/50 block">{t('bannerCost')}</label>
                                <input type="number" value={settings.adBannerCost} onChange={e => setSettings({...settings, adBannerCost: Number(e.target.value)})} className="w-full bg-black/50 border border-white/10 rounded p-1"/>
                            </div>
                            <div>
                                <label className="text-xs text-white/50 block">{t('fullscreenCost')}</label>
                                <input type="number" value={settings.adFullscreenCost} onChange={e => setSettings({...settings, adFullscreenCost: Number(e.target.value)})} className="w-full bg-black/50 border border-white/10 rounded p-1"/>
                            </div>
                            <div>
                                <label className="text-xs text-white/50 block">{t('videoCost')}</label>
                                <input type="number" step="0.01" value={settings.adVideoCost} onChange={e => setSettings({...settings, adVideoCost: Number(e.target.value)})} className="w-full bg-black/50 border border-white/10 rounded p-1"/>
                            </div>
                            <div>
                                <label className="text-xs text-white/50 block">CE333 Value ($)</label>
                                <input type="number" step="0.01" value={settings.ce333Price} onChange={e => setSettings({...settings, ce333Price: Number(e.target.value)})} className="w-full bg-black/50 border border-white/10 rounded p-1"/>
                            </div>
                        </div>
                    </div>

                    <button onClick={saveSettings} className="w-full bg-green-700 hover:bg-green-600 py-3 rounded font-bold text-white mt-4">SAVE CONFIGURATION</button>
                </div>
            </div>
        )}

        {/* --- ADMIN ADS TAB --- */}
        {adminRole === 'Master' && activeTab === 'admin_ads' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-black/40 border border-red-900/50 p-6 rounded-xl">
                    <h2 className="text-lg font-bold text-purple-400 mb-4 flex items-center gap-2"><Megaphone size={18}/> {t('createAdminAd')}</h2>
                    <div className="space-y-4">
                         <input value={adTitle} onChange={e => setAdTitle(e.target.value)} placeholder="Title" className="w-full bg-black/50 border border-white/10 rounded p-2"/>
                         <input value={adContent} onChange={e => setAdContent(e.target.value)} placeholder="Content / Description" className="w-full bg-black/50 border border-white/10 rounded p-2"/>
                         
                         <div className="flex gap-2">
                            {['Banner', 'Fullscreen', 'Video'].map(t => (
                                <button key={t} onClick={() => setAdType(t as any)} className={`flex-1 py-2 rounded text-xs border ${adType === t ? 'bg-purple-900 border-purple-500' : 'bg-black/50 border-white/10'}`}>{t}</button>
                            ))}
                         </div>

                         {adType === 'Video' ? (
                             <input value={adVideoUrl} onChange={e => setAdVideoUrl(e.target.value)} placeholder="Video URL" className="w-full bg-black/50 border border-white/10 rounded p-2"/>
                         ) : (
                             <input value={adLink} onChange={e => setAdLink(e.target.value)} placeholder="Target Link" className="w-full bg-black/50 border border-white/10 rounded p-2"/>
                         )}

                         <button onClick={createAdminAd} className="w-full bg-purple-600 hover:bg-purple-500 py-2 rounded font-bold mt-2">{t('publish')}</button>
                    </div>
                </div>

                <div className="bg-black/40 border border-red-900/50 p-6 rounded-xl overflow-y-auto max-h-[500px]">
                    <h2 className="text-lg font-bold text-white/70 mb-4 flex items-center gap-2"><Clock size={18}/> {t('adminAdHistory')}</h2>
                    {adminAdsList.length === 0 ? <p className="text-white/30 text-sm">No admin ads created.</p> : (
                        <div className="space-y-3">
                            {adminAdsList.map(ad => (
                                <div key={ad.id} className="bg-white/5 p-3 rounded border border-white/5 flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-sm text-purple-300">{ad.title}</p>
                                        <p className="text-xs text-white/50">{ad.type} • {ad.viewsPurchased} views</p>
                                    </div>
                                    <span className="text-green-500 text-xs bg-green-900/20 px-2 py-1 rounded">Active</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* ACCOUNTING TAB */}
        {adminRole === 'Master' && activeTab === 'accounting' && (
            <div className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-green-900/20 border border-green-500/30 p-6 rounded-2xl">
                          <h3 className="text-green-400 font-bold mb-2 flex items-center gap-2"><DollarSign size={20}/> {t('income')}</h3>
                          <div className="space-y-2 text-sm">
                              <div className="flex justify-between"><span>{t('adsRevenue')}</span> <span>+{ACCOUNTING_STATS.revenue.ads}</span></div>
                              <div className="flex justify-between"><span>{t('marketFees')}</span> <span>+{ACCOUNTING_STATS.revenue.marketFees}</span></div>
                              <div className="flex justify-between"><span>{t('swapFees')}</span> <span>+{ACCOUNTING_STATS.revenue.swapFees}</span></div>
                              <div className="flex justify-between"><span>{t('shopSales')}</span> <span>+{ACCOUNTING_STATS.revenue.shopSales}</span></div>
                              <div className="flex justify-between text-yellow-400"><span>{t('vipSales')}</span> <span>+{ACCOUNTING_STATS.revenue.vipSales}</span></div>
                              <div className="border-t border-green-500/30 pt-2 flex justify-between font-bold text-lg">
                                  <span>Total</span> <span>+{ACCOUNTING_STATS.revenue.total}</span>
                              </div>
                          </div>
                      </div>
                      <div className="bg-red-900/20 border border-red-500/30 p-6 rounded-2xl">
                          <h3 className="text-red-400 font-bold mb-2 flex items-center gap-2"><CreditCard size={20}/> {t('expenses')}</h3>
                           <div className="space-y-2 text-sm">
                              <div className="flex justify-between"><span>{t('userWithdrawals')}</span> <span>-{ACCOUNTING_STATS.expenses.userWithdrawals}</span></div>
                              <div className="flex justify-between"><span>{t('adRewards')}</span> <span>-{ACCOUNTING_STATS.expenses.adRewards}</span></div>
                              <div className="border-t border-red-500/30 pt-2 flex justify-between font-bold text-lg">
                                  <span>Total</span> <span>-{ACCOUNTING_STATS.expenses.total}</span>
                              </div>
                          </div>
                      </div>
                      <div className="bg-blue-900/20 border border-blue-500/30 p-6 rounded-2xl flex flex-col justify-center items-center">
                          <h3 className="text-blue-400 font-bold mb-4 flex items-center gap-2"><PieChart size={24}/> {t('netProfit')}</h3>
                          <p className="text-5xl font-black text-white">{ACCOUNTING_STATS.netProfit}</p>
                          <p className="text-blue-300 text-sm mt-2">CE333 Coins</p>
                      </div>
                 </div>
            </div>
        )}
        
        {/* INFLUENCERS TAB */}
        {adminRole === 'Master' && activeTab === 'influencers' && (
            <div className="border border-red-900/50 p-6 rounded bg-black/40">
                <h2 className="text-xl font-bold text-purple-400 mb-4 flex items-center gap-2"><Star size={20}/> {t('influencers')}</h2>
                <div className="space-y-2">
                    {influencerSubmissions.length === 0 ? <p className="text-white/30 text-sm">No pending submissions</p> : 
                        influencerSubmissions.map(sub => (
                            <div key={sub.id} className="bg-black/30 p-4 rounded-lg flex flex-col md:flex-row justify-between items-center gap-4 border border-white/5">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${sub.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-500' : (sub.status === 'Approved' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500')}`}>
                                            {sub.status}
                                        </span>
                                        <span className="text-white font-bold">{sub.platform}</span>
                                    </div>
                                    <a href="#" className="text-blue-400 text-sm hover:underline flex items-center gap-1 mt-1"><ExternalLink size={12}/> {sub.link}</a>
                                    <p className="text-white/60 text-xs mt-1">Claims {sub.viewsClaimed} Views</p>
                                </div>
                                <div className="text-right">
                                     <p className="text-green-400 font-bold mb-2">Reward: {Math.floor(sub.viewsClaimed / INFLUENCER_VIEW_STEP) * INFLUENCER_REWARD_RATE} CE333</p>
                                     {sub.status === 'Pending' && onReviewSubmission && (
                                         <div className="flex gap-2">
                                             <button onClick={() => onReviewSubmission(sub.id, 'Approved')} className="bg-green-800 hover:bg-green-700 px-3 py-1 rounded text-xs flex items-center gap-1"><CheckCircle size={12}/> Approve</button>
                                             <button onClick={() => onReviewSubmission(sub.id, 'Rejected')} className="bg-red-800 hover:bg-red-700 px-3 py-1 rounded text-xs flex items-center gap-1"><XCircle size={12}/> Reject</button>
                                         </div>
                                     )}
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        )}

        {/* USERS TAB */}
        {adminRole === 'Master' && activeTab === 'users' && (
            <div className="border border-red-900/50 p-6 rounded bg-black/40">
                <h2 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2"><Lock size={20}/> User Management</h2>
                <div className="flex gap-2 mb-6">
                    <input value={userIdInput} onChange={e => setUserIdInput(e.target.value)} placeholder="User ID" className="flex-1 bg-black/50 border border-red-900/30 rounded p-2"/>
                    <button onClick={() => onBanUser(userIdInput, true)} className="bg-red-800 px-4 rounded">{t('banUser')}</button>
                    <button onClick={() => onBanUser(userIdInput, false)} className="bg-green-800 px-4 rounded">{t('unbanUser')}</button>
                </div>

                <div className="border-t border-white/10 pt-4 mb-4">
                     <h3 className="text-yellow-400 font-bold mb-2">{t('vipClub')}</h3>
                     <div className="flex gap-2">
                        <button onClick={() => onToggleVip(userIdInput, true)} className="bg-yellow-600 px-4 py-2 rounded font-bold text-sm">{t('grantVip')}</button>
                        <button onClick={() => onToggleVip(userIdInput, false)} className="bg-slate-700 px-4 py-2 rounded font-bold text-sm">{t('revokeVip')}</button>
                     </div>
                </div>

                {/* GIFT COINS */}
                <div className="border-t border-white/10 pt-4">
                     <h3 className="text-green-400 font-bold mb-2">Gift Coins</h3>
                     <div className="flex gap-2">
                        <input 
                          type="number" 
                          value={giftAmount} 
                          onChange={(e) => setGiftAmount(Math.max(0, Number(e.target.value)))} 
                          className="w-32 bg-black/50 border border-white/10 rounded p-2 text-white font-bold"
                          placeholder="Amount"
                        />
                        <button onClick={() => onAddCoins(giftAmount)} className="bg-green-700 hover:bg-green-600 px-4 py-2 rounded font-bold text-sm flex items-center gap-2">
                           <Coins size={16}/> Send Gift
                        </button>
                     </div>
                </div>
            </div>
        )}
        
        {/* WALLET TAB */}
        {adminRole === 'Master' && activeTab === 'wallet' && (
             <div className="border border-red-900/50 p-6 rounded bg-black/40">
                   <h2 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2"><Clock size={20}/> {t('pending')}</h2>
                   <div className="space-y-2">
                       {withdrawals.length === 0 ? <p className="text-white/30 text-sm">No pending withdrawals</p> : 
                          withdrawals.map(w => (
                              <div key={w.id} className="bg-black/30 p-3 rounded flex justify-between items-center text-sm">
                                  <div>
                                      <p className="font-bold">{w.amount} CE333</p>
                                      <p className="text-xs text-white/50">{w.destination}</p>
                                  </div>
                                  <span className="bg-yellow-900/30 text-yellow-500 px-2 py-1 rounded text-xs">{w.status}</span>
                              </div>
                          ))
                       }
                   </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default Admin;
