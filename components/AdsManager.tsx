
import React, { useState } from 'react';
import { CryptoSymbol, PlayerProfile, AdCampaign, GameSettings } from '../types';
import { CRYPTO_CURRENCIES } from '../constants';
import { ArrowLeft, Megaphone, Globe, Layout, Clock, Coins, PlayCircle, Film, Users } from 'lucide-react';

interface AdsManagerProps {
  profile: PlayerProfile;
  onBack: () => void;
  onPublish: (campaign: AdCampaign, cost: number, currency: string) => void;
  t: (key: string) => string;
  gameSettings: GameSettings;
}

const AdsManager: React.FC<AdsManagerProps> = ({ profile, onBack, onPublish, t, gameSettings }) => {
  const [activeTab, setActiveTab] = useState<'Create' | 'MyAds'>('Create');
  
  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [link, setLink] = useState('');
  const [videoUrl, setVideoUrl] = useState(''); 
  const [type, setType] = useState<'Banner' | 'Fullscreen' | 'Video'>('Banner'); 
  const [days, setDays] = useState(1); 
  const [views, setViews] = useState(1000); 
  const [paymentMethod, setPaymentMethod] = useState<'CE333' | CryptoSymbol>('CE333');

  // Calculation Logic (Dynamic from Settings)
  let totalCostUSD = 0;
  if (type === 'Video') {
      totalCostUSD = gameSettings.adVideoCost * views;
  } else {
      const baseCostUSD = type === 'Banner' ? gameSettings.adBannerCost : gameSettings.adFullscreenCost;
      totalCostUSD = baseCostUSD * days; 
  }
  
  const getFinalPrice = () => {
    if (paymentMethod === 'CE333') {
      // Avoid division by zero
      const cePrice = gameSettings.ce333Price || 0.10;
      return Math.ceil(totalCostUSD / cePrice);
    } else {
      const crypto = CRYPTO_CURRENCIES.find(c => c.symbol === paymentMethod);
      if (!crypto) return 0;
      return (totalCostUSD / crypto.priceUSD).toFixed(6);
    }
  };

  const handlePublish = () => {
    const cost = Number(getFinalPrice());
    
    if (paymentMethod === 'CE333' && profile.balance < cost) {
      alert("Insufficient CE333 balance!");
      return;
    }
    
    const newAd: AdCampaign = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      content,
      link: type === 'Video' ? videoUrl : link,
      type,
      days: type === 'Video' ? 0 : days,
      viewsPurchased: views,
      status: 'Active',
      cost,
      paidWith: paymentMethod
    };
    
    onPublish(newAd, cost, paymentMethod);
    setActiveTab('MyAds');
  };

  return (
    <div className="absolute inset-0 bg-slate-900/85 backdrop-blur-md z-50 flex flex-col text-white font-sans overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-white/10 bg-black/40">
        <button onClick={onBack} className="flex items-center gap-1 px-3 py-2 hover:bg-white/10 rounded-lg transition-colors border border-white/10">
          <ArrowLeft size={20} />
          <span className="text-sm font-bold">{t('back')}</span>
        </button>
        <div className="flex flex-col items-center">
            <h1 className="text-xl font-bold tracking-wider text-pink-400 flex items-center gap-2">
            <Megaphone size={20}/> {t('adsCenter')}
            </h1>
            <span className="text-[10px] text-green-400 font-mono tracking-widest">
               {t('marketPrice')}: ${gameSettings.ce333Price}
            </span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('Create')}
            className={`px-4 py-1 rounded-full text-sm font-bold transition-all ${activeTab === 'Create' ? 'bg-pink-600 text-white' : 'bg-white/10 text-white/50'}`}
          >
            {t('createAd')}
          </button>
          <button 
             onClick={() => setActiveTab('MyAds')}
             className={`px-4 py-1 rounded-full text-sm font-bold transition-all ${activeTab === 'MyAds' ? 'bg-pink-600 text-white' : 'bg-white/10 text-white/50'}`}
          >
            {t('myAds')}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        
        {activeTab === 'Create' && (
          <div className="max-w-2xl mx-auto space-y-6">
            
            <div className="bg-black/40 p-6 rounded-2xl border border-white/10">
              <h2 className="text-lg font-bold mb-4 text-pink-200">{t('adDetails')}</h2>
              <div className="space-y-4">
                 <div>
                    <label className="text-xs text-white/50 mb-1 block">{t('title')}</label>
                    <input value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-lg p-3 focus:border-pink-500 outline-none" placeholder="Ad Headline..." />
                 </div>
                 
                 {type === 'Video' ? (
                     <div>
                        <label className="text-xs text-white/50 mb-1 block">{t('videoUrl')}</label>
                        <div className="flex items-center gap-2 bg-black/30 border border-white/10 rounded-lg px-3">
                           <PlayCircle size={16} className="text-white/50"/>
                           <input value={videoUrl} onChange={e => setVideoUrl(e.target.value)} className="w-full bg-transparent py-3 outline-none" placeholder="https://youtube.com/..." />
                        </div>
                     </div>
                 ) : (
                    <>
                        <div>
                            <label className="text-xs text-white/50 mb-1 block">{t('content')}</label>
                            <textarea value={content} onChange={e => setContent(e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-lg p-3 focus:border-pink-500 outline-none" rows={2} placeholder="Description..." />
                        </div>
                        <div>
                            <label className="text-xs text-white/50 mb-1 block">{t('link')}</label>
                            <div className="flex items-center gap-2 bg-black/30 border border-white/10 rounded-lg px-3">
                            <Globe size={16} className="text-white/50"/>
                            <input value={link} onChange={e => setLink(e.target.value)} className="w-full bg-transparent py-3 outline-none" placeholder="https://..." />
                            </div>
                        </div>
                    </>
                 )}
              </div>
            </div>

            <div className="bg-black/40 p-6 rounded-2xl border border-white/10">
              <h2 className="text-lg font-bold mb-4 text-pink-200">{t('configPrice')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                 <div>
                    <label className="text-xs text-white/50 mb-1 block">Format</label>
                    <div className="flex gap-2">
                       <button onClick={() => setType('Banner')} className={`flex-1 p-3 rounded-lg border flex flex-col items-center gap-2 ${type === 'Banner' ? 'bg-pink-500/20 border-pink-500' : 'border-white/10 opacity-50'}`}>
                          <Layout size={20}/> <span className="text-[10px]">Banner (${gameSettings.adBannerCost}/d)</span>
                       </button>
                       <button onClick={() => setType('Fullscreen')} className={`flex-1 p-3 rounded-lg border flex flex-col items-center gap-2 ${type === 'Fullscreen' ? 'bg-pink-500/20 border-pink-500' : 'border-white/10 opacity-50'}`}>
                          <Layout size={20} className="scale-125"/> <span className="text-[10px]">Full (${gameSettings.adFullscreenCost}/d)</span>
                       </button>
                       <button onClick={() => setType('Video')} className={`flex-1 p-3 rounded-lg border flex flex-col items-center gap-2 ${type === 'Video' ? 'bg-pink-500/20 border-pink-500' : 'border-white/10 opacity-50'}`}>
                          <Film size={20}/> <span className="text-[10px]">Video (${gameSettings.adVideoCost}/v)</span>
                       </button>
                    </div>
                 </div>
                 
                 {type !== 'Video' ? (
                     <div>
                        <label className="text-xs text-white/50 mb-1 block">{t('days')}</label>
                        <div className="flex items-center gap-3 bg-black/30 border border-white/10 rounded-lg p-3">
                            <Clock size={16} className="text-pink-400"/>
                            <input type="number" min="1" max="30" value={days} onChange={e => setDays(parseInt(e.target.value) || 1)} className="bg-transparent w-full outline-none font-bold" />
                        </div>
                     </div>
                 ) : (
                     <div>
                        <label className="text-xs text-white/50 mb-1 block">{t('views')}</label>
                        <div className="flex items-center gap-3 bg-black/30 border border-white/10 rounded-lg p-3">
                            <Users size={16} className="text-pink-400"/>
                            <input type="number" min="100" max="10000" step="100" value={views} onChange={e => setViews(parseInt(e.target.value) || 100)} className="bg-transparent w-full outline-none font-bold" />
                        </div>
                        <p className="text-[10px] text-white/40 mt-1 text-center">{t('videoCostNote')}</p>
                     </div>
                 )}
              </div>
              
              <div className="border-t border-white/10 pt-4">
                 <h3 className="text-sm font-bold mb-2">Select Payment Method</h3>
                 <div className="grid grid-cols-3 gap-2">
                    <button onClick={() => setPaymentMethod('CE333')} className={`p-2 rounded border flex flex-col items-center text-xs ${paymentMethod === 'CE333' ? 'bg-yellow-500/20 border-yellow-500' : 'border-white/10'}`}>
                       <Coins size={14} className="mb-1 text-yellow-400"/> CE333
                    </button>
                    {CRYPTO_CURRENCIES.slice(0, 5).map(c => (
                       <button key={c.symbol} onClick={() => setPaymentMethod(c.symbol)} className={`p-2 rounded border flex flex-col items-center text-xs ${paymentMethod === c.symbol ? 'bg-blue-500/20 border-blue-500' : 'border-white/10'}`}>
                          <span className="font-bold">{c.symbol}</span>
                       </button>
                    ))}
                 </div>
              </div>

              <div className="mt-6 bg-black/40 p-4 rounded-xl flex items-center justify-between">
                 <div>
                    <p className="text-xs text-white/50">Total Cost</p>
                    <p className="text-2xl font-black text-white">
                       {getFinalPrice()} <span className="text-sm font-normal text-white/60">{paymentMethod}</span>
                    </p>
                 </div>
                 <button onClick={handlePublish} className="bg-pink-600 hover:bg-pink-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-pink-600/20">
                    {t('publish')}
                 </button>
              </div>

            </div>

          </div>
        )}

        {activeTab === 'MyAds' && (
          <div className="flex flex-col items-center justify-center h-64 text-white/30">
             <Layout size={48} className="mb-4"/>
             <p>No active campaigns yet.</p>
             <button onClick={() => setActiveTab('Create')} className="mt-4 text-pink-400 hover:underline">{t('createAd')}</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdsManager;
