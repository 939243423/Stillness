import { useState, useCallback, useRef, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Image, Text, Canvas } from '@tarojs/components';
import MuyuImg from '../../assets/images/zen-muyu.png';
import './index.scss';

const ZEN_TEXTS = ['心静', '灵光', '功德+', '治愈', '安然'];

export const ZenMuyu = () => {
  const [scale, setScale] = useState(1);
  const [floatings, setFloatings] = useState<any[]>([]);
  const ctxRef = useRef<any>(null);

  const drawSplash = useCallback((x: number, y: number) => {
    if (!ctxRef.current) return;
    const ctx = ctxRef.current;
    let radius = 0;
    let opacity = 0.5;

    const animate = () => {
      if (opacity <= 0) {
        ctx.clearRect(0, 0, 400, 400); // 简单清理
        return;
      }
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
      ctx.fill();
      
      radius += 4;
      opacity -= 0.02;
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  const handleClick = useCallback((e) => {
    Taro.vibrateShort({ type: 'light' });
    
    // 水墨晕染位置计算 (相对于容器)
    const clientX = e.detail.x || 150;
    const clientY = e.detail.y || 150;
    
    drawSplash(clientX, clientY);
    
    // 增加累计功德
    const count = Taro.getStorageSync('muyu_count') || 0;
    Taro.setStorageSync('muyu_count', count + 1);
    
    setScale(0.85); // 增加下陷感
    setTimeout(() => setScale(1.05), 100);
    setTimeout(() => setScale(1), 300);

    // 3. 产生漂浮文字
    const id = Date.now();
    const text = ZEN_TEXTS[Math.floor(Math.random() * ZEN_TEXTS.length)];
    setFloatings((prev) => [...prev, { id, x: clientX, y: clientY - 50, text }]);
    setTimeout(() => setFloatings((prev) => prev.filter((f) => f.id !== id)), 2000);
  }, [drawSplash]);

  useEffect(() => {
    if (Taro.getEnv() !== Taro.ENV_TYPE.WEAPP) return;
    const query = Taro.createSelectorQuery();
    query.select('#muyuCanvas').fields({ node: true, size: true }).exec((res) => {
      if (!res[0]) return;
      const canvas = res[0].node;
      const dpr = Taro.getSystemInfoSync().pixelRatio;
      canvas.width = res[0].width * dpr;
      canvas.height = res[0].height * dpr;
      ctxRef.current = canvas.getContext('2d');
      ctxRef.current.scale(dpr, dpr);
    });
  }, []);

  return (
    <View className='zen-muyu-container'>
      <Canvas id='muyuCanvas' type='2d' className='muyu-canvas' />
      <View 
        className='zen-muyu-wrapper' 
        onClick={handleClick}
        style={{ transform: `scale(${scale})` }}
      >
        <Image src={MuyuImg} className='zen-muyu-img' mode='widthFix' />
      </View>
      
      {floatings.map((f) => (
        <Text 
          key={f.id} 
          className='floating-text' 
          style={{ 
            left: `${f.x}px`, 
            top: `${f.y}px`,
            '--random-offset': `${Math.random() * 40 - 20}px` 
          } as any}
        >
          {f.text}
        </Text>
      ))}
    </View>
  );
};
