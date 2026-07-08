
import React, { useRef, useEffect } from 'react';
import { AVATARS, FLAGS } from '../constants';

interface AvatarPreviewProps {
  avatarId: string;
  flagId: string | null;
  size?: number;
}

const AvatarPreview: React.FC<AvatarPreviewProps> = ({ avatarId, flagId, size = 100 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const avatar = AVATARS.find(a => a.id === avatarId) || AVATARS[0];
  const flag = FLAGS.find(f => f.id === flagId) || FLAGS[0];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Polyfill roundRect if missing
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

    // Clear
    ctx.clearRect(0, 0, size, size);

    const cx = size / 2;
    const cy = size / 2;
    const scale = size / 100;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);

    // 1. DRAW FLAG BACKGROUND
    if (flag.id !== 'none') {
       ctx.save();
       ctx.beginPath();
       ctx.arc(0, 0, 48, 0, Math.PI * 2);
       ctx.clip();
       
       if (flag.id === 'sa') { // Saudi Arabia
           ctx.fillStyle = '#15803d'; ctx.fillRect(-50, -50, 100, 100);
           ctx.fillStyle = '#fff'; ctx.fillRect(-20, 10, 40, 4); // Sword
           ctx.font = '10px sans-serif'; ctx.fillText('الله', -10, -5); 
       } else if (flag.id === 'ae') { // UAE
           ctx.fillStyle = '#ffffff'; ctx.fillRect(-50, -50, 100, 100);
           ctx.fillStyle = '#22c55e'; ctx.fillRect(-25, -50, 75, 33);
           ctx.fillStyle = '#000000'; ctx.fillRect(-25, 17, 75, 33);
           ctx.fillStyle = '#ef4444'; ctx.fillRect(-50, -50, 25, 100);
       } else if (flag.id === 'qa') { // Qatar
           ctx.fillStyle = '#881337'; ctx.fillRect(-50, -50, 100, 100);
           ctx.fillStyle = '#ffffff'; 
           ctx.beginPath(); ctx.moveTo(-50, -50); ctx.lineTo(-20, -50);
           for(let i=0; i<10; i++) ctx.lineTo(-10, -45 + i*10);
           ctx.lineTo(-20, 50); ctx.lineTo(-50, 50); ctx.fill();
       } else if (flag.id === 'pk') { // Pakistan
           ctx.fillStyle = '#15803d'; ctx.fillRect(-50, -50, 100, 100);
           ctx.fillStyle = '#ffffff'; ctx.fillRect(-50, -50, 25, 100);
           ctx.beginPath(); ctx.arc(10, 0, 15, 0, Math.PI*2); ctx.fillStyle = '#fff'; ctx.fill();
           ctx.beginPath(); ctx.arc(14, -2, 13, 0, Math.PI*2); ctx.fillStyle = '#15803d'; ctx.fill();
       } else if (flag.id === 'ch') { // Switzerland
           ctx.fillStyle = '#ef4444'; ctx.fillRect(-50, -50, 100, 100);
           ctx.fillStyle = '#fff'; ctx.fillRect(-15, -35, 30, 70); ctx.fillRect(-35, -15, 70, 30);
       } else if (flag.id === 'se') { // Sweden
           ctx.fillStyle = '#006aa7'; ctx.fillRect(-50, -50, 100, 100);
           ctx.fillStyle = '#fecc00'; ctx.fillRect(-50, -10, 100, 20); ctx.fillRect(-20, -50, 20, 100);
       } else if (flag.id === 'no') { // Norway
           ctx.fillStyle = '#ba0c2f'; ctx.fillRect(-50, -50, 100, 100);
           ctx.fillStyle = '#fff'; ctx.fillRect(-50, -15, 100, 30); ctx.fillRect(-25, -50, 30, 100);
           ctx.fillStyle = '#00205b'; ctx.fillRect(-50, -8, 100, 16); ctx.fillRect(-18, -50, 16, 100);
       } else if (flag.id === 'gr') { // Greece
           ctx.fillStyle = '#0d5eaf'; ctx.fillRect(-50, -50, 100, 100);
           ctx.fillStyle = '#fff'; 
           for(let i=0; i<5; i++) ctx.fillRect(-50, -40 + i*20, 100, 10);
           ctx.fillStyle = '#0d5eaf'; ctx.fillRect(-50, -50, 50, 50);
           ctx.fillStyle = '#fff'; ctx.fillRect(-25, -50, 10, 50); ctx.fillRect(-50, -25, 50, 10);
       } else if (flag.id === 'pt') { // Portugal
           ctx.fillStyle = '#ff0000'; ctx.fillRect(-50, -50, 100, 100);
           ctx.fillStyle = '#006600'; ctx.fillRect(-50, -50, 40, 100);
           ctx.fillStyle = '#facc15'; ctx.beginPath(); ctx.arc(-10, 0, 12, 0, Math.PI*2); ctx.fill();
           ctx.fillStyle = '#fff'; ctx.fillRect(-15, -5, 10, 10); // Shield
       } else if (flag.id === 'ua') { // Ukraine
           ctx.fillStyle = '#0057b7'; ctx.fillRect(-50, -50, 100, 50);
           ctx.fillStyle = '#ffd700'; ctx.fillRect(-50, 0, 100, 50);
       } else if (flag.id === 'eg') { // Egypt
           ctx.fillStyle = '#ce1126'; ctx.fillRect(-50, -50, 100, 33);
           ctx.fillStyle = '#ffffff'; ctx.fillRect(-50, -17, 100, 34);
           ctx.fillStyle = '#000000'; ctx.fillRect(-50, 17, 100, 33);
           ctx.fillStyle = '#eab308'; ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI*2); ctx.fill(); // Eagle
       } else if (flag.id === 'be') { // Belgium
           ctx.fillStyle = '#000000'; ctx.fillRect(-50, -50, 33, 100);
           ctx.fillStyle = '#fddf00'; ctx.fillRect(-17, -50, 34, 100);
           ctx.fillStyle = '#ef4444'; ctx.fillRect(17, -50, 33, 100);
       } else if (flag.id === 'nl') { // Netherlands
           ctx.fillStyle = '#ae1c28'; ctx.fillRect(-50, -50, 100, 33);
           ctx.fillStyle = '#ffffff'; ctx.fillRect(-50, -17, 100, 34);
           ctx.fillStyle = '#21468b'; ctx.fillRect(-50, 17, 100, 33);
       } else if (flag.id === 'at') { // Austria
           ctx.fillStyle = '#ef4444'; ctx.fillRect(-50, -50, 100, 33);
           ctx.fillStyle = '#ffffff'; ctx.fillRect(-50, -17, 100, 34);
           ctx.fillStyle = '#ef4444'; ctx.fillRect(-50, 17, 100, 33);
       } else if (flag.id === 'th') { // Thailand
           ctx.fillStyle = '#ef4444'; ctx.fillRect(-50, -50, 100, 16); ctx.fillRect(-50, 34, 100, 16);
           ctx.fillStyle = '#ffffff'; ctx.fillRect(-50, -34, 100, 16); ctx.fillRect(-50, 18, 100, 16);
           ctx.fillStyle = '#1e3a8a'; ctx.fillRect(-50, -18, 100, 36);
       } else if (flag.id === 'vn') { // Vietnam
           ctx.fillStyle = '#ef4444'; ctx.fillRect(-50, -50, 100, 100);
           ctx.fillStyle = '#eab308'; ctx.beginPath(); ctx.arc(0, 0, 15, 0, Math.PI*2); ctx.fill(); 
       } else if (flag.id === 'id' || flag.id === 'sg') { // Indonesia / Singapore
           ctx.fillStyle = '#ef4444'; ctx.fillRect(-50, -50, 100, 50);
           ctx.fillStyle = '#ffffff'; ctx.fillRect(-50, 0, 100, 50);
           if(flag.id === 'sg') {
              ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(-25, -25, 10, 0, Math.PI*2); ctx.fill();
              ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(-22, -25, 8, 0, Math.PI*2); ctx.fill();
           }
       } else if (flag.id === 'my') { // Malaysia
           ctx.fillStyle = '#ffffff'; ctx.fillRect(-50, -50, 100, 100);
           ctx.fillStyle = '#ef4444'; for(let i=0; i<7; i++) ctx.fillRect(-50, -50 + i*14, 100, 7);
           ctx.fillStyle = '#1e3a8a'; ctx.fillRect(-50, -50, 50, 40);
           ctx.fillStyle = '#eab308'; ctx.beginPath(); ctx.arc(-25, -30, 10, 0, Math.PI*2); ctx.fill();
       } else if (flag.id === 'ph') { // Philippines
           ctx.fillStyle = '#1e3a8a'; ctx.fillRect(-50, -50, 100, 50);
           ctx.fillStyle = '#ef4444'; ctx.fillRect(-50, 0, 100, 50);
           ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.moveTo(-50, -50); ctx.lineTo(0, 0); ctx.lineTo(-50, 50); ctx.fill();
           ctx.fillStyle = '#eab308'; ctx.beginPath(); ctx.arc(-35, 0, 5, 0, Math.PI*2); ctx.fill();
       } else if (flag.id === 'bd') { // Bangladesh
           ctx.fillStyle = '#006a4e'; ctx.fillRect(-50, -50, 100, 100);
           ctx.fillStyle = '#f42a41'; ctx.beginPath(); ctx.arc(-10, 0, 18, 0, Math.PI*2); ctx.fill();
       } else if (flag.id === 'lk') { // Sri Lanka
           ctx.fillStyle = '#8d153a'; ctx.fillRect(-50, -50, 100, 100);
           ctx.fillStyle = '#fecb00'; ctx.lineWidth = 2; ctx.strokeRect(-40, -40, 80, 80);
           ctx.fillStyle = '#006a4e'; ctx.fillRect(-40, -40, 15, 80);
           ctx.fillStyle = '#eb7400'; ctx.fillRect(-25, -40, 15, 80);
       } else if (flag.id === 'np') { // Nepal
           ctx.fillStyle = '#fff'; ctx.fillRect(-50, -50, 100, 100);
           ctx.fillStyle = '#dc143c'; ctx.beginPath(); ctx.moveTo(-30, -50); ctx.lineTo(30, -10); ctx.lineTo(-30, -10); ctx.fill();
           ctx.beginPath(); ctx.moveTo(-30, -10); ctx.lineTo(30, 40); ctx.lineTo(-30, 40); ctx.fill();
           ctx.strokeStyle = '#003893'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(-30, -50); ctx.lineTo(30, -10); ctx.lineTo(-30, -10); ctx.lineTo(30, 40); ctx.lineTo(-30, 40); ctx.lineTo(-30, -50); ctx.stroke();
       } else if (flag.id === 'tw') { // Taiwan
           ctx.fillStyle = '#fe0000'; ctx.fillRect(-50, -50, 100, 100);
           ctx.fillStyle = '#000095'; ctx.fillRect(-50, -50, 50, 50);
           ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(-25, -25, 12, 0, Math.PI*2); ctx.fill();
       } else if (flag.id === 'hk') { // Hong Kong
           ctx.fillStyle = '#de2910'; ctx.fillRect(-50, -50, 100, 100);
           ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(0, 0, 15, 0, Math.PI*2); ctx.fill(); 
       } else if (flag.id === 'kw') { // Kuwait
           ctx.fillStyle = '#ffffff'; ctx.fillRect(-50, -50, 100, 100);
           ctx.fillStyle = '#14903b'; ctx.fillRect(-50, -50, 100, 33);
           ctx.fillStyle = '#be0027'; ctx.fillRect(-50, 17, 100, 33);
           ctx.fillStyle = '#000000'; ctx.beginPath(); ctx.moveTo(-50, -50); ctx.lineTo(-20, -17); ctx.lineTo(-20, 17); ctx.lineTo(-50, 50); ctx.fill();
       } else if (flag.id === 'jo') { // Jordan
           ctx.fillStyle = '#ffffff'; ctx.fillRect(-50, -50, 100, 100);
           ctx.fillStyle = '#000000'; ctx.fillRect(-50, -50, 100, 33);
           ctx.fillStyle = '#007a3d'; ctx.fillRect(-50, 17, 100, 33);
           ctx.fillStyle = '#ce1126'; ctx.beginPath(); ctx.moveTo(-50, -50); ctx.lineTo(0, 0); ctx.lineTo(-50, 50); ctx.fill();
       } else if (flag.id === 'lb') { // Lebanon
           ctx.fillStyle = '#ffffff'; ctx.fillRect(-50, -50, 100, 100);
           ctx.fillStyle = '#ed1c24'; ctx.fillRect(-50, -50, 100, 25); ctx.fillRect(-50, 25, 100, 25);
           ctx.fillStyle = '#14903b'; ctx.beginPath(); ctx.moveTo(0, -15); ctx.lineTo(15, 15); ctx.lineTo(-15, 15); ctx.fill(); // Cedar
       } else if (flag.id === 'iq') { // Iraq
           ctx.fillStyle = '#ffffff'; ctx.fillRect(-50, -50, 100, 100);
           ctx.fillStyle = '#ce1126'; ctx.fillRect(-50, -50, 100, 33);
           ctx.fillStyle = '#000000'; ctx.fillRect(-50, 17, 100, 33);
           ctx.fillStyle = '#14903b'; ctx.font = 'bold 8px sans-serif'; ctx.fillText('الله اكبر', -10, 3);
       } else if (flag.id === 'kz') { // Kazakhstan
           ctx.fillStyle = '#00aec7'; ctx.fillRect(-50, -50, 100, 100);
           ctx.fillStyle = '#fec50c'; ctx.beginPath(); ctx.arc(0, 0, 15, 0, Math.PI*2); ctx.fill();
       } else if (flag.id === 'jp') { 
           ctx.fillStyle = '#ffffff'; ctx.fillRect(-50, -50, 100, 100);
           ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(0, 0, 16, 0, Math.PI*2); ctx.fill();
       } else if (flag.id === 'br') { 
           ctx.fillStyle = '#16a34a'; ctx.fillRect(-50, -50, 100, 100);
           ctx.fillStyle = '#eab308'; ctx.beginPath(); ctx.moveTo(0, -35); ctx.lineTo(40, 0); ctx.lineTo(0, 35); ctx.lineTo(-40, 0); ctx.fill();
           ctx.fillStyle = '#1e3a8a'; ctx.beginPath(); ctx.arc(0, 0, 12, 0, Math.PI*2); ctx.fill();
       } else if (flag.id === 'kr') { 
           ctx.fillStyle = '#ffffff'; ctx.fillRect(-50, -50, 100, 100);
           ctx.save(); ctx.rotate(Math.PI / 4);
           ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(0, 0, 12, 0, Math.PI); ctx.fill();
           ctx.fillStyle = '#3b82f6'; ctx.beginPath(); ctx.arc(0, 0, 12, Math.PI, Math.PI*2); ctx.fill();
           ctx.restore();
       } else if (flag.id === 'gb' || flag.id === 'au') { 
           ctx.fillStyle = '#1e3a8a'; ctx.fillRect(-50, -50, 100, 100);
           ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 10;
           ctx.beginPath(); ctx.moveTo(-50, -50); ctx.lineTo(50, 50); ctx.stroke();
           ctx.beginPath(); ctx.moveTo(50, -50); ctx.lineTo(-50, 50); ctx.stroke();
           ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 4;
           ctx.beginPath(); ctx.moveTo(-50, -50); ctx.lineTo(50, 50); ctx.stroke();
           ctx.beginPath(); ctx.moveTo(50, -50); ctx.lineTo(-50, 50); ctx.stroke();
           ctx.fillStyle = '#ffffff'; ctx.fillRect(-10, -50, 20, 100); ctx.fillRect(-50, -10, 100, 20);
           ctx.fillStyle = '#ef4444'; ctx.fillRect(-6, -50, 12, 100); ctx.fillRect(-50, -6, 100, 12);
           if(flag.id === 'au') {
              ctx.fillStyle = 'white'; 
              ctx.beginPath(); ctx.arc(20, 20, 3, 0, Math.PI*2); ctx.fill();
              ctx.beginPath(); ctx.arc(30, -10, 2, 0, Math.PI*2); ctx.fill();
           }
       } else if (flag.id === 'us') { 
           ctx.fillStyle = '#ffffff'; ctx.fillRect(-50, -50, 100, 100);
           ctx.fillStyle = '#ef4444';
           for(let i=0; i<7; i++) ctx.fillRect(-50, -50 + i*15, 100, 7);
           ctx.fillStyle = '#1e3a8a'; ctx.fillRect(-50, -50, 50, 40); 
       } else if (flag.id === 'ca') { 
           ctx.fillStyle = '#ef4444'; ctx.fillRect(-50, -50, 100, 100);
           ctx.fillStyle = '#ffffff'; ctx.fillRect(-25, -50, 50, 100);
           ctx.fillStyle = '#ef4444'; 
           ctx.beginPath(); ctx.moveTo(0, -15); ctx.lineTo(5, -5); ctx.lineTo(12, -8); ctx.lineTo(8, 2); ctx.lineTo(12, 10);
           ctx.lineTo(2, 12); ctx.lineTo(0, 20); ctx.lineTo(-2, 12);
           ctx.lineTo(-12, 10); ctx.lineTo(-8, 2); ctx.lineTo(-12, -8); ctx.lineTo(-5, -5); ctx.fill();
       } else if (flag.id === 'tr') { 
           ctx.fillStyle = '#ef4444'; ctx.fillRect(-50, -50, 100, 100);
           ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(-5, 0, 12, 0, Math.PI*2); ctx.fill();
           ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(-2, 0, 10, 0, Math.PI*2); ctx.fill(); 
           ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(8, 0, 4, 0, Math.PI*2); ctx.fill(); 
       } else if (flag.id === 'cn') { 
           ctx.fillStyle = '#ef4444'; ctx.fillRect(-50, -50, 100, 100);
           ctx.fillStyle = '#eab308'; ctx.beginPath(); ctx.arc(-30, -30, 8, 0, Math.PI*2); ctx.fill();
       } else if (flag.id === 'ir') { 
           ctx.fillStyle = '#22c55e'; ctx.fillRect(-50, -50, 100, 33);
           ctx.fillStyle = '#ffffff'; ctx.fillRect(-50, -17, 100, 34);
           ctx.fillStyle = '#ef4444'; ctx.fillRect(-50, 17, 100, 33);
           ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2;
           ctx.beginPath(); ctx.moveTo(0, -8); ctx.lineTo(0, 8); ctx.stroke();
           ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI*2); ctx.stroke();
       } else if (flag.id === 'in') { 
           ctx.fillStyle = '#f97316'; ctx.fillRect(-50, -50, 100, 33);
           ctx.fillStyle = '#ffffff'; ctx.fillRect(-50, -17, 100, 34);
           ctx.fillStyle = '#16a34a'; ctx.fillRect(-50, 17, 100, 33);
           ctx.strokeStyle = '#1e3a8a'; ctx.lineWidth = 1;
           ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI*2); ctx.stroke();
       } else if (flag.id === 'ar') { 
           ctx.fillStyle = '#60a5fa'; ctx.fillRect(-50, -50, 100, 33);
           ctx.fillStyle = '#ffffff'; ctx.fillRect(-50, -17, 100, 34);
           ctx.fillStyle = '#60a5fa'; ctx.fillRect(-50, 17, 100, 33);
           ctx.fillStyle = '#eab308'; ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI*2); ctx.fill();
       } else if (flag.id === 'mx') { 
           ctx.fillStyle = '#16a34a'; ctx.fillRect(-50, -50, 33, 100);
           ctx.fillStyle = '#ffffff'; ctx.fillRect(-17, -50, 34, 100);
           ctx.fillStyle = '#ef4444'; ctx.fillRect(17, -50, 33, 100);
           ctx.fillStyle = '#78350f'; ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI*2); ctx.fill();
       } else if (flag.id === 'es') { 
           ctx.fillStyle = '#ef4444'; ctx.fillRect(-50, -50, 100, 25);
           ctx.fillStyle = '#eab308'; ctx.fillRect(-50, -25, 100, 50);
           ctx.fillStyle = '#ef4444'; ctx.fillRect(-50, 25, 100, 25);
       } else if (flag.pattern === 'Vertical') {
         ctx.fillStyle = flag.colors[0]; ctx.fillRect(-50, -50, 33, 100);
         ctx.fillStyle = flag.colors[1]; ctx.fillRect(-17, -50, 34, 100);
         ctx.fillStyle = flag.colors[2]; ctx.fillRect(17, -50, 33, 100);
       } else { // Horizontal (Default)
         ctx.fillStyle = flag.colors[0]; ctx.fillRect(-50, -50, 100, 33);
         ctx.fillStyle = flag.colors[1]; ctx.fillRect(-50, -17, 100, 34);
         ctx.fillStyle = flag.colors[2]; ctx.fillRect(17, -50, 100, 33);
       }
       ctx.restore();
    } else {
       // Default Background
       ctx.fillStyle = '#1e293b';
       ctx.beginPath(); ctx.arc(0, 0, 48, 0, Math.PI * 2); ctx.fill();
    }

    // 2. DRAW AVATAR BASE (Head/Body)
    const { skin, hair, acc } = avatar.colors;
    const isFemale = avatar.gender === 'Female';
    
    // Shoulders
    ctx.fillStyle = acc; 
    ctx.beginPath(); 
    ctx.ellipse(0, 50, 40, 30, 0, Math.PI, 0); 
    ctx.fill();

    // Neck
    ctx.fillStyle = skin;
    ctx.fillRect(-10, 10, 20, 20);
    ctx.fillStyle = 'rgba(0,0,0,0.1)'; ctx.fillRect(-10, 10, 20, 5);

    // Head
    ctx.fillStyle = skin;
    ctx.beginPath(); ctx.arc(0, -5, 23, 0, Math.PI * 2); ctx.fill();

    // 3. EYES
    ctx.fillStyle = '#000';
    if (avatar.job === 'Robot' || avatar.job === 'CyborgX') ctx.fillStyle = '#0ff';
    if (avatar.job === 'Zombie') ctx.fillStyle = '#f00';
    const eyeY = -5;
    const eyeSize = isFemale ? 3 : 2.5;

    // --- ACCESSORIES & EYES OVERRIDE ---
    if (avatar.job === 'Agent') {
        // Sunglasses
        ctx.fillStyle = '#000';
        ctx.beginPath(); ctx.roundRect(-16, eyeY-3, 14, 8, 2); ctx.fill();
        ctx.beginPath(); ctx.roundRect(2, eyeY-3, 14, 8, 2); ctx.fill();
        ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(0, eyeY); ctx.lineTo(2, eyeY); ctx.stroke();
    } else if (avatar.job === 'CyborgX') {
        // Red eye
        ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(-8, eyeY, 4, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#0ff'; ctx.beginPath(); ctx.arc(8, eyeY, 4, 0, Math.PI*2); ctx.fill();
    } else if (avatar.job === 'Miner') {
        ctx.fillStyle = '#000'; // Soot on face
        ctx.globalAlpha = 0.3; ctx.beginPath(); ctx.arc(-10, 5, 5, 0, Math.PI*2); ctx.fill();
        ctx.globalAlpha = 1.0;
        ctx.beginPath(); ctx.arc(-8, eyeY, eyeSize, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(8, eyeY, eyeSize, 0, Math.PI*2); ctx.fill();
    } else {
       // Standard Eyes
       ctx.beginPath(); ctx.arc(-8, eyeY, eyeSize, 0, Math.PI*2); ctx.fill();
       ctx.beginPath(); ctx.arc(8, eyeY, eyeSize, 0, Math.PI*2); ctx.fill();
    }

    // FEMALE FEATURES
    if (isFemale) {
       ctx.strokeStyle = '#000'; ctx.lineWidth = 0.8;
       ctx.beginPath(); ctx.moveTo(-11, eyeY - 1); ctx.lineTo(-14, eyeY - 4); ctx.stroke();
       ctx.beginPath(); ctx.moveTo(11, eyeY - 1); ctx.lineTo(14, eyeY - 4); ctx.stroke();
       ctx.fillStyle = 'rgba(244, 114, 182, 0.4)'; ctx.beginPath(); ctx.arc(-12, 5, 4, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(12, 5, 4, 0, Math.PI*2); ctx.fill();
       ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.ellipse(0, 10, 5, 3, 0, 0, Math.PI*2); ctx.fill();
       ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(2, 9, 1, 0, Math.PI*2); ctx.fill();
    } else if (avatar.job === 'Viking') {
        // Beard
        ctx.fillStyle = hair; ctx.beginPath(); ctx.moveTo(-20, 0); ctx.quadraticCurveTo(0, 40, 20, 0); ctx.fill();
    } else if (avatar.job === 'Biker' || avatar.job === 'Wizard') {
        // Beard
        ctx.fillStyle = hair; ctx.beginPath(); ctx.moveTo(-15, 10); ctx.quadraticCurveTo(0, 40, 15, 10); ctx.fill();
    } else {
       ctx.fillStyle = 'rgba(0,0,0,0.1)'; ctx.beginPath(); ctx.arc(0, 2, 2, 0, Math.PI*2); ctx.fill();
       ctx.strokeStyle = '#000'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(0, 8, 4, 0, Math.PI); ctx.stroke();
    }

    // BROWS
    ctx.strokeStyle = hair; 
    ctx.lineWidth = isFemale ? 1 : 2.5;
    const browY = isFemale ? -13 : -11;
    if (isFemale) {
       ctx.beginPath(); ctx.arc(-8, browY + 4, 6, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
       ctx.beginPath(); ctx.arc(8, browY + 4, 6, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
    } else {
       ctx.beginPath(); ctx.moveTo(-13, browY); ctx.lineTo(-3, browY); ctx.stroke();
       ctx.beginPath(); ctx.moveTo(3, browY); ctx.lineTo(13, browY); ctx.stroke();
    }

    // 4. HEADGEAR / HAIR (NEW JOBS)
    if (avatar.job === 'Viking') {
        // Helmet with Horns
        ctx.fillStyle = '#9ca3af'; ctx.beginPath(); ctx.arc(0, -10, 25, Math.PI, 0); ctx.fill();
        ctx.fillRect(-25, -10, 50, 5);
        // Horns
        ctx.fillStyle = '#fde047'; 
        ctx.beginPath(); ctx.moveTo(-25, -10); ctx.quadraticCurveTo(-45, -20, -35, -45); ctx.lineTo(-25, -15); ctx.fill();
        ctx.beginPath(); ctx.moveTo(25, -10); ctx.quadraticCurveTo(45, -20, 35, -45); ctx.lineTo(25, -15); ctx.fill();
    } else if (avatar.job === 'Samurai') {
        // Top knot
        ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(0, -25, 8, 0, Math.PI*2); ctx.fill();
        ctx.fillRect(-22, -15, 44, 10); // Hairline
    } else if (avatar.job === 'Wizard') {
        // Pointy Hat
        ctx.fillStyle = '#4c1d95'; ctx.beginPath(); ctx.moveTo(-30, -15); ctx.lineTo(0, -60); ctx.lineTo(30, -15); ctx.fill();
        ctx.fillStyle = '#6d28d9'; ctx.beginPath(); ctx.ellipse(0, -15, 30, 8, 0, 0, Math.PI*2); ctx.fill();
    } else if (avatar.job === 'Miner') {
        // Helmet with light
        ctx.fillStyle = '#f59e0b'; ctx.beginPath(); ctx.arc(0, -10, 25, Math.PI, 0); ctx.fill();
        ctx.fillRect(-26, -10, 52, 4);
        // Light
        ctx.fillStyle = '#ffff00'; ctx.beginPath(); ctx.arc(0, -20, 6, 0, Math.PI*2); ctx.fill();
        ctx.shadowColor = '#ffff00'; ctx.shadowBlur = 10; ctx.fill(); ctx.shadowBlur=0;
    } else if (avatar.job === 'Punk') {
        // Mohawk
        ctx.fillStyle = '#ec4899'; 
        ctx.beginPath(); ctx.moveTo(0, -40); ctx.lineTo(10, -5); ctx.lineTo(-10, -5); ctx.fill();
        ctx.beginPath(); ctx.moveTo(0, -35); ctx.lineTo(8, 10); ctx.lineTo(-8, 10); ctx.fill();
    } else if (avatar.job === 'Rapper') {
        // Cap backward
        ctx.fillStyle = '#3b82f6'; ctx.beginPath(); ctx.arc(0, -12, 25, Math.PI, 0); ctx.fill();
        ctx.fillRect(-26, -12, 52, 6);
        ctx.beginPath(); ctx.moveTo(-25, -12); ctx.lineTo(-35, -5); ctx.lineTo(-25, -5); ctx.fill();
        // Chain
        ctx.strokeStyle = '#facc15'; ctx.lineWidth=3; ctx.beginPath(); ctx.arc(0, 30, 15, 0, Math.PI); ctx.stroke();
    } else if (avatar.job === 'Hippie') {
        // Headband
        ctx.fillStyle = '#a855f7'; ctx.fillRect(-24, -15, 48, 8);
        ctx.fillStyle = hair; ctx.beginPath(); ctx.arc(0, -10, 25, Math.PI, 0); ctx.fill();
        // Peace glasses
        ctx.strokeStyle='#f0f'; ctx.lineWidth=1; ctx.beginPath(); ctx.arc(-8, eyeY, 6, 0, Math.PI*2); ctx.stroke();
    } else if (avatar.job === 'Biker') {
        // Bandana
        ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(0, -10, 25, Math.PI, 0); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.font='8px sans-serif'; ctx.fillText('RIDE', -8, -15);
    } else if (avatar.job === 'CyborgX') {
        // Metal Plate
        ctx.fillStyle = '#64748b'; ctx.beginPath(); ctx.arc(0, -10, 25, Math.PI, 0); ctx.fill();
        ctx.strokeStyle = '#0ff'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-10, -25); ctx.lineTo(-5, -5); ctx.stroke();
    } else if (avatar.job === 'Chef') {
       ctx.fillStyle = '#fff'; ctx.fillRect(-15, -35, 30, 25);
       ctx.beginPath(); ctx.arc(0, -35, 20, Math.PI, 0); ctx.fill();
       ctx.strokeStyle = '#ddd'; ctx.lineWidth=1; ctx.strokeRect(-15,-35,30,25);
    } else if (avatar.job === 'Firefighter') {
       ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(0, -8, 26, Math.PI, 0); ctx.fill();
       ctx.fillStyle = '#facc15'; ctx.fillRect(-26, -8, 52, 6);
       ctx.fillStyle = '#ef4444'; ctx.fillRect(-20, -35, 40, 10);
    } else if (avatar.job === 'Police') {
       ctx.fillStyle = '#1e3a8a'; ctx.beginPath(); ctx.arc(0, -10, 25, Math.PI, 0); ctx.fill();
       ctx.fillStyle = '#000'; ctx.fillRect(-26, -10, 52, 6); // Brim
       ctx.fillStyle = '#facc15'; ctx.beginPath(); ctx.arc(0, -15, 4, 0, Math.PI*2); ctx.fill(); // Badge
    } else if (avatar.job === 'Builder') {
       // Hard Hat
       ctx.fillStyle = '#f97316'; ctx.beginPath(); ctx.arc(0, -10, 26, Math.PI, 0); ctx.fill();
       ctx.fillRect(-28, -10, 56, 4);
    } else if (avatar.job === 'Nurse') {
       // Nurse Cap
       ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(-20, -10); ctx.lineTo(-15, -30); ctx.lineTo(15, -30); ctx.lineTo(20, -10); ctx.fill();
       ctx.fillStyle = '#ef4444'; ctx.fillRect(-4, -22, 8, 2); ctx.fillRect(-1, -25, 2, 8);
    } else if (avatar.job === 'Magician') {
       // Top Hat
       ctx.fillStyle = '#000'; ctx.fillRect(-18, -40, 36, 30); ctx.fillRect(-26, -10, 52, 4);
       ctx.fillStyle = '#ef4444'; ctx.fillRect(-18, -14, 36, 4);
    } else if (avatar.job === 'Cowboy') {
       // Cowboy Hat
       ctx.fillStyle = '#78350f'; 
       ctx.beginPath(); ctx.ellipse(0, -12, 35, 8, 0, Math.PI, 0); ctx.fill(); // Brim
       ctx.beginPath(); ctx.arc(0, -15, 18, Math.PI, 0); ctx.fill(); // Top
    } else if (avatar.job === 'Santa') {
       // Santa Hat
       ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.moveTo(-24, -10); ctx.lineTo(0, -45); ctx.lineTo(24, -10); ctx.fill();
       ctx.fillStyle = '#fff'; ctx.fillRect(-26, -10, 52, 8); ctx.beginPath(); ctx.arc(0, -45, 6, 0, Math.PI*2); ctx.fill();
       // Beard
       ctx.beginPath(); ctx.arc(0, 5, 22, 0, Math.PI); ctx.fill();
    } else if (avatar.job === 'Clown') {
       // Clown Hair
       ctx.fillStyle = '#22c55e'; 
       ctx.beginPath(); ctx.arc(-22, -5, 10, 0, Math.PI*2); ctx.fill();
       ctx.beginPath(); ctx.arc(22, -5, 10, 0, Math.PI*2); ctx.fill();
       ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(0, -12, 10, 5, 0, 0, Math.PI*2); ctx.fill(); // Mini Hat
    } else if (avatar.job === 'Farmer') {
       ctx.fillStyle = '#fde047'; ctx.beginPath(); ctx.ellipse(0, -12, 35, 10, 0, 0, Math.PI*2); ctx.fill();
       ctx.fillStyle = '#facc15'; ctx.beginPath(); ctx.arc(0, -15, 20, Math.PI, 0); ctx.fill();
    } else if (avatar.job === 'Musician') {
       // Headphones
       ctx.fillStyle = acc; ctx.fillRect(-32, -10, 8, 20); ctx.fillRect(24, -10, 8, 20);
       ctx.strokeStyle = acc; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(0, -10, 28, Math.PI, 0); ctx.stroke();
       ctx.fillStyle = hair; ctx.beginPath(); ctx.arc(0, -10, 25, Math.PI, 0); ctx.fill();
    } else if (avatar.job === 'Artist') {
       // Beret
       ctx.fillStyle = acc; ctx.beginPath(); ctx.ellipse(10, -15, 25, 10, -0.2, 0, Math.PI*2); ctx.fill();
       ctx.fillStyle = hair; ctx.beginPath(); ctx.moveTo(0,-10); ctx.lineTo(5,5); ctx.lineTo(-5,5); ctx.fill(); // Goatee/Soul patch
    } else if (avatar.job === 'Athlete') {
       // Headband
       ctx.fillStyle = acc; ctx.fillRect(-24, -18, 48, 6);
       ctx.fillStyle = hair; ctx.beginPath(); ctx.arc(0, -10, 25, Math.PI, 0); ctx.fill();
    } else if (avatar.job === 'Detective') {
       // Fedora
       ctx.fillStyle = acc; ctx.beginPath(); ctx.ellipse(0, -12, 35, 6, 0, 0, Math.PI*2); ctx.fill();
       ctx.fillRect(-20, -30, 40, 18);
    } else if (avatar.job === 'Pirate') {
       // Bandana
       ctx.fillStyle = acc; ctx.beginPath(); ctx.arc(0, -10, 25, Math.PI, 0); ctx.fill();
       ctx.fillRect(-26, -14, 52, 6);
       ctx.beginPath(); ctx.moveTo(25, -10); ctx.lineTo(35, -5); ctx.lineTo(35, -15); ctx.fill(); // Knot
    } else if (avatar.job === 'Doctor') {
       ctx.fillStyle = hair; ctx.beginPath(); ctx.arc(0, -10, 25, Math.PI, 0); ctx.fill();
       ctx.fillStyle = '#ccc'; ctx.beginPath(); ctx.arc(0, -20, 8, 0, Math.PI*2); ctx.fill();
       ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(-2, -22, 3, 0, Math.PI*2); ctx.fill();
       ctx.strokeStyle = '#999'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, -20, 8, 0, Math.PI*2); ctx.stroke();
    } else if (avatar.job === 'Pilot') {
       ctx.fillStyle = acc; ctx.beginPath(); ctx.arc(0, -8, 26, Math.PI, 0); ctx.fill();
       ctx.fillRect(-26, -8, 52, 10);
       ctx.fillStyle = '#333'; ctx.fillRect(-22, -18, 44, 12);
       ctx.fillStyle = '#0ea5e9'; ctx.fillRect(-20, -16, 18, 8); ctx.fillRect(2, -16, 18, 8);
    } else if (avatar.job === 'Ninja') {
       ctx.fillStyle = acc; ctx.beginPath(); ctx.arc(0, -5, 24, 0, Math.PI*2); ctx.fill();
       ctx.fillStyle = skin; ctx.fillRect(-16, -11, 32, 12);
    } else if (avatar.job === 'Royal') {
       ctx.fillStyle = hair; ctx.beginPath(); ctx.arc(0, -10, 25, Math.PI, 0); ctx.fill();
       ctx.fillStyle = '#eab308';
       ctx.beginPath(); ctx.moveTo(-22, -20); ctx.lineTo(-12, -45); ctx.lineTo(0, -20); ctx.lineTo(12, -45); ctx.lineTo(22, -20); ctx.lineTo(22, -8); ctx.lineTo(-22, -8); ctx.fill();
    } else if (avatar.job === 'Astronaut') {
       ctx.fillStyle = 'rgba(255,255,255,0.2)';
       ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
       ctx.beginPath(); ctx.arc(0, -5, 30, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    } else if (avatar.job === 'Robot') {
       ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, -25); ctx.lineTo(0, -40); ctx.stroke();
       ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(0, -40, 4, 0, Math.PI*2); ctx.fill();
    } else if (avatar.job === 'Vampire') {
       // Widows peak
       ctx.fillStyle = '#000'; 
       ctx.beginPath(); ctx.moveTo(-25, -10); ctx.lineTo(0, -5); ctx.lineTo(25, -10); ctx.lineTo(25, -25); ctx.lineTo(-25, -25); ctx.fill();
    } else {
       ctx.fillStyle = hair;
       if (isFemale) {
          ctx.beginPath(); 
          ctx.moveTo(-26, -10);
          ctx.bezierCurveTo(-35, -40, 35, -40, 26, -10);
          ctx.lineTo(30, 35);
          ctx.bezierCurveTo(10, 45, -10, 45, -30, 35); 
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = skin; ctx.beginPath(); ctx.arc(0, 0, 20, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = 'rgba(255,255,255,0.2)';
          ctx.beginPath(); ctx.ellipse(15, -20, 8, 4, -0.5, 0, Math.PI*2); ctx.fill();
       } else {
          ctx.beginPath(); ctx.arc(0, -10, 25, Math.PI, 0); ctx.fill();
          ctx.fillRect(-24, -10, 5, 15); ctx.fillRect(19, -10, 5, 15);
       }
    }

    ctx.restore();
  }, [avatarId, flagId, size]);

  return <canvas ref={canvasRef} width={size} height={size} className="rounded-full shadow-lg border-2 border-white/20 bg-transparent" />;
};

export default AvatarPreview;
