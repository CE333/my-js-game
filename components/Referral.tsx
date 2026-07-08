import React, { useState } from 'react';
import { PlayerProfile } from '../types';
import { REFERRAL_REWARD_PER_STEP, REFERRAL_STEP, REFERRAL_CAP, INFLUENCER_REWARD_RATE } from '../constants';
import { ArrowLeft, Users, Copy, Gift, Share2, Check, Video, Camera, Twitter, UploadCloud, CheckCircle } from 'lucide-react';

interface ReferralProps {
  profile: PlayerProfile;
  onBack: () => void;
  onSimulateInvite: () => void;
  onSubmitProof: (platform: 'YouTube'|'Instagram'|'X'|'Other', link: string, views: number, screenshot: string) => void;
  t: (key: string) => string;
}

const Referral: React.FC<ReferralProps> = ({ profile, onBack, onSimulateInvite, onSubmitProof, t }) => {
  const [activeTab, setActiveTab] = useState<'Friends' | 'Influencer'>('Friends');
  const [copied, setCopied] = useState(false);
  const inviteLink = `https://ce333.game/invite/${Math.random().toString(36).substr(2, 6)}`;

  // Influencer Form
  const [platform, setPlatform] = useState<'YouTube'|'Instagram'|'X'|'Other'>('YouTube');
  const [postLink, setPostLink] = useState('');
  const [views, setViews] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleProofSubmit = () => {
      if(!postLink || !views) return;
      onSubmitProof(platform, postLink, parseInt(views) || 0, "mock_screenshot.png");
      setSubmitted(true);
      setTimeout(() => {
          setSubmitted(false);
          setPostLink('');
          setViews('');
      }, 3000);
  };

  return (
    <div className="absolute inset-0 bg-slate-900/85 backdrop-blur-md z-50 flex flex-col text-white font-sans overflow-hidden">
       {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-white/10 bg-black/40">
        <button onClick={onBack} className="flex items-center gap-1 px-3 py-2 hover:bg-white/10 rounded-lg transition-colors border border-white/10">
          <ArrowLeft size={20} />
          <span className="text-sm font-bold">{t('back')}</span>
        </button>
        <h1 className="text-xl font-bold tracking-wider text-green-400 flex items-center gap-2">
           <Users size={20}/> {t('inviteFriends')}
        </h1>
        <div className="w-8"></div>
      </div>

      <div className="flex p-2 bg-black/40 gap-2">
         <button onClick={() => setActiveTab('Friends')} className={`flex-1 py-3 rounded-xl font-bold transition-all ${activeTab === 'Friends' ? 'bg-green-600' : 'bg-white/5 text-slate-400'}`}>{t('inviteFriends')}</button>
         <button onClick={() => setActiveTab('Influencer')} className={`flex-1 py-3 rounded-xl font-bold transition-all ${activeTab === 'Influencer' ? 'bg-purple-600' : 'bg-white/5 text-slate-400'}`}>{t('influencerHub')}</button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'Friends' && (
            <div className="flex flex-col items-center max-w-md mx-auto w-full">
                
                <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 p-8 rounded-full mb-6 relative">
                    <div className="absolute inset-0 bg-green-400 blur-3xl opacity-20"></div>
                    <Gift size={64} className="text-green-300 relative z-10"/>
                </div>

                <h2 className="text-2xl font-bold text-center mb-2">{t('inviteEarn')}</h2>
                <p className="text-center text-white/60 mb-8 max-w-xs">
                   {t('shareDesc')} <span className="text-yellow-400 font-bold">{REFERRAL_REWARD_PER_STEP} CE333</span>.
                </p>

                <div className="w-full bg-black/40 border border-white/10 rounded-xl p-4 mb-8">
                    <label className="text-xs text-white/40 mb-2 block uppercase tracking-wider">{t('yourLink')}</label>
                    <div className="flex gap-2">
                    <div className="flex-1 bg-black/30 rounded px-3 py-2 text-white/80 font-mono text-sm truncate">
                        {inviteLink}
                    </div>
                    <button onClick={handleCopy} className="p-2 bg-white/10 hover:bg-white/20 rounded transition-colors">
                        {copied ? <Check size={18} className="text-green-400"/> : <Copy size={18}/>}
                    </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full mb-8">
                    <button className="flex items-center justify-center gap-2 bg-[#0088cc] hover:bg-[#0077b5] py-3 rounded-xl font-bold transition-all">
                    <Share2 size={18}/> Telegram
                    </button>
                    <button className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] py-3 rounded-xl font-bold transition-all">
                    <Share2 size={18}/> WhatsApp
                    </button>
                </div>

                <div className="w-full border-t border-white/10 pt-8">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-white/60">{t('totalInvites')}</span>
                        <div className="text-right">
                             <span className="text-2xl font-black">{profile.referralCount}</span>
                             <p className="text-[10px] text-white/40">{t('referralCap')}</p>
                        </div>
                    </div>

                    <div className="bg-white/5 rounded-lg p-3 mb-4">
                        <p className="text-xs text-white/50 mb-1">{t('referralProgress')}</p>
                        <div className="flex gap-1">
                            {[1, 2, 3].map(step => (
                                <div key={step} className={`h-2 flex-1 rounded-full ${profile.referralCount % 3 >= step || (profile.referralCount > 0 && profile.referralCount % 3 === 0) ? 'bg-green-400' : 'bg-white/20'}`}></div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Simulation Button for Demo */}
                    <button 
                    onClick={onSimulateInvite}
                    className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl font-bold text-sm text-yellow-200 transition-colors"
                    >
                    {t('simulate')}
                    </button>
                </div>

            </div>
        )}

        {activeTab === 'Influencer' && (
            <div className="flex flex-col items-center max-w-md mx-auto w-full animate-in fade-in slide-in-from-right-8">
                 <div className="text-center mb-8">
                     <h2 className="text-2xl font-bold text-purple-300">{t('influencerHub')}</h2>
                     <p className="text-white/60 text-sm mt-2">{t('influencerDesc')}</p>
                     <div className="bg-purple-900/30 border border-purple-500/30 px-4 py-2 rounded-lg mt-4 inline-block">
                         <span className="text-yellow-400 font-bold">{t('influencerRates')}</span>
                     </div>
                 </div>

                 {submitted ? (
                     <div className="bg-green-500/20 border border-green-500/50 p-8 rounded-2xl flex flex-col items-center">
                         <CheckCircle size={48} className="text-green-400 mb-4"/>
                         <h3 className="text-xl font-bold text-green-200">{t('submit')} Success</h3>
                         <p className="text-white/60 text-center mt-2">{t('pendingReview')}</p>
                     </div>
                 ) : (
                     <div className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 space-y-4">
                         <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-white/80"><UploadCloud size={20}/> {t('submitProof')}</h3>
                         
                         <div>
                             <label className="text-xs text-white/50 mb-1 block">{t('platform')}</label>
                             <div className="flex gap-2">
                                 {['YouTube', 'Instagram', 'X'].map(p => (
                                     <button 
                                       key={p} 
                                       onClick={() => setPlatform(p as any)}
                                       className={`flex-1 py-2 rounded-lg border text-sm flex justify-center items-center gap-1
                                          ${platform === p ? 'bg-purple-600 border-purple-400' : 'bg-white/5 border-white/10'}
                                       `}
                                     >
                                        {p === 'YouTube' && <Video size={14}/>}
                                        {p === 'Instagram' && <Camera size={14}/>}
                                        {p === 'X' && <Twitter size={14}/>}
                                        {p}
                                     </button>
                                 ))}
                             </div>
                         </div>

                         <div>
                             <label className="text-xs text-white/50 mb-1 block">{t('linkToPost')}</label>
                             <input value={postLink} onChange={e => setPostLink(e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-lg p-3 outline-none" placeholder="https://..." />
                         </div>

                         <div>
                             <label className="text-xs text-white/50 mb-1 block">{t('views')}</label>
                             <input type="number" value={views} onChange={e => setViews(e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-lg p-3 outline-none" placeholder="3000" />
                         </div>

                         <div>
                             <label className="text-xs text-white/50 mb-1 block">{t('screenshot')}</label>
                             <div className="w-full h-20 bg-white/5 border-2 border-dashed border-white/20 rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/10">
                                 <span className="text-xs text-white/30">Click to upload (Mock)</span>
                             </div>
                         </div>

                         <button onClick={handleProofSubmit} className="w-full bg-purple-600 hover:bg-purple-500 py-3 rounded-xl font-bold mt-4">
                             {t('submit')}
                         </button>
                     </div>
                 )}
            </div>
        )}
      </div>
    </div>
  );
};

export default Referral;