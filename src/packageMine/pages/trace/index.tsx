import { useState } from 'react';
import Taro, { useDidShow } from '@tarojs/taro';
import { View, Text, ScrollView } from '@tarojs/components';
import { ZenBackground } from '../../../components/ZenBackground';
import './index.scss';

interface HistoryRecord {
  id: number;
  level: string;
  echo: string;
  insight: string;
  seal?: string;
  date: string;
  time: string;
}

export default function Trace() {
  const [history, setHistory] = useState<HistoryRecord[]>([]);

  useDidShow(() => {
    const data = Taro.getStorageSync('resonance_history') || [];
    setHistory(data);
  });

  return (
    <View className='trace-page'>
      <ZenBackground />
      
      <View className='trace-header'>
        <Text className='title'>共鸣印记</Text>
        <Text className='subtitle'>记录每一次灵魂回响</Text>
      </View>

      <ScrollView className='trace-list' scrollY showScrollbar={false} enhanced>
        {history.length > 0 ? (
          history.map((item) => (
            <View key={item.id} className='trace-item'>
              <View className='item-card' onClick={() => Taro.navigateTo({ url: `/packageMine/pages/trace/detail?id=${item.id}` })}>
                <View className='item-time-tag'>
                  <Text className='date'>{item.date}</Text>
                  <Text className='time'>{item.time}</Text>
                </View>
                <View className='card-header'>
                  <Text className='level'>{item.level || '深度共鸣'}</Text>
                  {item.seal && <Text className='seal'>{item.seal}</Text>}
                </View>
                <Text className='poem'>{item.echo}</Text>
                <Text className='advice'>{item.insight}</Text>
              </View>
            </View>
          ))
        ) : (
          <View className='empty-state'>
            <View className='empty-aura' />
            <Text className='icon'>✨</Text>
            <View className='empty-info'>
              <Text className='empty-title'>尚无共鸣印记</Text>
              <Text className='empty-subtitle'>试着随缘播下一粒思绪的种子...</Text>
            </View>
            
            <View className='seed-grid'>
              {['我有话想对自己说...', '分享此刻的云淡风轻', '记录那抹突如其来的感伤', '最近遇到了一个有趣的人'].map((seed, i) => (
                <View key={i} className='seed-item' onClick={() => Taro.switchTab({ url: '/pages/index/index' })}>
                  <Text>{seed}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        <View className='list-footer'>到底了 · 万物静观皆自得</View>
      </ScrollView>
    </View>
  );
}
