
import React, { useRef, useEffect } from 'react';

interface BirdPreviewProps {
  skinId: string;
  size?: number;
}

const BirdPreview: React.FC<BirdPreviewProps> = ({ skinId, size = 80 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!ctx.roundRect) {
      // @ts-ignore
      ctx.roundRect = function(x: number, y: number, w: number, h: number, r: number | number[]) {
        let radius = { tl: 0, tr: 0, br: 0, bl: 0 };
        if (typeof r === 'number') {
          radius = {tl: r, tr: r, br: r, bl: r};
        } else if (Array.isArray(r)) {
          const val = r[0] || 0;
          radius = {tl: val, tr: val, br: val, bl: val};
        }
        this.beginPath();
        this.moveTo(x + radius.tl, y);
        this.lineTo(x + w - radius.tr, y);
        this.quadraticCurveTo(x + w, y, x + w, y + radius.tr);
        this.lineTo(x + w, y + h - radius.br);
        this.quadraticCurveTo(x + w, y + h, x + w - radius.br, y + h);
        this.lineTo(x + radius.bl, y + h);
        this.quadraticCurveTo(x, y + h, x, y + h - radius.bl);
        this.lineTo(x, y + radius.tl);
        this.quadraticCurveTo(x, y, x + radius.tl, y);
        this.closePath();
      };
    }

    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.translate(size / 2, size / 2);
    const scale = size / 60; 
    ctx.scale(scale, scale);

    const r = 24; 

    let shape: 'circle' | 'tall' | 'cube' | 'oval' = 'oval'; 
    let baseColor = '#3b82f6';
    let accentColor = '#93c5fd';
    let eyeType: 'normal' | 'angry' | 'cool' | 'cyborg' | 'ninja' | 'helmet' | 'visor' = 'normal';
    let pattern: 'none' | 'camo' | 'metal' = 'none';
    
    // STANDARD SKINS
    if (skinId === 'ce333') { baseColor = '#2563eb'; accentColor = '#60a5fa'; eyeType = 'cyborg'; }
    if (skinId === 'happy_blob') { baseColor = '#f472b6'; accentColor = '#fbcfe8'; }
    if (skinId === 'tall_jim') { baseColor = '#22c55e'; accentColor = '#86efac'; shape='tall'; }
    if (skinId === 'angry_cube') { baseColor = '#ef4444'; accentColor = '#fca5a5'; shape='cube'; eyeType='angry'; }
    if (skinId === 'cool_dude') { baseColor = '#8b5cf6'; accentColor = '#c4b5fd'; eyeType='cool'; }
    if (skinId === 'ninja_stealth') { baseColor = '#1f2937'; accentColor = '#374151'; eyeType='ninja'; }
    if (skinId === 'rocket_tube') { baseColor = '#e11d48'; accentColor = '#fb7185'; shape='tall'; }

    // BATTLE SKINS
    if (skinId === 'recruit_joe') { baseColor = '#57534e'; accentColor = '#78716c'; pattern='camo'; eyeType='helmet'; }
    if (skinId === 'sgt_rock') { baseColor = '#155e75'; accentColor = '#164e63'; pattern='camo'; eyeType='helmet'; }
    if (skinId === 'pilot_ace') { baseColor = '#b45309'; accentColor = '#d97706'; eyeType='visor'; }
    if (skinId === 'spec_ops') { baseColor = '#0f172a'; accentColor = '#1e293b'; eyeType='visor'; }
    if (skinId === 'tank_buster') { baseColor = '#3f6212'; accentColor = '#4d7c0f'; shape='cube'; pattern='metal'; eyeType='helmet'; }
    if (skinId === 'mecha_mk1') { baseColor = '#cbd5e1'; accentColor = '#94a3b8'; shape='tall'; pattern='metal'; eyeType='cyborg'; }
    if (skinId === 'cyborg_soldier') { baseColor = '#71717a'; accentColor = '#a1a1aa'; eyeType='cyborg'; pattern='metal'; }
    if (skinId === 'general_star') { baseColor = '#1e3a8a'; accentColor = '#fbbf24'; eyeType='helmet'; }
    if (skinId === 'void_walker') { baseColor = '#4c1d95'; accentColor = '#8b5cf6'; eyeType='visor'; }
    if (skinId === 'doom_slayer') { baseColor = '#7f1d1d'; accentColor = '#fca5a5'; eyeType='angry'; }

    // --- NEW SKINS ---
    if (skinId === 'bat_bird') { baseColor = '#111'; accentColor = '#333'; eyeType='angry'; }
    if (skinId === 'bee_buzz') { baseColor = '#fbbf24'; accentColor = '#000'; }
    if (skinId === 'ufo_saucer') { baseColor = '#9ca3af'; accentColor = '#22d3ee'; shape='oval'; }
    if (skinId === 'ghost_boo') { baseColor = 'rgba(255,255,255,0.6)'; accentColor = '#fff'; }
    if (skinId === 'skeleton_bone') { baseColor = '#f3f4f6'; accentColor = '#9ca3af'; eyeType='angry'; }
    if (skinId === 'rainbow_dash') { baseColor = '#f472b6'; accentColor = '#22d3ee'; }
    if (skinId === 'golden_eagle') { baseColor = '#f59e0b'; accentColor = '#fcd34d'; eyeType='angry'; }
    if (skinId === 'owl_wise') { baseColor = '#78350f'; accentColor = '#a16207'; }
    if (skinId === 'parrot_party') { baseColor = '#ef4444'; accentColor = '#22c55e'; }
    if (skinId === 'toucan_tropic') { baseColor = '#000'; accentColor = '#fff'; }
    
    // DRAW TAIL
    ctx.fillStyle = accentColor;
    ctx.beginPath();
    if (skinId === 'bat_bird') {
         ctx.moveTo(-r, -5); ctx.lineTo(-r-10, -10); ctx.lineTo(-r-5, 0); ctx.lineTo(-r-10, 10); ctx.lineTo(-r, 5);
    } else {
         ctx.moveTo(-r, 0); ctx.lineTo(-r - 10, -5); ctx.lineTo(-r - 10, 5);
    }
    ctx.fill();

    // DRAW BODY
    ctx.fillStyle = baseColor;
    ctx.beginPath();
    if (shape === 'cube') {
      ctx.fillRect(-r, -r, r*2, r*2);
    } else if (shape === 'tall') {
      ctx.ellipse(0, 0, r*0.7, r*1.3, 0, 0, Math.PI*2);
    } else {
      ctx.ellipse(0, 0, r * 1.2, r * 0.9, 0, 0, Math.PI*2);
    }
    ctx.fill();

    // PATTERNS
    if (pattern === 'camo') {
       ctx.fillStyle = 'rgba(0,0,0,0.2)';
       ctx.beginPath(); ctx.arc(-r/2, -r/2, r/3, 0, Math.PI*2); ctx.fill();
       ctx.beginPath(); ctx.arc(r/2, r/2, r/4, 0, Math.PI*2); ctx.fill();
       ctx.beginPath(); ctx.arc(0, r/2, r/5, 0, Math.PI*2); ctx.fill();
    }
    if (pattern === 'metal') {
       ctx.fillStyle = 'rgba(255,255,255,0.3)';
       ctx.fillRect(-r + 4, -r + 4, 8, 8);
       ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth = 1; ctx.strokeRect(-r, -r, r*2, r*2);
    }
    if (skinId === 'bee_buzz') {
        ctx.fillStyle = '#000';
        ctx.fillRect(-10, -r+2, 5, r*1.8);
        ctx.fillRect(5, -r+2, 5, r*1.8);
    }
    if (skinId === 'rainbow_dash') {
        ctx.strokeStyle = accentColor; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(-r, 0); ctx.lineTo(r, 0); ctx.stroke();
    }
    if (skinId === 'skeleton_bone') {
        ctx.fillStyle = '#000';
        ctx.fillRect(-5, 0, 2, 8); ctx.fillRect(0, 0, 2, 8); ctx.fillRect(5, 0, 2, 8);
    }
    if (skinId === 'ufo_saucer') {
        ctx.fillStyle = '#22d3ee'; ctx.beginPath(); ctx.arc(0, -5, 10, 0, Math.PI*2); ctx.fill();
    }

    // DRAW EYES
    const eyeY = shape === 'tall' ? -r * 0.5 : -6;
    if (skinId === 'owl_wise') {
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(-5, eyeY, 8, 0, Math.PI*2); ctx.arc(5, eyeY, 8, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(-5, eyeY, 3, 0, Math.PI*2); ctx.arc(5, eyeY, 3, 0, Math.PI*2); ctx.fill();
    } else if (skinId === 'ufo_saucer') {
        // No eyes
    } else if (eyeType === 'helmet') {
       ctx.fillStyle = '#3f6212'; ctx.beginPath(); ctx.arc(0, eyeY - 5, r + 2, Math.PI, 0); ctx.fill();
       ctx.fillStyle = '#111'; ctx.beginPath(); ctx.roundRect(-20, eyeY-5, 40, 10, 4); ctx.fill();
       ctx.fillStyle = '#4ade80'; ctx.beginPath(); ctx.arc(-10, eyeY, 4, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(10, eyeY, 4, 0, Math.PI*2); ctx.fill();
    } else if (eyeType === 'visor') {
       ctx.fillStyle = '#0ea5e9'; ctx.beginPath(); ctx.roundRect(-r*0.8, eyeY - 4, r*1.6, 14, 4); ctx.fill();
       ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.beginPath(); ctx.moveTo(-r*0.5, eyeY - 4); ctx.lineTo(r*0.5, eyeY+8); ctx.stroke();
    } else if (eyeType === 'ninja') {
      ctx.fillStyle = '#000'; ctx.fillRect(-r, eyeY - 6, shape === 'cube' ? r*2 : r*1.8, 12);
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(6, eyeY, 4, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(-6, eyeY, 4, 0, Math.PI*2); ctx.fill();
    } else if (eyeType === 'cool') {
      ctx.fillStyle = '#000';
      ctx.beginPath(); ctx.roundRect(-16, eyeY - 4, 14, 10, 2); ctx.roundRect(2, eyeY - 4, 14, 10, 2); ctx.fill();
      ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-2, eyeY); ctx.lineTo(2, eyeY); ctx.stroke();
    } else if (eyeType === 'cyborg') {
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(-8, eyeY, 8, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(-6, eyeY, 3, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#333'; ctx.beginPath(); ctx.arc(8, eyeY, 9, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(8, eyeY, 4, 0, Math.PI*2); ctx.fill();
    } else {
      ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(-8, eyeY, 8, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#000000'; ctx.beginPath(); ctx.arc(-6, eyeY, 3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(8, eyeY, 8, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#000000'; ctx.beginPath(); ctx.arc(10, eyeY, 3, 0, Math.PI * 2); ctx.fill();
      if (eyeType === 'angry') {
        ctx.fillStyle = '#000'; ctx.beginPath(); ctx.moveTo(-18, eyeY - 8); ctx.lineTo(-2, eyeY - 2); ctx.lineTo(-18, eyeY - 10); ctx.fill();
        ctx.beginPath(); ctx.moveTo(18, eyeY - 8); ctx.lineTo(2, eyeY - 2); ctx.lineTo(18, eyeY - 10); ctx.fill();
      }
    }

    // DRAW BEAK
    const beakY = shape === 'tall' ? 2 : 4;
    if (skinId === 'toucan_tropic') {
        ctx.fillStyle = '#f97316'; ctx.beginPath(); ctx.moveTo(0, beakY); ctx.lineTo(20, beakY + 4); ctx.lineTo(0, beakY + 12); ctx.fill();
        ctx.fillStyle = '#000'; ctx.fillRect(15, beakY+2, 5, 5);
    } else if (eyeType !== 'visor' && skinId !== 'ufo_saucer') {
        ctx.fillStyle = '#facc15'; ctx.beginPath(); ctx.moveTo(0, beakY); ctx.lineTo(16, beakY + 6); ctx.lineTo(0, beakY + 12); ctx.fill();
    }

    // WING
    if (skinId !== 'ufo_saucer') {
        ctx.fillStyle = baseColor;
        if (skinId === 'bat_bird') {
            ctx.fillStyle = '#333'; ctx.beginPath(); ctx.moveTo(-5, 0); ctx.lineTo(10, -15); ctx.lineTo(5, 5); ctx.fill();
        } else {
            ctx.beginPath(); ctx.ellipse(-12, 12, 10, 6, -0.5, 0, Math.PI * 2); ctx.fill();
        }
    }
    
    ctx.restore();
  }, [skinId, size]);

  return <canvas ref={canvasRef} width={size} height={size} className="bg-transparent" />;
};

export default BirdPreview;
