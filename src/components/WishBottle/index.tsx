import { useEffect, useRef, useState, useCallback } from 'react';
import Taro from '@tarojs/taro';
import { View, Canvas, Text } from '@tarojs/components';
import './index.scss';

const VIBE_PHRASES = ['当下即好', '万物温柔', '生机盎然', '平和喜悦', '未来可期', '心生欢喜'];

export const WishBottle = () => {
  const [floatings, setFloatings] = useState<any[]>([]);
  const isUnmounted = useRef(false);

  useEffect(() => {
    isUnmounted.current = false;
    return () => {
      isUnmounted.current = true;
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
      <View className='vibe-hint'>开启心响，写下此刻</View>
    </View>
  );
};
