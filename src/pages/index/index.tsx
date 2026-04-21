import { useState, useCallback } from 'react';
import Taro, { useDidShow } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { ZenBackground } from '../../components/ZenBackground';
import { ZenMuyu } from '../../components/ZenMuyu';
import { WishBottle } from '../../components/WishBottle';
import { FortuneCard } from '../../components/FortuneCard';
import { useRewardAd } from '../../hooks/useRewardAd';
import { generateZenSeed, drawFortune } from '../../services/zenService';
import { useTabActive } from '../../hooks/useTabActive';
import './index.scss';

export default function Index() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [mode, setMode] = useState<'muyu' | 'bottle'>('muyu');
  const { showAd } = useRewardAd();

  useTabActive(0);

  useDidShow(() => {
    // TabBar 状态由组件内部 useDidShow 自感知同步，此处无需手动设置
  });

  const handleDraw = useCallback(async () => {
    const immediate = await showAd();
    if (!immediate) return;
    executeDraw();
  }, [showAd]);

  const executeDraw = useCallback(async () => {
    setLoading(true);
    setResult(null);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const seed = await generateZenSeed();
    const fortune = drawFortune(seed);
    setResult(fortune);
    setLoading(false);

    // 增加累计签文并保存历史
    const count = Taro.getStorageSync('fortune_count') || 0;
    Taro.setStorageSync('fortune_count', count + 1);

    const history = Taro.getStorageSync('zen_history') || [];
    const newRecord = {
      ...fortune,
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString().slice(0, 5)
    };
    // 限制保存最近 50 条
    Taro.setStorageSync('zen_history', [newRecord, ...history].slice(0, 50));
  }, []);

  return (
    <View className='index'>
      <ZenBackground />

      {/* 仅在非加载/结果状态显示首页主内容 */}
      {!loading && !result && (
        <View className='index__content'>
          <View className='index__title-box'>
            <Text className='title'>签签有你</Text>
            <Text className='subtitle'>极致优雅 · 治愈身心</Text>
          </View>

          {/* 模式切换器 */}
          {!result && !loading && (
            <View className='zen-tabs'>
              <View className={`tab ${mode === 'muyu' ? 'active' : ''}`} onClick={() => setMode('muyu')}>禅听木鱼</View>
              <View className={`tab ${mode === 'bottle' ? 'active' : ''}`} onClick={() => setMode('bottle')}>流光许愿</View>
            </View>
          )}

          {/* 交互核心区 */}
          {!result && !loading && (
            <View className='content-center'>
              {mode === 'muyu' ? <ZenMuyu /> : <WishBottle />}
            </View>
          )}

          {/* 开启按钮 */}
          {!loading && !result && (
            <View className='zen-draw-btn' onClick={handleDraw}>
              开启今日签文
            </View>
          )}
        </View>
      )}

      {/* 抽签结果与分享 - 移至最外层以确保固定定位不受父容器影响 */}
      {(loading || result) && (
        <View className='result-modal'>
          {loading ? (
            <View className='loading-state'>
              <View className='loading-spinner' />
              <Text>正在为您感知禅意...</Text>
            </View>
          ) : (
            <View className='result-view'>
              <FortuneCard data={result} />
              <View className='btn-back' onClick={() => setResult(null)}>返回修行</View>
            </View>
          )}
        </View>
      )}
    </View>
  );
}
