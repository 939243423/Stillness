import { useState } from 'react';
import Taro, { useDidShow } from '@tarojs/taro';
import { View, Text, ScrollView } from '@tarojs/components';
import { ZenBackground } from '../../../components/ZenBackground';
import './index.scss';

interface HistoryRecord {
  id: number;
  level: string;
  poem: string;
  advice: string;
  seal?: string;
  date: string;
  time: string;
}

export default function Trace() {
  const [history, setHistory] = useState<HistoryRecord[]>([]);

  useDidShow(() => {
    const data = Taro.getStorageSync('zen_history') || [];
    setHistory(data);
  });

  return (
    <View className='trace-page'>
      <ZenBackground />
      
      <View className='trace-header'>
        <Text className='title'>修行轨迹</Text>
        <Text className='subtitle'>记录每一次与内心的对话</Text>
      </View>

      <ScrollView className='trace-list' scrollY>
        {history.length > 0 ? (
          history.map((item) => (
            <View key={item.id} className='trace-item'>
              <View className='item-time'>
                <Text className='date'>{item.date}</Text>
                <Text className='time'>{item.time}</Text>
              </View>
              <View className='item-card'>
                <View className='card-header'>
                  <Text className='level'>{item.level}</Text>
                  {item.seal && <Text className='seal'>{item.seal}</Text>}
                </View>
                <Text className='poem'>{item.poem}</Text>
                <Text className='advice'>{item.advice.split('；')[0]}</Text>
              </View>
            </View>
          ))
        ) : (
          <View className='empty-state'>
            <Text className='icon'>🍵</Text>
            <Text>尚无修行记录，去抽一张签吧</Text>
          </View>
        )}
        <View className='list-footer'>到底了 · 万物静观皆自得</View>
      </ScrollView>
    </View>
  );
}
