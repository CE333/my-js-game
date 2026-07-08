
import React, { useState } from 'react';
import { PlayerProfile, Avatar } from '../types';
import { AVATARS } from '../constants';
import AvatarPreview from './AvatarPreview';
import { User, CheckCircle, ArrowRight } from 'lucide-react';

interface WelcomeSetupProps {
  onComplete: (avatarId: string) => void;
  t: (key: string) => string;
}

const WelcomeSetup: React.FC<WelcomeSetupProps> = ({ onComplete, t }) => {
  const [selectedAvatar, setSelectedAvatar] = useState<string>('male_default');
  const freeAvatars = AVATARS.filter(a => a.price === 0);

  return (
    <div className="absolute inset-0 bg-slate-900 z-50 flex flex-col items-center justify-center p-6 text-white animate-in fade-in duration-500">
      <div className="max-w-md w-full bg-slate-800/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
         
         <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-cyan-400 mb-2">{t('welcome')}</h1>
            <p className="text-white/60">{t('setupProfile')}</p>
         </div>

         <div className="mb-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-center mb-6 flex items-center justify-center gap-2">
               <User size={16}/> {t('chooseAvatar')}
            </h3>
            
            <div className="flex justify-center gap-6">
               {freeAvatars.map(avatar => (
                  <div 
                    key={avatar.id}
                    onClick={() => setSelectedAvatar(avatar.id)}
                    className={`cursor-pointer transition-all transform hover:scale-105 flex flex-col items-center gap-3 p-4 rounded-2xl border-2
                       ${selectedAvatar === avatar.id ? 'border-cyan-500 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'border-white/10 bg-white/5 opacity-60'}
                    `}
                  >
                     <AvatarPreview avatarId={avatar.id} flagId="none" size={100} />
                     <span className="font-bold">{t(avatar.gender === 'Male' ? 'male' : 'female')}</span>
                  </div>
               ))}
            </div>
         </div>

         <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-xl mb-8 flex items-start gap-3">
             <div className="bg-green-500/20 p-2 rounded-full">
                <CheckCircle size={20} className="text-green-400"/>
             </div>
             <div>
                <h4 className="font-bold text-green-300 text-sm">{t('claimStarter')}</h4>
                <p className="text-xs text-green-200/60 mt-1">{t('starterIncludes')}</p>
             </div>
         </div>

         <button 
           onClick={() => onComplete(selectedAvatar)}
           className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-bold text-lg shadow-lg shadow-cyan-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
         >
           {t('enterWorld')} <ArrowRight size={20}/>
         </button>

      </div>
    </div>
  );
};

export default WelcomeSetup;
