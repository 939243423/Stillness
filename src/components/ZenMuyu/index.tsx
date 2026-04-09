import React, { useState, useCallback, useRef } from 'react';
import Taro from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import MuyuImg from '../../assets/images/zen-muyu.png';
import './index.scss';

interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
}

const ZEN_TEXTS = ['心静', '灵光', '功德+', '治愈', '安然'];

export const ZenMuyu = () => {
  const [scale, setScale] = useState(1);
  const [floatings, setFloatings] = useState<FloatingText[]>([]);
  const countRef = useRef(0);

  const handleClick = useCallback((e) => {
    // 1. 触发触觉反馈
    Taro.vibrateShort({ type: 'light' });

    // 2. 模拟 Spring 动画核心逻辑
    // 通过 CSS 合并实现 Spring 感觉：1.0 -> 0.92 -> 1.05 -> 1.0
    setScale(0.92);
    setTimeout(() => setScale(1.05), 100);
    setTimeout(() => setScale(1), 300);

    // 3. 产生漂浮文字
    const id = Date.now();
    const { clientX, clientY } = e.detail || { clientX: 180, clientY: 200 };
    const text = ZEN_TEXTS[Math.floor(Math.random() * ZEN_TEXTS.length)];
    
    setFloatings((prev) => [...prev, { id, x: clientX, y: clientY - 50, text }]);
    
    // 2s 后自动清理
    setTimeout(() => {
      setFloatings((prev) => prev.filter((f) => f.id !== id));
    }, 2000);
  }, []);

  return (
    <View className='zen-muyu-container'>
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
