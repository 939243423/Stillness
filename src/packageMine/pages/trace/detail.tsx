import { useState, useEffect } from 'react';
import Taro, { useRouter } from '@tarojs/taro';
import { View, Text, ScrollView } from '@tarojs/components';
import { ZenBackground } from '../../../components/ZenBackground';
import { useTheme } from '../../../hooks/useTheme';
import './detail.scss';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface HistoryRecord {
  id: number;
  level: string;
  echo: string;
  insight: string;
  date: string;
  time: string;
  dialogue: Message[];
}

export default function ResonanceDetail() {
  const themeClass = useTheme();
  const router = useRouter();
  const { id } = router.params;
  const [record, setRecord] = useState<HistoryRecord | null>(null);

  useEffect(() => {
    if (id) {
      const history = Taro.getStorageSync('resonance_history') || [];
      const found = history.find(item => item.id === Number(id));
      if (found) {
        setRecord(found);
      } else {
        Taro.showToast({ title: '未找到共鸣记录', icon: 'none' });
        setTimeout(() => Taro.navigateBack(), 1500);
      }
    }
  }, [id]);

  if (!record) return null;

  return (
    <View className={`detail-page ${themeClass}`}>
      <ZenBackground color={themeClass === 'dark-theme' ? '#000000' : '#FDFCFB'} intensity={0.15} speed={0.05} />
      
      <View className='detail-header'>
        <View className='back-btn' onClick={() => Taro.navigateBack()} />
        <View className='header-info'>
          <Text className='title'>{record.echo}</Text>
          <Text className='subtitle'>{record.date} · 灵魂印记</Text>
        </View>
      </View>

      <ScrollView className='detail-content' scrollY showScrollbar={false} enhanced>
        <View className='insight-card'>
          <View className='card-header'>
            <View className='header-line' />
            <Text className='level'>{record.level}</Text>
          </View>
          <Text className='echo'>“{record.echo}”</Text>
          <Text className='insight'>{record.insight}</Text>
        </View>

        <View className='dialogue-section'>
          <View className='section-divider'>
             <View className='line' />
             <Text className='divider-text'>对话还原</Text>
             <View className='line' />
          </View>

          <View className='chat-list'>
            {record.dialogue.map((msg, idx) => (
              <View key={idx} className={`chat-bubble ${msg.role}`}>
                <Text className='bubble-text'>{msg.content}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className='detail-footer'>
          <Text className='footer-hint'>万物皆有回响，愿你听见内心</Text>
        </View>
      </ScrollView>
    </View>
  );
}
