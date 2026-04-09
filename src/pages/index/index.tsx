import React, { useState, useCallback } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { ZenBackground } from '../../components/ZenBackground';
import { ZenMuyu } from '../../components/ZenMuyu';
import { useRewardAd } from '../../hooks/useRewardAd';
import { generateZenSeed, drawFortune } from '../../services/zenService';
import './index.scss';

export default function Index() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { showAd } = useRewardAd();

  const handleDraw = useCallback(async () => {
    // 1. 尝试显示广告（商业闭环）
    const immediate = await showAd();
    if (!immediate) return; // 如果返回 false，说明正在展示广告，等待回调

    executeDraw();
  }, [showAd]);

  const executeDraw = useCallback(async () => {
    setLoading(true);
    setResult(null);

    // 2. 模拟“占卜中”仪式感 Loading (1.5s)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 3. 生成玄学种子并抽取结果
    const seed = await generateZenSeed();
    const fortune = drawFortune(seed);

    setResult(fortune);
    setLoading(false);
    
    Taro.vibrateLong(); // 抽中结果时的强烈反馈
  }, []);

  return (
    <View className='index'>
      {/* 动态 Canvas 背景 */}
      <ZenBackground />

      <View className='index__content'>
        <View className='index__title-box'>
          <Text className='title'>签签有你</Text>
          <Text className='subtitle'>极致优雅 · 治愈身心</Text>
        </View>

        {/* 拟物化木鱼交互区 */}
        {!result && !loading && (
          <View className='content-center'>
            <ZenMuyu />
            <Text style={{ color: '#8d6e63', fontSize: '24rpx', marginTop: '20rpx', opacity: 0.6 }}>
              敲击木鱼，静候灵光
            </Text>
          </View>
        )}

        {/* 抽签结果展示 */}
        {(loading || result) && (
          <View className='fortune-result'>
            {loading ? (
              <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <View className='loading-spinner' />
                <Text style={{ color: '#5d4037', marginTop: '20rpx' }}>正在为您感知禅意...</Text>
              </View>
            ) : (
              <View>
                <Text className='level'>{result.level}</Text>
                <Text className='poem'>{result.poem}</Text>
                <Text className='advice'>{result.advice}</Text>
                <View 
                  className='zen-draw-btn' 
                  style={{ marginTop: '60rpx', width: '200rpx', height: '80rpx', fontSize: '24rpx' }}
                  onClick={() => setResult(null)}
                >
                  返回
                </View>
              </View>
            )}
          </View>
        )}

        {/* 底部交互按钮 */}
        {!loading && !result && (
          <View className={`zen-draw-btn ${loading ? 'is-loading' : ''}`} onClick={handleDraw}>
            {loading ? <View className='loading-spinner' /> : '开启今日签文'}
          </View>
        )}
      </View>
    </View>
  );
}
