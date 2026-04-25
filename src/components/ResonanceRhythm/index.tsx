import { useState, useCallback, useRef, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Canvas } from '@tarojs/components';
import './index.scss';

const RESONANCE_TEXTS = ['宁静', '共鸣', '律动', '感应', '温柔', '回响'];

export const ResonanceRhythm = () => {
  const [scale, setScale] = useState(1);
  const [floatings, setFloatings] = useState<any[]>([]);
  const ctxRef = useRef<any>(null);
  const canvasRef = useRef<any>(null);
  const ripplesRef = useRef<any[]>([]);
  const isUnmounted = useRef(false);
  const lastTapTime = useRef(0);

  const drawRipple = useCallback((x: number, y: number) => {
    if (!ctxRef.current || isUnmounted.current) return;
    ripplesRef.current.push({
      x,
      y,
      radius: 5,
      opacity: 0.6,
      color: '#A8D5BA'
    });
  }, []);

  const handleClick = useCallback((e) => {
    if (isUnmounted.current) return;
    const now = Date.now();
    if (now - lastTapTime.current < 100) return;
    lastTapTime.current = now;

    Taro.vibrateShort({ type: 'light' });
    const clientX = e.detail.x || 150;
    const clientY = e.detail.y || 150;
    
    drawRipple(clientX, clientY);
    
    const count = Taro.getStorageSync('resonance_energy') || 0;
    Taro.setStorageSync('resonance_energy', count + 1);
    
    setScale(0.92);
    setTimeout(() => { if (!isUnmounted.current) setScale(1.08); }, 80);
    setTimeout(() => { if (!isUnmounted.current) setScale(1); }, 300);

    const id = Date.now();
    const text = RESONANCE_TEXTS[Math.floor(Math.random() * RESONANCE_TEXTS.length)];
    // 将起始 y 坐标大幅上移，并增加随机水平偏移
    const randomX = (Math.random() - 0.5) * 60;
    setFloatings((prev) => [...prev, { id, x: clientX + randomX, y: clientY - 250, text }]);
    setTimeout(() => {
      if (!isUnmounted.current) {
        setFloatings((prev) => prev.filter((f) => f.id !== id));
      }
    }, 1500);
  }, [drawRipple]);

  useEffect(() => {
    isUnmounted.current = false;
    if (Taro.getEnv() !== Taro.ENV_TYPE.WEAPP) return;
    
    const query = Taro.createSelectorQuery();
    query.select('#rhythmCanvas').fields({ node: true, size: true }).exec((res) => {
      if (!res[0] || isUnmounted.current) return;
      const canvas = res[0].node;
      const ctx = canvas.getContext('2d');
      const dpr = Taro.getWindowInfo().pixelRatio;
      const width = res[0].width;
      const height = res[0].height;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvasRef.current = canvas;
      ctxRef.current = ctx;
      ctx.scale(dpr, dpr);

      let animationId;
      const render = () => {
        if (isUnmounted.current) return;
        ctx.clearRect(0, 0, width, height);

        ripplesRef.current = ripplesRef.current.filter(r => r.opacity > 0);
        ripplesRef.current.forEach(r => {
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(168, 213, 186, ${r.opacity})`;
          ctx.lineWidth = 2;
          ctx.stroke();
          
          r.radius += 4;
          r.opacity -= 0.02;
        });

        animationId = canvas.requestAnimationFrame(render);
      };

      render();
      return () => canvas.cancelAnimationFrame(animationId);
    });

    return () => { isUnmounted.current = true; };
  }, []);

  return (
    <View className='resonance-tap-container'>
      <Canvas id='rhythmCanvas' type='2d' className='rhythm-canvas' />
      <View 
        className='resonance-gem-wrapper' 
        onClick={handleClick}
        style={{ transform: `scale(${scale})` }}
      >
        <View className='resonance-gem-outer'>
          <View className='resonance-gem-inner' />
          <View className='resonance-gem-glow' />
        </View>
      </View>
      <View className='tap-hint'>轻触以启迪</View>

      {floatings.map((f) => (
        <View 
          key={f.id} 
          className='floating-insight' 
          style={{ left: `${f.x}px`, top: `${f.y}px` }}
        >
          <Text className='insight-text'>{f.text}</Text>
        </View>
      ))}
    </View>
  );
};
