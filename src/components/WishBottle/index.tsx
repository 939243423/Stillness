import { useEffect, useRef, useState, useCallback } from 'react';
import Taro from '@tarojs/taro';
import { View, Canvas, Text } from '@tarojs/components';
import './index.scss';

const VIBE_PHRASES = ['当下即好', '万物温柔', '生机盎然', '平和喜悦', '未来可期', '心生欢喜'];

export const WishBottle = () => {
  const [floatings, setFloatings] = useState<any[]>([]);
  const ctxRef = useRef<any>(null);
  const tiltRef = useRef({ x: 0, y: 0 });
  const isUnmounted = useRef(false);

  useEffect(() => {
    isUnmounted.current = false;
    if (Taro.getEnv() !== Taro.ENV_TYPE.WEAPP) return;

    Taro.startAccelerometer({ interval: 'ui' });
    const onAccelChange = (res) => {
      tiltRef.current = { x: res.x * 6, y: -res.y * 6 };
    };
    Taro.onAccelerometerChange(onAccelChange);

    const query = Taro.createSelectorQuery();
    query.select('#bottleCanvas').fields({ node: true, size: true }).exec((res) => {
      if (!res[0] || isUnmounted.current) return;
      const canvas = res[0].node;
      const ctx = canvas.getContext('2d');
      const dpr = Taro.getSystemInfoSync().pixelRatio;
      const width = res[0].width;
      const height = res[0].height;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      ctxRef.current = ctx;

      // Fluid-like particle system
      const particles: any[] = Array.from({ length: 45 }).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 8 + 6,
        vx: 0,
        vy: 0,
        hue: Math.random() < 0.5 ? 200 : 260, // Blue or Purple
        alpha: Math.random() * 0.3 + 0.4
      }));

      let animationId;
      const render = () => {
        if (isUnmounted.current) return;
        ctx.clearRect(0, 0, width, height);

        // Draw Liquid Light Particles
        particles.forEach(p => {
          // Gravity + Friction
          p.vx += tiltRef.current.x * 0.05;
          p.vy += tiltRef.current.y * 0.05;
          p.vx *= 0.94;
          p.vy *= 0.94;
          p.x += p.vx;
          p.y += p.vy;

          // Boundary bounce with damping
          const pad = p.r + 10;
          if (p.x < pad) { p.x = pad; p.vx *= -0.5; }
          if (p.x > width - pad) { p.x = width - pad; p.vx *= -0.5; }
          if (p.y < pad) { p.y = pad; p.vy *= -0.5; }
          if (p.y > height - pad) { p.y = height - pad; p.vy *= -0.5; }

          // Draw Glowing Blob
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2);
          grad.addColorStop(0, `hsla(${p.hue}, 100%, 85%, ${p.alpha})`);
          grad.addColorStop(1, `hsla(${p.hue}, 100%, 85%, 0)`);
          
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 2, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        });

        animationId = canvas.requestAnimationFrame(render);
      };

      render();
      return () => canvas.cancelAnimationFrame(animationId);
    });

    return () => {
      isUnmounted.current = true;
      Taro.stopAccelerometer();
      Taro.offAccelerometerChange(onAccelChange);
    };
  }, []);

  const handleTouch = useCallback((e) => {
    const touch = e.touches ? e.touches[0] : (e.changedTouches ? e.changedTouches[0] : e);
    Taro.createSelectorQuery().select('.vibe-container').boundingClientRect(res => {
      const rect = Array.isArray(res) ? res[0] : res;
      if (!rect) return;
      
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      Taro.vibrateShort({ type: 'light' });
      
      const id = Date.now();
      const text = VIBE_PHRASES[Math.floor(Math.random() * VIBE_PHRASES.length)];
      setFloatings(prev => [...prev, { id, x, y, text }]);
      setTimeout(() => {
        if (!isUnmounted.current) {
          setFloatings(prev => prev.filter(f => f.id !== id));
        }
      }, 1500);

      const count = Taro.getStorageSync('resonance_manifest') || 0;
      Taro.setStorageSync('resonance_manifest', count + 1);
    }).exec();
  }, []);

  return (
    <View className='vibe-jar-container' onTouchStart={handleTouch}>
      <View className='vibe-container'>
        <View className='vibe-glass-shine' />
        <Canvas id='bottleCanvas' type='2d' className='vibe-canvas' />
        {floatings.map(f => (
          <View 
            key={f.id} 
            className='vibe-floating' 
            style={{ left: `${f.x}px`, top: `${f.y}px` }}
          >
            <Text className='vibe-text'>{f.text}</Text>
          </View>
        ))}
      </View>
      <View className='vibe-hint'>倾斜手机或开启心响</View>
    </View>
  );
};
