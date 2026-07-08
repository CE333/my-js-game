
import React, { useState } from 'react';
import { Bird, Globe, ChevronDown, Sparkles, Coins, Gift, Zap, TrendingUp, Users, Crown, Megaphone, Info, ShieldCheck, X } from 'lucide-react';
import { Language } from '../types';

interface LandingProps {
  onEnter: () => void;
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => string;
  onOpenAds?: () => void;
}

const Landing: React.FC<LandingProps> = ({ onEnter, lang, setLang, t, onOpenAds }) => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <div className="absolute inset-0 z-50 bg-slate-950 overflow-hidden flex flex-col items-center justify-center text-center p-6">
      
      {/* --- BACKGROUND --- */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 z-0"></div>
      
      {/* Grid Effect */}
      <div className="absolute inset-0 z-0 opacity-20" 
           style={{ backgroundImage: 'linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <div 
            key={i}
            className="absolute bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.8)]"
            style={{
              width: Math.random() * 4 + 2 + 'px',
              height: Math.random() * 4 + 2 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDuration: Math.random() * 3 + 2 + 's',
              animationDelay: Math.random() * 2 + 's'
            }}
          />
        ))}
      </div>
      
      {/* Language Switcher Dropdown */}
      <div className="absolute top-6 right-6 z-30">
         <button 
           onClick={() => setLangMenuOpen(!langMenuOpen)}
           className="bg-slate-800/80 hover:bg-slate-700 backdrop-blur-md px-3 py-2 rounded-xl flex items-center gap-2 text-white border border-white/10 transition-colors shadow-lg"
         >
            <Globe size={18} className="text-cyan-400" />
            <span className="text-sm font-bold uppercase">{lang}</span>
            <ChevronDown size={14} />
         </button>
         
         {langMenuOpen && (
            <div className="absolute top-full right-0 mt-2 bg-slate-800 border border-white/10 rounded-xl p-2 flex flex-col gap-1 w-32 shadow-xl z-40">
               <button onClick={() => { setLang('en'); setLangMenuOpen(false); }} className="px-3 py-2 text-left text-white hover:bg-white/10 rounded text-sm font-bold">English</button>
               <button onClick={() => { setLang('fa'); setLangMenuOpen(false); }} className="px-3 py-2 text-left text-white hover:bg-white/10 rounded text-sm font-bold">فارسی</button>
               <button onClick={() => { setLang('ar'); setLangMenuOpen(false); }} className="px-3 py-2 text-left text-white hover:bg-white/10 rounded text-sm font-bold">العربية</button>
            </div>
         )}
      </div>

      {/* ADS BUTTON (LARGER & ANIMATED) */}
      {onOpenAds && (
          <div className="absolute top-6 left-6 z-30">
             <button 
               onClick={onOpenAds}
               className="relative bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 p-4 rounded-full text-white border-2 border-white/30 transition-all shadow-[0_0_20px_rgba(236,72,153,0.6)] group"
             >
                <div className="absolute inset-0 bg-pink-500 rounded-full animate-ping opacity-30"></div>
                <Megaphone size={28} className="text-white group-hover:scale-110 transition-transform animate-bounce" />
             </button>
          </div>
      )}

      <div className="relative z-10 max-w-lg w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-10 duration-1000" dir={lang === 'en' ? 'ltr' : 'rtl'}>
        
        {/* LOGO - BLUE ENERGY BIRD 333 (ANIMATED) */}
        <div className="relative mb-8 group cursor-pointer perspective-1000" onClick={onEnter}>
           {/* Glow Effect */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-cyan-500/30 blur-[60px] rounded-full animate-pulse"></div>
           
           <div className="flex items-center justify-center relative animate-float">
              <div className="w-28 h-28 bg-gradient-to-br from-cyan-400 via-blue-600 to-indigo-600 rounded-3xl rotate-45 flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.6)] border-4 border-white/20 relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                  {/* Internal Shine */}
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent"></div>
                  <Bird size={56} className="text-white -rotate-45 drop-shadow-md" strokeWidth={2.5} />
              </div>
              <div className="absolute -bottom-8">
                 <span className="text-6xl font-black text-white drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] italic tracking-tighter">333</span>
              </div>
           </div>
        </div>

        <style>{`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
            100% { transform: translateY(0px); }
          }
          .animate-float {
            animation: float 5s ease-in-out infinite;
          }
        `}</style>

        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-white to-blue-200 mb-2 drop-shadow-2xl uppercase tracking-[0.2em]">
          Creative Energy
        </h1>

        <div className="bg-slate-900/60 border border-cyan-500/20 p-6 rounded-2xl backdrop-blur-md mb-8 max-w-sm shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <p className="text-cyan-100/90 leading-relaxed font-medium">
            {t('lore')}
            <br/><br/>
            <span className="text-yellow-300">{t('mission')}</span>
          </p>
        </div>

        <button 
          onClick={onEnter}
          className="group relative px-12 py-5 bg-white text-slate-950 font-black text-xl rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.4)] hover:shadow-[0_0_60px_rgba(255,255,255,0.6)] mb-10"
        >
          <span className="relative z-10 flex items-center gap-3">
             <Zap size={24} className="fill-slate-900"/>
            {t('enterWorld')}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-300 via-white to-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay"></div>
        </button>
        
        {/* --- MARKETPLACE SHOWCASE (ACTIVE ADS for CE333) --- */}
        <div className="w-full mb-20">
            <h3 className="text-cyan-400 font-bold text-sm tracking-widest uppercase mb-4 flex items-center justify-center gap-2">
               <Sparkles size={16}/> {t('specialOffers')} <Sparkles size={16}/>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
               {/* Offer 1: CE333 Token Sale */}
               <div onClick={onEnter} className="bg-slate-800/50 border border-white/10 p-3 rounded-xl flex items-center gap-3 hover:bg-slate-700/80 hover:border-cyan-400/50 transition-all cursor-pointer group active:scale-95">
                  <div className="bg-yellow-500/20 p-2 rounded-lg text-yellow-400 group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(234,179,8,0.2)]">
                     <Coins size={24} />
                  </div>
                  <div className="text-left">
                     <p className="font-bold text-white text-sm group-hover:text-cyan-200">{t('coinSale')}</p>
                     <p className="text-[10px] text-white/50">Invest in CE333</p>
                  </div>
               </div>
               
               {/* Offer 2: VIP ACCESS (New) */}
               <div onClick={onEnter} className="bg-slate-800/50 border border-white/10 p-3 rounded-xl flex items-center gap-3 hover:bg-slate-700/80 hover:border-yellow-400/50 transition-all cursor-pointer group active:scale-95">
                  <div className="bg-yellow-500/20 p-2 rounded-lg text-yellow-400 group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(234,179,8,0.2)]">
                     <Crown size={24} />
                  </div>
                  <div className="text-left">
                     <p className="font-bold text-white text-sm group-hover:text-yellow-200">{t('vipAccess')}</p>
                     <p className="text-[10px] text-yellow-200/50 animate-pulse">Unlimited Energy</p>
                  </div>
               </div>

                {/* Offer 3: Staking */}
                <div onClick={onEnter} className="bg-slate-800/50 border border-white/10 p-3 rounded-xl flex items-center gap-3 hover:bg-slate-700/80 hover:border-purple-400/50 transition-all cursor-pointer group active:scale-95">
                  <div className="bg-purple-500/20 p-2 rounded-lg text-purple-400 group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                     <TrendingUp size={24} />
                  </div>
                  <div className="text-left">
                     <p className="font-bold text-white text-sm group-hover:text-purple-200">Staking</p>
                     <p className="text-[10px] text-red-400 animate-pulse">APY 20%</p>
                  </div>
               </div>
            </div>
        </div>

      </div>

      {/* --- FOOTER --- */}
      <footer className="fixed bottom-0 left-0 w-full bg-black z-50 py-4 px-6 border-t border-white/10 flex justify-center gap-8 shadow-2xl">
          <button 
            onClick={() => setShowAbout(true)} 
            className="flex items-center gap-2 text-white/60 hover:text-cyan-400 transition-colors text-sm font-bold uppercase tracking-wider"
          >
             <Info size={16}/> {t('aboutUs')}
          </button>
          <button 
            onClick={() => setShowPrivacy(true)} 
            className="flex items-center gap-2 text-white/60 hover:text-cyan-400 transition-colors text-sm font-bold uppercase tracking-wider"
          >
             <ShieldCheck size={16}/> {t('privacyPolicy')}
          </button>
      </footer>

      {/* --- ABOUT MODAL --- */}
      {showAbout && (
          <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in" dir={lang === 'en' ? 'ltr' : 'rtl'}>
              <div className="bg-slate-900 border border-cyan-500/30 max-w-lg w-full rounded-2xl p-8 relative shadow-2xl">
                  <button onClick={() => setShowAbout(false)} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"><X size={24}/></button>
                  <div className="flex flex-col items-center mb-6">
                      <div className="bg-cyan-500/20 p-4 rounded-full mb-4 text-cyan-400"><Info size={32}/></div>
                      <h2 className="text-2xl font-bold text-white text-center">{t('aboutTitle')}</h2>
                  </div>
                  <p className="text-white/80 leading-relaxed text-justify">
                      {t('aboutText')}
                  </p>
              </div>
          </div>
      )}

      {/* --- PRIVACY MODAL --- */}
      {showPrivacy && (
          <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in" dir={lang === 'en' ? 'ltr' : 'rtl'}>
              <div className="bg-slate-900 border border-green-500/30 max-w-lg w-full rounded-2xl p-8 relative shadow-2xl">
                  <button onClick={() => setShowPrivacy(false)} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"><X size={24}/></button>
                  <div className="flex flex-col items-center mb-6">
                      <div className="bg-green-500/20 p-4 rounded-full mb-4 text-green-400"><ShieldCheck size={32}/></div>
                      <h2 className="text-2xl font-bold text-white text-center">{t('privacyTitle')}</h2>
                  </div>
                  <p className="text-white/80 leading-relaxed text-justify">
                      {t('privacyText')}
                  </p>
              </div>
          </div>
      )}

    </div>
  );
};

export default Landing;