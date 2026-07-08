
// ... imports ... (Keep existing imports)
import React, { useRef, useEffect, useCallback } from 'react';
import { GameStatus, GameConfig, Bird, Pipe, Particle, PlayerProfile, Projectile, GameEffects, ObstacleType, FarmObject, Season, TimeOfDay } from '../types';
import { LOGICAL_WIDTH, LOGICAL_HEIGHT } from '../constants';

interface GameCanvasProps {
  status: GameStatus;
  config: GameConfig;
  playerProfile: PlayerProfile;
  gameEffects: GameEffects;
  onGameOver: (score: number) => void;
  onScoreUpdate: (score: number) => void;
  onShieldBreak: () => void;
  triggerJump: number;
  width: number;
  height: number;
  sessionId: number; // New prop to track game sessions
}

const GameCanvas: React.FC<GameCanvasProps> = ({ 
  status, config, playerProfile, gameEffects, 
  onGameOver, onScoreUpdate, onShieldBreak, 
  triggerJump, width, height, sessionId
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const frameCountRef = useRef<number>(0);
  
  // DYNAMIC ENVIRONMENT STATE
  const currentSeasonRef = useRef<Season>(config.season);
  const currentTimeRef = useRef<TimeOfDay>(config.timeOfDay);

  const basePower = (1 + (playerProfile.upgrades.power - 1) * 0.03) * 1.1;
  const jumpMultiplier = gameEffects.hasNitro ? basePower * 1.3 : basePower;
  
  const gravityMultiplier = 1 - (playerProfile.upgrades.aerodynamics - 1) * 0.02;
  const rotationMultiplier = 1 + (playerProfile.upgrades.agility - 1) * 0.1;

  // INITIAL POSITION SHIFTED: 168px (Approx 3.5x bird diameter) from left
  const birdRef = useRef<Bird>({ x: 168, y: LOGICAL_HEIGHT / 2, velocity: 0, radius: 24, rotation: 0, wingFrame: 0 });
  const pipesRef = useRef<Pipe[]>([]);
  const projectilesRef = useRef<Projectile[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const farmObjectsRef = useRef<FarmObject[]>([]);
  const scoreRef = useRef<number>(0);
  const prevStatusRef = useRef<GameStatus>(GameStatus.IDLE);
  
  const lastJumpTimeRef = useRef<number>(0);
  const consecutiveJumpsRef = useRef<number>(0);
  
  const shieldActiveRef = useRef<boolean>(gameEffects.hasShield);

  useEffect(() => {
    shieldActiveRef.current = gameEffects.hasShield;
  }, [gameEffects.hasShield]);

  const cloudsRef = useRef<Particle[]>([]);
  
  useEffect(() => {
    const clouds: Particle[] = [];
    for(let i=0; i<8; i++) {
      clouds.push({
        x: Math.random() * LOGICAL_WIDTH * 2, 
        y: Math.random() * (LOGICAL_HEIGHT * 0.4),
        vx: 0.2 + Math.random() * 0.3,
        vy: 0,
        size: 30 + Math.random() * 40,
        life: 1000,
        type: 'cloud',
        color: 'rgba(255,255,255,0.4)'
      });
    }
    cloudsRef.current = clouds;

    const farmObjs: FarmObject[] = [];
    for(let i=0; i<5; i++) {
       farmObjs.push({
          x: i * 300 + Math.random() * 100,
          y: LOGICAL_HEIGHT - 60,
          type: Math.random() > 0.6 ? 'house' : (Math.random() > 0.5 ? 'cow' : 'sheep'),
          variant: Math.floor(Math.random() * 3),
          speed: 0.5 
       });
    }
    farmObjectsRef.current = farmObjs;

  }, []);

  const resetGame = useCallback(() => {
    birdRef.current = { x: 168, y: LOGICAL_HEIGHT / 2, velocity: 0, radius: 24, rotation: 0, wingFrame: 0 };
    pipesRef.current = [];
    projectilesRef.current = [];
    particlesRef.current = [];
    scoreRef.current = 0;
    currentSeasonRef.current = 'Spring';
    currentTimeRef.current = 'Day';
    lastJumpTimeRef.current = 0;
    consecutiveJumpsRef.current = 0;
    
    farmObjectsRef.current = farmObjectsRef.current.map((obj, i) => ({
        ...obj,
        x: i * 300 + Math.random() * 100
    }));

  }, []);

  useEffect(() => {
    resetGame();
  }, [sessionId]);

  const jump = useCallback(() => {
    if (status === GameStatus.PLAYING) {
      const now = Date.now();
      if (now - lastJumpTimeRef.current < 300) {
         consecutiveJumpsRef.current++;
      } else {
         consecutiveJumpsRef.current = 1;
      }
      lastJumpTimeRef.current = now;

      let tapMultiplier = 0.85; 
      if (consecutiveJumpsRef.current > 1) {
         const bonus = Math.min((consecutiveJumpsRef.current - 1) * 0.1, 0.5);
         tapMultiplier = 1.0 + bonus;
      }

      birdRef.current.velocity = config.jumpStrength * jumpMultiplier * tapMultiplier;
      
      if (gameEffects.hasNitro) {
        for(let i=0; i<5; i++) {
            particlesRef.current.push({
                x: birdRef.current.x - 20,
                y: birdRef.current.y,
                vx: -3 - Math.random() * 3,
                vy: (Math.random() - 0.5) * 4,
                size: 5 + Math.random() * 5,
                life: 30,
                type: 'fire',
                color: '#f97316'
            });
        }
      }
    }
  }, [status, config.jumpStrength, jumpMultiplier, gameEffects.hasNitro]);

  useEffect(() => {
    if (triggerJump > 0) {
      jump();
    }
  }, [triggerJump, jump]);

  useEffect(() => {
    if (status === GameStatus.PLAYING && prevStatusRef.current === GameStatus.GAME_OVER) {
       birdRef.current.y = LOGICAL_HEIGHT / 2; 
       birdRef.current.velocity = 0;
       birdRef.current.rotation = 0;
       pipesRef.current = pipesRef.current.filter(p => p.x > 300);
       projectilesRef.current = [];
    }
    prevStatusRef.current = status;
  }, [status]);

  const handleCollision = () => {
    if (shieldActiveRef.current) {
        shieldActiveRef.current = false;
        onShieldBreak();
        for(let i=0; i<15; i++) {
            particlesRef.current.push({
                x: birdRef.current.x,
                y: birdRef.current.y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                size: 3 + Math.random() * 3,
                life: 40,
                type: 'shield_break',
                color: '#22d3ee'
            });
        }
        birdRef.current.velocity = -5;
    } else {
        onGameOver(scoreRef.current);
    }
  };

  const updateEnvironment = (viewWidth: number) => {
    const stage = Math.floor(scoreRef.current / 11);
    currentTimeRef.current = (stage % 2 === 0) ? 'Day' : 'Night';
    const seasons: Season[] = ['Spring', 'Summer', 'Autumn', 'Winter'];
    currentSeasonRef.current = seasons[stage % 4];

    cloudsRef.current.forEach(c => {
       c.x -= c.vx;
       if (c.x < -c.size) c.x = viewWidth + c.size; 
    });

    const particles = particlesRef.current;
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      
      if (p.type === 'leaf') p.x += Math.sin(frameCountRef.current * 0.05) * 0.5;
      if (p.type === 'fire') p.size *= 0.9;
      if (p.type === 'shield_break') p.vy += 0.2;

      if (p.y > LOGICAL_HEIGHT || p.life <= 0) particles.splice(i, 1);
    }

    const farmObjs = farmObjectsRef.current;
    farmObjs.forEach(f => {
        f.x -= f.speed;
        if (f.x < -150) {
            f.x = viewWidth + 50 + Math.random() * 200;
            f.type = Math.random() > 0.6 ? 'house' : (Math.random() > 0.5 ? 'cow' : 'sheep');
        }
    });
  };

  const updatePhysics = () => {
    const bird = birdRef.current;
    const pipes = pipesRef.current;
    const projectiles = projectilesRef.current;

    bird.velocity += config.gravity * gravityMultiplier;
    bird.y += bird.velocity;
    bird.rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, (bird.velocity * 0.1) * rotationMultiplier));
    bird.wingFrame += 0.2;

    if (bird.y + bird.radius >= LOGICAL_HEIGHT || bird.y - bird.radius <= 0) {
      handleCollision();
      return;
    }

    if (frameCountRef.current % config.pipeSpawnRate === 0) {
      const minPipeHeight = 100;
      const maxPipeHeight = LOGICAL_HEIGHT - config.gapSize - minPipeHeight - 100; 
      const randomBaseHeight = Math.floor(Math.random() * (maxPipeHeight - minPipeHeight + 1)) + minPipeHeight;
      
      // Determine Obstacle Type based on Stage
      const stage = Math.floor(scoreRef.current / 11);
      const cycleIndex = stage % 16;
      const types: ObstacleType[] = [
          'pipe', 'bird_flock', 'stone', 'fire', 
          'ice', 'electro', 'ghost', 'blade', 'portal', 'toxic',
          'laser', 'magma', 'black_hole', 'crystal', 'glitch', 'vine'
      ];
      const obsType = types[cycleIndex];

      pipes.push({
        x: LOGICAL_WIDTH, 
        baseHeight: randomBaseHeight,
        currentTopHeight: randomBaseHeight,
        passed: false,
        moveSpeed: 0.02 + Math.random() * 0.03,
        moveOffset: Math.random() * Math.PI * 2,
        type: obsType
      });
    }

    const pipeWidth = 70;
    const hitRadius = bird.radius * 0.5;

    for (let i = 0; i < pipes.length; i++) {
      const p = pipes[i];
      p.x -= config.pipeSpeed;

      if (config.volatility > 0) {
        const oscillation = Math.sin(frameCountRef.current * p.moveSpeed + p.moveOffset) * config.volatility;
        p.currentTopHeight = p.baseHeight + oscillation;
        const minH = 50;
        const maxH = LOGICAL_HEIGHT - config.gapSize - 50;
        if (p.currentTopHeight < minH) p.currentTopHeight = minH;
        if (p.currentTopHeight > maxH) p.currentTopHeight = maxH;
      } else {
        p.currentTopHeight = p.baseHeight;
      }

      if (bird.x + hitRadius > p.x && bird.x - hitRadius < p.x + pipeWidth) { 
        if (bird.y - hitRadius < p.currentTopHeight || bird.y + hitRadius > p.currentTopHeight + config.gapSize) {
          handleCollision();
          return;
        }
      }
      
      if (p.x + pipeWidth < bird.x && !p.passed) {
        p.passed = true;
        scoreRef.current += 1;
        onScoreUpdate(scoreRef.current);
      }
    }

    if (pipes.length > 0 && pipes[0].x < -100) pipes.shift();

    const spawnRate = Math.max(120, 250 - scoreRef.current * 4);
    if (scoreRef.current >= 2 && frameCountRef.current % spawnRate === 0) {
       const isFireball = Math.random() > 0.5;
       projectiles.push({
         x: LOGICAL_WIDTH + 50,
         y: isFireball ? LOGICAL_HEIGHT - 50 : Math.random() * (LOGICAL_HEIGHT - 200) + 100,
         vx: isFireball ? -(config.pipeSpeed + 2 + Math.random() * 2) : -(config.pipeSpeed * 1.5 + Math.random() * 2), 
         vy: isFireball ? -12 - Math.random() * 4 : 0, 
         radius: isFireball ? 20 : 15,
         type: isFireball ? 'fireball' : 'ball'
       });
    }

    for(let i = projectiles.length - 1; i >= 0; i--) {
       const proj = projectiles[i];
       if (proj.type === 'fireball') {
         proj.vy += 0.25; 
         proj.x += proj.vx;
         proj.y += proj.vy;
         if (frameCountRef.current % 2 === 0) {
            particlesRef.current.push({
               x: proj.x + 10,
               y: proj.y,
               vx: 2,
               vy: -1 + Math.random() * 2,
               size: 10 + Math.random() * 10,
               life: 20,
               type: 'fire',
               color: '#f97316'
            });
         }
       } else {
         proj.x += proj.vx;
         proj.y += Math.sin(frameCountRef.current * 0.1) * 2; 
       }

       const dx = bird.x - proj.x;
       const dy = bird.y - proj.y;
       const distance = Math.sqrt(dx*dx + dy*dy);
       if (distance < hitRadius + proj.radius) { 
          handleCollision();
          return;
       }
       if (proj.x < -50 || proj.y > LOGICAL_HEIGHT + 50) projectiles.splice(i, 1);
    }
    
    if (frameCountRef.current % (gameEffects.hasNitro ? 2 : 6) === 0) {
       particlesRef.current.push({
          x: bird.x - 25,
          y: bird.y + 5,
          vx: -3,
          vy: 0,
          size: Math.random() * 4,
          life: 25,
          type: gameEffects.hasNitro ? 'fire' : 'spark',
          color: gameEffects.hasNitro ? '#f97316' : 'rgba(255,255,255,0.4)'
       });
    }
  };

  const drawTrees = (ctx: CanvasRenderingContext2D, width: number, height: number, scrollX: number) => {
    const treeSpacing = 200;
    const offset = Math.floor(scrollX / treeSpacing);
    const season = currentSeasonRef.current;
    
    let leafColor = '#15803d'; // Spring
    if (season === 'Summer') leafColor = '#166534';
    if (season === 'Autumn') leafColor = '#d97706';
    if (season === 'Winter') leafColor = '#cbd5e1';

    for (let i = offset - 1; i < offset + (width / treeSpacing) + 2; i++) {
       const tx = i * treeSpacing - scrollX;
       if (tx > -100 && tx < width + 100) {
          ctx.fillStyle = leafColor; 
          ctx.beginPath(); ctx.arc(tx + 10, height - 160, 45, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#451a03'; ctx.fillRect(tx, height - 160, 20, 120);
       }
    }
  };

  const drawFarmLayer = (ctx: CanvasRenderingContext2D, width: number, height: number, frame: number) => {
      ctx.fillStyle = '#84cc16'; // Lime green grass
      ctx.fillRect(0, height - 80, width, 80);
      farmObjectsRef.current.forEach(obj => {
         if (obj.x > -100 && obj.x < width + 100) {
             if (obj.type === 'house') {
                 ctx.fillStyle = '#fce7f3'; ctx.fillRect(obj.x, height - 140, 60, 60);
                 ctx.fillStyle = '#be123c'; ctx.beginPath(); ctx.moveTo(obj.x - 10, height - 140); ctx.lineTo(obj.x + 30, height - 190); ctx.lineTo(obj.x + 70, height - 140); ctx.fill();
                 ctx.fillStyle = '#4a044e'; ctx.fillRect(obj.x + 20, height - 110, 20, 30);
             } else if (obj.type === 'cow') {
                 ctx.fillStyle = '#fff'; ctx.fillRect(obj.x, height - 110, 40, 25);
                 ctx.fillStyle = '#000'; ctx.fillRect(obj.x + 5, height - 105, 10, 10); ctx.fillRect(obj.x + 25, height - 108, 8, 8);
                 ctx.fillStyle = '#fff'; ctx.fillRect(obj.x - 10, height - 120, 15, 15);
             } else if (obj.type === 'sheep') {
                 ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(obj.x, height - 100, 15, 0, Math.PI*2); ctx.arc(obj.x + 20, height - 100, 18, 0, Math.PI*2); ctx.fill();
                 ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(obj.x - 10, height - 105, 8, 0, Math.PI*2); ctx.fill();
             }
         }
      });
  };

  const drawObstacle = (ctx: CanvasRenderingContext2D, p: Pipe, primaryColor: string) => {
      const pipeW = 70;
      const frame = frameCountRef.current;

      // BASE PIPES (Default)
      if (p.type === 'pipe') {
          ctx.fillStyle = primaryColor;
          // Top Pipe
          ctx.fillRect(p.x, 0, pipeW, p.currentTopHeight);
          ctx.fillStyle = '#166534'; ctx.fillRect(p.x - 2, p.currentTopHeight - 20, pipeW + 4, 20); // Lip
          // Bottom Pipe
          ctx.fillStyle = primaryColor;
          ctx.fillRect(p.x, p.currentTopHeight + config.gapSize, pipeW, LOGICAL_HEIGHT);
          ctx.fillStyle = '#166534'; ctx.fillRect(p.x - 2, p.currentTopHeight + config.gapSize, pipeW + 4, 20); // Lip
          return;
      }

      // --- VISUAL VARIATIONS ---
      
      // 1. BIRD FLOCK (Swarm of enemies)
      if (p.type === 'bird_flock') {
          ctx.fillStyle = '#ef4444'; // Red birds
          const birdCount = Math.floor(p.currentTopHeight / 30);
          // Draw flock on top
          for(let i=0; i<birdCount; i++) {
              const y = i * 40;
              const offset = Math.sin(frame * 0.2 + i) * 10;
              ctx.beginPath(); ctx.arc(p.x + 35 + offset, y, 15, 0, Math.PI*2); ctx.fill();
              ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(p.x + 30 + offset, y - 5, 5, 0, Math.PI*2); ctx.fill(); // Eye
              ctx.fillStyle = '#ef4444';
          }
          // Draw flock on bottom
          const bottomStart = p.currentTopHeight + config.gapSize;
          for(let i=0; i<15; i++) {
              const y = bottomStart + i * 40;
              const offset = Math.cos(frame * 0.2 + i) * 10;
              ctx.beginPath(); ctx.arc(p.x + 35 + offset, y, 15, 0, Math.PI*2); ctx.fill();
              ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(p.x + 30 + offset, y - 5, 5, 0, Math.PI*2); ctx.fill();
              ctx.fillStyle = '#ef4444';
          }
          return;
      }

      // 2. STONE (Ancient Pillars)
      if (p.type === 'stone') {
          ctx.fillStyle = '#57534e'; // Stone Grey
          // Top
          ctx.fillRect(p.x, 0, pipeW, p.currentTopHeight);
          ctx.fillStyle = '#292524'; // Cracks
          ctx.beginPath(); ctx.moveTo(p.x+10, 10); ctx.lineTo(p.x+30, 40); ctx.stroke();
          // Bottom
          ctx.fillStyle = '#57534e';
          ctx.fillRect(p.x, p.currentTopHeight + config.gapSize, pipeW, LOGICAL_HEIGHT);
          return;
      }

      // 3. FIRE (Lava Pillars)
      if (p.type === 'fire' || p.type === 'magma') {
          const pulsate = Math.sin(frame * 0.1) * 5;
          const gradient = ctx.createLinearGradient(p.x, 0, p.x + pipeW, 0);
          gradient.addColorStop(0, '#7f1d1d');
          gradient.addColorStop(0.5, '#ef4444');
          gradient.addColorStop(1, '#7f1d1d');
          ctx.fillStyle = gradient;
          
          ctx.fillRect(p.x + pulsate, 0, pipeW - pulsate*2, p.currentTopHeight);
          ctx.fillRect(p.x + pulsate, p.currentTopHeight + config.gapSize, pipeW - pulsate*2, LOGICAL_HEIGHT);
          
          // Flame tips
          ctx.fillStyle = '#facc15';
          ctx.beginPath(); ctx.arc(p.x + 35, p.currentTopHeight, 20 + pulsate, 0, Math.PI, true); ctx.fill();
          ctx.beginPath(); ctx.arc(p.x + 35, p.currentTopHeight + config.gapSize, 20 + pulsate, 0, Math.PI, false); ctx.fill();
          return;
      }

      // 4. ICE (Spikes)
      if (p.type === 'ice') {
          ctx.fillStyle = '#a5f3fc'; // Cyan
          // Top Icicle
          ctx.beginPath(); ctx.moveTo(p.x, 0); ctx.lineTo(p.x + pipeW, 0); ctx.lineTo(p.x + pipeW/2, p.currentTopHeight); ctx.fill();
          // Bottom Icicle
          ctx.beginPath(); ctx.moveTo(p.x, LOGICAL_HEIGHT); ctx.lineTo(p.x + pipeW, LOGICAL_HEIGHT); ctx.lineTo(p.x + pipeW/2, p.currentTopHeight + config.gapSize); ctx.fill();
          return;
      }

      // 5. ELECTRO (Beams)
      if (p.type === 'electro' || p.type === 'laser') {
          const color = p.type === 'laser' ? '#ef4444' : '#60a5fa';
          ctx.fillStyle = '#333'; // Base emitters
          ctx.fillRect(p.x, p.currentTopHeight - 20, pipeW, 20);
          ctx.fillRect(p.x, p.currentTopHeight + config.gapSize, pipeW, 20);
          
          ctx.strokeStyle = color;
          ctx.lineWidth = 4 + Math.random() * 4;
          ctx.beginPath(); 
          ctx.moveTo(p.x + pipeW/2, 0); 
          ctx.lineTo(p.x + pipeW/2, p.currentTopHeight); 
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(p.x + pipeW/2, p.currentTopHeight + config.gapSize); 
          ctx.lineTo(p.x + pipeW/2, LOGICAL_HEIGHT);
          ctx.stroke();
          
          // Beam across gap (Hazard) - Actually we only draw collision blocks, so just draw vertical
          return;
      }

      // 6. GHOST (Transparent)
      if (p.type === 'ghost') {
          ctx.globalAlpha = 0.5;
          ctx.fillStyle = '#fff';
          ctx.fillRect(p.x, 0, pipeW, p.currentTopHeight);
          ctx.fillRect(p.x, p.currentTopHeight + config.gapSize, pipeW, LOGICAL_HEIGHT);
          ctx.globalAlpha = 1.0;
          return;
      }

      // 7. VINE (Nature)
      if (p.type === 'vine') {
          ctx.fillStyle = '#3f6212';
          ctx.fillRect(p.x + 20, 0, 30, p.currentTopHeight);
          ctx.fillRect(p.x + 20, p.currentTopHeight + config.gapSize, 30, LOGICAL_HEIGHT);
          // Thorns
          ctx.fillStyle = '#14532d';
          for(let i=0; i<p.currentTopHeight; i+=40) {
              ctx.beginPath(); ctx.moveTo(p.x + 20, i); ctx.lineTo(p.x, i+10); ctx.lineTo(p.x+20, i+20); ctx.fill();
          }
          return;
      }

      // 8. GLITCH (Digital)
      if (p.type === 'glitch') {
          ctx.fillStyle = '#000';
          const h = p.currentTopHeight;
          for(let i=0; i<h; i+=10) {
              if (Math.random() > 0.5) ctx.fillStyle = '#0f0'; else ctx.fillStyle = '#000';
              ctx.fillRect(p.x + (Math.random()*10 - 5), i, pipeW, 10);
          }
          const h2 = LOGICAL_HEIGHT - (p.currentTopHeight + config.gapSize);
          const start2 = p.currentTopHeight + config.gapSize;
          for(let i=0; i<h2; i+=10) {
              if (Math.random() > 0.5) ctx.fillStyle = '#0f0'; else ctx.fillStyle = '#000';
              ctx.fillRect(p.x + (Math.random()*10 - 5), start2 + i, pipeW, 10);
          }
          return;
      }

      // Fallback for others (Blade, Portal, Toxic, etc.) -> use standard with different colors
      let fallbackColor = '#64748b';
      if (p.type === 'toxic') fallbackColor = '#84cc16';
      if (p.type === 'black_hole') fallbackColor = '#000';
      if (p.type === 'crystal') fallbackColor = '#d8b4fe';
      if (p.type === 'blade') fallbackColor = '#94a3b8';
      
      ctx.fillStyle = fallbackColor;
      ctx.fillRect(p.x, 0, pipeW, p.currentTopHeight);
      ctx.fillRect(p.x, p.currentTopHeight + config.gapSize, pipeW, LOGICAL_HEIGHT);
      
      // Decoration
      if (p.type === 'blade') {
          ctx.fillStyle = '#cbd5e1'; 
          const bladeY = p.currentTopHeight;
          ctx.beginPath(); ctx.arc(p.x + pipeW/2, bladeY, 30, frame * 0.5, frame * 0.5 + Math.PI*1.5); ctx.fill();
      }
  };

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const scale = height / LOGICAL_HEIGHT;
    
    const viewWidth = width / scale;
    updateEnvironment(Math.max(viewWidth, LOGICAL_WIDTH));
    frameCountRef.current++;
    
    if (status === GameStatus.PLAYING) {
        updatePhysics();
    }
    
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.scale(scale, scale);
    
    const timeOfDay = currentTimeRef.current;
    const grad = ctx.createLinearGradient(0, 0, 0, LOGICAL_HEIGHT);
    grad.addColorStop(0, timeOfDay === 'Night' ? '#1e293b' : '#38bdf8');
    grad.addColorStop(1, timeOfDay === 'Night' ? '#4338ca' : '#f0f9ff');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, Math.max(viewWidth, LOGICAL_WIDTH), LOGICAL_HEIGHT);

    if (timeOfDay === 'Night') {
       ctx.fillStyle = '#fef3c7'; ctx.beginPath(); ctx.arc(Math.max(viewWidth, LOGICAL_WIDTH) - 100, 100, 45, 0, Math.PI*2); ctx.fill();
    } else {
       ctx.fillStyle = '#fde047'; ctx.beginPath(); ctx.arc(Math.max(viewWidth, LOGICAL_WIDTH) - 80, 80, 60, 0, Math.PI*2); ctx.fill();
    }

    cloudsRef.current.forEach(c => {
       ctx.fillStyle = c.color;
       ctx.beginPath(); ctx.arc(c.x, c.y, c.size, 0, Math.PI * 2); ctx.fill();
    });

    drawTrees(ctx, Math.max(viewWidth, LOGICAL_WIDTH), LOGICAL_HEIGHT, frameCountRef.current * 0.5);
    drawFarmLayer(ctx, Math.max(viewWidth, LOGICAL_WIDTH), LOGICAL_HEIGHT, frameCountRef.current);

    pipesRef.current.forEach(p => {
        drawObstacle(ctx, p, config.primaryColor);
    });

    projectilesRef.current.forEach(p => {
        ctx.fillStyle = p.type === 'fireball' ? '#f97316' : '#000';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI*2); ctx.fill();
    });

    particlesRef.current.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill();
    });
    
    if (status === GameStatus.PLAYING || status === GameStatus.GAME_OVER) {
        ctx.save();
        ctx.translate(birdRef.current.x, birdRef.current.y);
        ctx.rotate(birdRef.current.rotation);
        
        if (shieldActiveRef.current) {
            ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = 3;
            ctx.beginPath(); ctx.ellipse(0, 0, birdRef.current.radius * 1.4, birdRef.current.radius * 1.1, 0, 0, Math.PI*2); ctx.stroke();
            ctx.fillStyle = 'rgba(34, 211, 238, 0.2)'; ctx.fill();
        }

        // --- DYNAMIC BIRD RENDERING ---
        const skinId = playerProfile.equippedSkinId;
        const r = birdRef.current.radius;
        
        let shape: 'circle' | 'tall' | 'cube' | 'oval' = 'oval'; 
        let baseColor = '#3b82f6';
        let accentColor = '#60a5fa';
        let eyeType: 'normal' | 'angry' | 'cool' | 'cyborg' | 'ninja' | 'helmet' | 'visor' = 'normal';
        let pattern: 'none' | 'camo' | 'metal' = 'none';
        
        // STANDARD MAPPINGS
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

        // --- NEW 10 SKINS ---
        if (skinId === 'bat_bird') { baseColor = '#111'; accentColor = '#333'; eyeType='angry'; }
        if (skinId === 'bee_buzz') { baseColor = '#fbbf24'; accentColor = '#000'; } // Special stripes handling below
        if (skinId === 'ufo_saucer') { baseColor = '#9ca3af'; accentColor = '#22d3ee'; shape='oval'; }
        if (skinId === 'ghost_boo') { baseColor = 'rgba(255,255,255,0.6)'; accentColor = '#fff'; }
        if (skinId === 'skeleton_bone') { baseColor = '#f3f4f6'; accentColor = '#9ca3af'; eyeType='angry'; }
        if (skinId === 'rainbow_dash') { baseColor = '#f472b6'; accentColor = '#22d3ee'; } // Rainbow effect
        if (skinId === 'golden_eagle') { baseColor = '#f59e0b'; accentColor = '#fcd34d'; eyeType='angry'; }
        if (skinId === 'owl_wise') { baseColor = '#78350f'; accentColor = '#a16207'; }
        if (skinId === 'parrot_party') { baseColor = '#ef4444'; accentColor = '#22c55e'; }
        if (skinId === 'toucan_tropic') { baseColor = '#000'; accentColor = '#fff'; }

        // DRAW TAIL
        ctx.fillStyle = accentColor;
        ctx.beginPath();
        if (skinId === 'bat_bird') {
             ctx.moveTo(-r, -5); ctx.lineTo(-r-15, -15); ctx.lineTo(-r-10, 0); ctx.lineTo(-r-15, 15); ctx.lineTo(-r, 5);
        } else {
             ctx.moveTo(-r, 0); ctx.lineTo(-r - 12, -6); ctx.lineTo(-r - 12, 6);
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

        // SPECIAL PATTERNS
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
            ctx.fillRect(-5, 0, 2, 8); ctx.fillRect(0, 0, 2, 8); ctx.fillRect(5, 0, 2, 8); // Ribs
        }
        if (skinId === 'ufo_saucer') {
            ctx.fillStyle = '#22d3ee'; ctx.beginPath(); ctx.arc(0, -5, 10, 0, Math.PI*2); ctx.fill(); // Dome
        }

        // DRAW EYES
        const eyeY = shape === 'tall' ? -r * 0.5 : -6;
        const eyeOffsetX = 8;
        
        const roundRect = (x: number, y: number, w: number, h: number, r: number) => {
            ctx.beginPath(); ctx.roundRect(x, y, w, h, r); 
        };

        if (skinId === 'owl_wise') {
            ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(-5, eyeY, 8, 0, Math.PI*2); ctx.arc(5, eyeY, 8, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(-5, eyeY, 3, 0, Math.PI*2); ctx.arc(5, eyeY, 3, 0, Math.PI*2); ctx.fill();
        } else if (skinId === 'ufo_saucer') {
            // No eyes for UFO base
        } else if (eyeType === 'helmet') {
           ctx.fillStyle = '#3f6212'; ctx.beginPath(); ctx.arc(0, eyeY - 5, r + 2, Math.PI, 0); ctx.fill();
           ctx.fillStyle = '#111'; ctx.beginPath(); ctx.rect(-20, eyeY-5, 40, 10); ctx.fill();
           ctx.fillStyle = '#4ade80'; ctx.beginPath(); ctx.arc(-10, eyeY, 4, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(10, eyeY, 4, 0, Math.PI*2); ctx.fill();
        } else if (eyeType === 'visor') {
           ctx.fillStyle = '#0ea5e9'; ctx.beginPath(); ctx.rect(-r*0.8, eyeY - 4, r*1.6, 14); ctx.fill();
           ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.beginPath(); ctx.moveTo(-r*0.5, eyeY - 4); ctx.lineTo(r*0.5, eyeY+8); ctx.stroke();
        } else if (eyeType === 'ninja') {
          ctx.fillStyle = '#000'; ctx.fillRect(-r, eyeY - 6, shape === 'cube' ? r*2 : r*1.8, 12);
          ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(6, eyeY, 4, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(-6, eyeY, 4, 0, Math.PI*2); ctx.fill();
        } else if (eyeType === 'cool') {
          ctx.fillStyle = '#000'; ctx.beginPath(); ctx.rect(-16, eyeY - 4, 14, 10); ctx.fill(); ctx.beginPath(); ctx.rect(2, eyeY - 4, 14, 10); ctx.fill();
          ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-2, eyeY); ctx.lineTo(2, eyeY); ctx.stroke();
        } else if (eyeType === 'cyborg') {
          ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(-8, eyeY, 8, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(-6, eyeY, 3, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle = '#333'; ctx.beginPath(); ctx.arc(8, eyeY, 9, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(8, eyeY, 4, 0, Math.PI*2); ctx.fill();
        } else {
          ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(eyeOffsetX + 6, eyeY, 8, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(eyeOffsetX + 8, eyeY, 3, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(eyeOffsetX - 8, eyeY, 8, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(eyeOffsetX - 6, eyeY, 3, 0, Math.PI*2); ctx.fill();
          if (eyeType === 'angry') {
            ctx.fillStyle = '#000';
            ctx.beginPath(); ctx.moveTo(eyeOffsetX - 12, eyeY - 10); ctx.lineTo(eyeOffsetX - 2, eyeY - 2); ctx.lineTo(eyeOffsetX - 14, eyeY - 12); ctx.fill();
            ctx.beginPath(); ctx.moveTo(eyeOffsetX + 12, eyeY - 10); ctx.lineTo(eyeOffsetX + 2, eyeY - 2); ctx.lineTo(eyeOffsetX + 14, eyeY - 12); ctx.fill();
          }
        }

        // DRAW BEAK
        const beakY = shape === 'tall' ? 2 : 4;
        if (skinId === 'toucan_tropic') {
            ctx.fillStyle = '#f97316'; ctx.beginPath(); ctx.moveTo(12, beakY); ctx.lineTo(35, beakY + 4); ctx.lineTo(12, beakY + 12); ctx.fill();
            ctx.fillStyle = '#000'; ctx.fillRect(30, beakY+2, 5, 5);
        } else if (eyeType !== 'visor' && skinId !== 'ufo_saucer') {
            ctx.fillStyle = '#facc15';
            ctx.beginPath(); ctx.moveTo(12, beakY); ctx.lineTo(28, beakY + 4); ctx.lineTo(12, beakY + 8); ctx.fill();
        }

        // WING
        if (skinId !== 'ufo_saucer') {
            ctx.fillStyle = baseColor;
            if (skinId === 'bat_bird') {
                ctx.fillStyle = '#333';
                ctx.beginPath(); ctx.moveTo(-5, 0); ctx.lineTo(10, -15); ctx.lineTo(5, 5); ctx.fill();
            } else {
                ctx.beginPath(); ctx.ellipse(-10, 5, 10, 6, -0.2 + Math.sin(birdRef.current.wingFrame)*0.5, 0, Math.PI*2); ctx.fill();
            }
        }

        ctx.restore();
    }
    
    ctx.restore();

    requestRef.current = requestAnimationFrame(gameLoop);
  }, [config, width, height, status, gravityMultiplier, jumpMultiplier, rotationMultiplier, gameEffects.hasNitro, playerProfile.equippedSkinId]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameLoop]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="block cursor-pointer touch-none"
      onMouseDown={(e) => {
        e.preventDefault();
        jump();
      }}
      onTouchStart={(e) => {
        e.preventDefault();
        jump();
      }}
    />
  );
};

export default GameCanvas;
