import { View, Text } from '@tarojs/components';
import { ZenBackground } from '../../../components/ZenBackground';
import { useTheme } from '../../../hooks/useTheme';
import './index.scss';

const GUIDE_SECTIONS = [
  {
    title: '第一章：情绪回响',
    subtitle: 'THE ECHO PRINCIPLE',
    content: '心旅并非单向的情绪宣泄，而是一场温暖的能量交换。系统捕捉您的心绪频率，并以更有温度的回响反馈予你。',
    icon: '🍃'
  },
  {
    title: '第二章：心流技法',
    subtitle: 'SENSING TECHNIQUES',
    content: '无需刻意修饰。真实、琐碎的心绪往往蕴含着最深层的自。闭上双眼，感受此时此刻的呼吸，随心而动。',
    icon: '🫧'
  },
  {
    title: '第三章：深度沉淀',
    subtitle: 'DEEP RESONANCE',
    content: '每一次对话都是一次心灵的洗牌。通过多维度的感知，你将逐渐剥离表层的喧嚣，触碰到核心的宁静。',
    icon: '🌙'
  }
];

export default function Guide() {
  const themeClass = useTheme();
  return (
    <View className={`guide-page ${themeClass}`}>
      <ZenBackground color={themeClass === 'dark-theme' ? '#000000' : '#FDFCFB'} intensity={0.15} speed={0.1} />
      
      <View className='guide-header'>
        <Text className='title'>情绪感应手册</Text>
        <View className='title-line' />
        <Text className='subtitle'>开启您的深度心旅之旅</Text>
      </View>

      <View className='guide-main'>
        {GUIDE_SECTIONS.map((section, index) => (
          <View key={index} className='guide-card'>
            <View className='card-icon-box'>
              <Text className='card-icon'>{section.icon}</Text>
            </View>
            <View className='card-body'>
              <View className='card-header-inner'>
                <Text className='card-title'>{section.title}</Text>
                <Text className='card-sub'>{section.subtitle}</Text>
              </View>
              <Text className='card-content'>{section.content}</Text>
            </View>
          </View>
        ))}
      </View>
      
      <View className='guide-footer'>
        <Text className='footer-tag'>— 顺其自然 · 水到渠成 —</Text>
      </View>
    </View>
  );
}
