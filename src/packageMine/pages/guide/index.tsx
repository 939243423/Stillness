import { useState } from 'react';
import { View, Text } from '@tarojs/components';
import { ZenBackground } from '../../../components/ZenBackground';
import { useTheme } from '../../../hooks/useTheme';
import './index.scss';

const GUIDE_SECTIONS = [
  {
    num: '01',
    title: '情绪回响',
    fullTitle: '第一章：回响定律',
    content: '心旅并非单向的情绪宣泄，而是一场深度的能量交换。当您将真诚的思绪投射，系统会捕捉其中的频率，并以更有温度、更具洞察的回响反馈予你。'
  },
  {
    num: '02',
    title: '心流技法',
    fullTitle: '第二章：感应技法',
    content: '无需刻意修饰言辞。那些真实的、琐碎甚至是混乱的心绪，往往蕴含着最深层的自我觉察。闭上双眼，感受呼吸，让指尖随心而动。'
  },
  {
    num: '03',
    title: '深度沉淀',
    fullTitle: '第三章：深度共振',
    content: '每一次对话都是一次心灵的洗牌。通过连续的、多维度的感知交互，你将逐渐剥离表层的喧嚣，触碰到核心的宁静。'
  }
];

export default function Guide() {
  const themeClass = useTheme();
  const [activeItem, setActiveItem] = useState<typeof GUIDE_SECTIONS[0] | null>(null);

  return (
    <View className={`guide-page ${themeClass}`}>
      <ZenBackground color={themeClass === 'dark-theme' ? '#000000' : '#FDFCFB'} intensity={0.1} speed={0.05} />
      
      {/* 增加装饰性光影背景 */}
      <View className='decoration-layer'>
        <View className='glow-orb orb-1' />
        <View className='glow-orb orb-2' />
        <View className='leaf-shadow shadow-1'>🍃</View>
        <View className='leaf-shadow shadow-2'>🌿</View>
      </View>
      
      <View className='guide-container'>
        <View className='guide-header'>
          <Text className='title'>感应手册</Text>
          <Text className='subtitle'>INDICATION GUIDE & RESONANCE</Text>
        </View>

        <View className='guide-list'>
          {GUIDE_SECTIONS.map((item, index) => (
            <View key={index} className='guide-item' onClick={() => setActiveItem(item)}>
              <View className='item-num-bg'>{item.num}</View>
              <Text className='item-num'>{item.num}</Text>
              <Text className='item-title'>{item.title}</Text>
              <View className='item-arrow' />
            </View>
          ))}
        </View>
        
        <View className='guide-footer'>
          <View className='moon-phases'>
            <Text className='moon'>🌑</Text>
            <Text className='moon active'>🌒</Text>
            <Text className='moon'>🌓</Text>
            <Text className='moon'>🌔</Text>
            <Text className='moon'>🌕</Text>
          </View>
          <Text className='footer-text'>情緒心旅 · 治愈回响</Text>
        </View>
      </View>

      {/* 极简详情弹窗 */}
      {activeItem && (
        <View className='guide-modal' onClick={() => setActiveItem(null)}>
          <View className='modal-mask' />
          <View className='modal-card' onClick={(e) => e.stopPropagation()}>
            <Text className='modal-num'>{activeItem.num}</Text>
            <Text className='modal-title'>{activeItem.fullTitle}</Text>
            <Text className='modal-content'>{activeItem.content}</Text>
            <View className='modal-close' onClick={() => setActiveItem(null)}>
              <Text className='close-text'>知晓</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
