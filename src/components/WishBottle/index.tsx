import { useEffect, useRef, useState, useCallback } from 'react';
import Taro from '@tarojs/taro';
import { View, Canvas, Text } from '@tarojs/components';
import './index.scss';

const ZEN_PHRASES = ['愿心安定', '万物如意', '福田广种', '当下即禅', '如露如电'];

export const WishBottle = () => {
  const [floatings, setFloatings] = useState<any[]>([]);
  const ctxRef = useRef<any>(null);
  const tiltRef = useRef({ x: 0, y: 0 });
  const burstsRef = useRef<{ x: number, y: number, r: number }[]>([]);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (Taro.getEnv() !== Taro.ENV_TYPE.WEAPP) return;

    // 1. 初始化加速计
    Taro.startAccelerometer({ interval: 'ui' });
    const onAccelChange = (res) => {
      // 映射到具体的物理力
      tiltRef.current = { x: res.x * 5, y: -res.y * 5 };
    };
    Taro.onAccelerometerChange(onAccelChange);

    // 2. 初始化 Canvas
    const query = Taro.createSelectorQuery();
    query.select('#bottleCanvas').fields({ node: true, size: true }).exec((res) => {
      if (!res[0]) return;
      const canvas = res[0].node;
      const ctx = canvas.getContext('2d');
      const dpr = Taro.getSystemInfoSync().pixelRatio;
      canvas.width = res[0].width * dpr;
      canvas.height = res[0].height * dpr;
      ctx.scale(dpr, dpr);
      ctxRef.current = ctx;

      const width = res[0].width;
      const height = res[0].height;

      // 粒子池 - 分层设计 (视差感)
      const particles: any[] = Array.from({ length: 70 }).map((_, i) => {
        const layer = i % 3; // 0: 前景, 1: 中景, 2: 背景
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          layer,
          r: layer === 0 ? Math.random() * 2 + 1.5 : (layer === 1 ? Math.random() * 1.5 + 0.8 : Math.random() * 0.8 + 0.4),
          hue: Math.random() * 30 + 190,
          alpha: layer === 0 ? Math.random() * 0.4 + 0.5 : (layer === 1 ? Math.random() * 0.3 + 0.3 : Math.random() * 0.2 + 0.1),
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          friction: layer === 0 ? 0.96 : (layer === 1 ? 0.97 : 0.98),
          history: [] as { x: number, y: number }[]
        };
      });

      const drawBottlePath = () => {
        const r = 120; // 顶圆角
        const br = 40; // 底圆角
        ctx.beginPath();
        ctx.moveTo(r, 0);
        ctx.lineTo(width - r, 0);
        ctx.arcTo(width, 0, width, r, r);
        ctx.lineTo(width, height - br);
        ctx.arcTo(width, height, width - br, height, br);
        ctx.lineTo(br, height);
        ctx.arcTo(0, height, 0, height - br, br);
        ctx.lineTo(0, r);
        ctx.arcTo(0, 0, r, 0, r);
        ctx.closePath();
      };

      let animationId;
      const render = () => {
        // 关键修复：完全清除画布，保持透明底层，解决“矩形色块”问题
        ctx.clearRect(0, 0, width, height);
        
        // 视差位移：根据倾斜程度微移背景
        const parallaxX = tiltRef.current.x * 2;
        const parallaxY = tiltRef.current.y * 2;

        ctx.save();
        ctx.translate(parallaxX, parallaxY); // 应用微小的视差偏移
        drawBottlePath();
        ctx.clip(); 

        // 绘制瓶身深处的光影背景
        const bottleGrad = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width);
        bottleGrad.addColorStop(0, 'rgba(100, 180, 255, 0.15)');
        bottleGrad.addColorStop(1, 'rgba(0, 50, 100, 0.05)');
        ctx.fillStyle = bottleGrad;
        ctx.fill(); 

        particles.forEach(p => {
          // 1. 受重力影响 (分层视差重力)
          p.vx += tiltRef.current.x * (0.04 + p.layer * 0.02);
          p.vy += tiltRef.current.y * (0.04 + p.layer * 0.02);

          // 2. 受交互“冲击”影响 (爆发力增加)
          burstsRef.current.forEach(b => {
            const dx = p.x - b.x;
            const dy = p.y - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < b.r && dist > 1) {
              const force = (b.r - dist) / b.r;
              p.vx += (dx / dist) * force * 18; // 增加爆发力感
              p.vy += (dy / dist) * force * 18;
            }
          });

          // 3. 阻尼与运动
          p.vx *= p.friction;
          p.vy *= p.friction;
          p.x += p.vx;
          p.y += p.vy;

          // 记录历史轨迹 (更长的拖尾)
          p.history.push({ x: p.x, y: p.y });
          if (p.history.length > 12) p.history.shift();

          // 边界回弹处理 (考虑视差偏移，适当内缩)
          const padding = 20;
          if (p.x < padding) { p.x = padding; p.vx *= -0.2; }
          if (p.x > width - padding) { p.x = width - padding; p.vx *= -0.2; }
          if (p.y < padding) { p.y = padding; p.vy *= -0.2; }
          if (p.y > height - padding) { p.y = height - padding; p.vy *= -0.2; }

          // 绘制拖尾
          if (p.history.length > 2) {
            ctx.beginPath();
            ctx.moveTo(p.history[0].x, p.history[0].y);
            for (let i = 1; i < p.history.length; i++) {
              ctx.lineTo(p.history[i].x, p.history[i].y);
            }
            ctx.strokeStyle = `hsla(${p.hue}, 80%, 80%, ${p.alpha * 0.3})`;
            ctx.lineWidth = p.r * 0.6;
            ctx.stroke();
          }

          // 绘制粒子 (更小、更亮、更有星光感)
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.shadowBlur = p.layer === 0 ? 12 : 6;
          ctx.shadowColor = `hsla(${p.hue}, 100%, 80%, ${p.alpha})`;
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha + 0.2})`;
          ctx.fill();
        });

        ctx.restore();
        burstsRef.current = [];
        animationId = canvas.requestAnimationFrame(render);
      };

      render();
      cleanupRef.current = () => canvas.cancelAnimationFrame(animationId);
    });

    return () => {
      if (cleanupRef.current) cleanupRef.current();
      Taro.stopAccelerometer();
      Taro.offAccelerometerChange(onAccelChange);
    };
  }, []);

  const handleTouch = useCallback((e) => {
    // 关键修复：从 touch 事件中获取相对于组件的坐标
    const touch = e.touches ? e.touches[0] : (e.changedTouches ? e.changedTouches[0] : e);
    
    Taro.createSelectorQuery().select('.wish-bottle').boundingClientRect(res => {
      const rect = Array.isArray(res) ? res[0] : res;
      if (!rect) return;
      
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      Taro.vibrateShort({ type: 'light' });
      burstsRef.current.push({ x, y, r: 100 });

      const id = Date.now();
      const text = ZEN_PHRASES[Math.floor(Math.random() * ZEN_PHRASES.length)];
      setFloatings(prev => [...prev, { id, x, y, text }]);
      setTimeout(() => {
        setFloatings(prev => prev.filter(f => f.id !== id));
      }, 2000);

      const count = Taro.getStorageSync('wish_count') || 0;
      Taro.setStorageSync('wish_count', count + 1);
    }).exec();
  }, []);

  return (
    <View className='wish-bottle-container' onTouchStart={handleTouch}>
      <View className='wish-bottle'>
        <View className='bottle-cap' />
        <View className='bottle-gloss' />
        <Canvas id='bottleCanvas' type='2d' className='bottle-canvas' />
        {floatings.map(f => (
          <Text key={f.id} className='zen-floating' style={{ left: `${f.x}px`, top: `${f.y}px` }}>
            {f.text}
          </Text>
        ))}
      </View>
    </View>
  );
};
