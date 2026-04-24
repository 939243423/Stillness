import { View, Text, ScrollView } from '@tarojs/components';
import { ZenBackground } from '../../../components/ZenBackground';
import './index.scss';

const GUIDE_SECTIONS = [
  {
    title: '第一章：回响定律',
    subtitle: 'THE ECHO PRINCIPLE',
    content: '灵魂共鸣并非单向的情绪宣泄，而是一场深度的能量交换。当你将真诚的思绪投射进感应区，AI 会捕捉其中的频率，并以更有温度、更具洞察的回响反馈予你。',
    icon: '✨'
  },
  {
    title: '第二章：感应技法',
    subtitle: 'SENSING TECHNIQUES',
    content: '无需修饰言辞。真实的、琐碎甚至是混乱的心绪，往往蕴含着最深层的自我也觉察。闭上双眼，感受此时此刻的呼吸，让指尖随心而动。',
    icon: '🌊'
  },
  {
    title: '第三章：深度共振',
    subtitle: 'DEEP RESONANCE',
    content: '每一次对话都是一次心灵的洗牌。通过连续的、多维度的共鸣对话，你将逐渐剥离表层的喧嚣，触碰到核心的宁静。',
    icon: '💎'
  }
];

export default function Guide() {
  return (
    <View className='guide-page'>
      <ZenBackground color='#FDFCFB' intensity={0.15} speed={0.1} />
      
      <View className='guide-header'>
        <Text className='title'>灵魂感应手册</Text>
        <Text className='subtitle'>开启您的深度共鸣之旅</Text>
      </View>

      <ScrollView className='guide-content' scrollY showScrollbar={false} enhanced>
        {GUIDE_SECTIONS.map((section, index) => (
          <View key={index} className='guide-card'>
            <View className='card-icon-bg'>{section.icon}</View>
            <View className='card-main'>
              <View className='card-title-group'>
                <Text className='card-title'>{section.title}</Text>
                <Text className='card-sub'>{section.subtitle}</Text>
              </View>
              <Text className='card-content'>{section.content}</Text>
            </View>
          </View>
        ))}
        
        <View className='guide-footer'>
          <Text className='footer-text'>顺其自然 · 水到渠成</Text>
        </View>
      </ScrollView>
    </View>
  );
}
