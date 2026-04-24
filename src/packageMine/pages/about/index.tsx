import { View, Text, ScrollView } from '@tarojs/components';
import { ZenBackground } from '../../../components/ZenBackground';
import { useTheme } from '../../../hooks/useTheme';
import './index.scss';

export default function About() {
  const themeClass = useTheme();
  const version = 'v1.2.0';

  return (
    <View className={`about-page ${themeClass}`}>
      <ZenBackground color={themeClass === 'dark-theme' ? '#000000' : '#FDFCFB'} intensity={0.15} speed={0.1} />
      
      <ScrollView className='about-content' scrollY showScrollbar={false} enhanced>
        <View className='about-hero'>
          <View className='logo-placeholder'>✨</View>
          <Text className='brand-name'>灵魂共鸣</Text>
          <Text className='version'>{version}</Text>
        </View>

        <View className='about-section'>
          <View className='section-header'>
            <Text className='section-title'>品牌愿景</Text>
          </View>
          <Text className='section-text'>
            在喧嚣的数字时代，我们致力于为每一位行者开辟一片纯净的意识岛屿。通过深度感应技术，让隐藏在琐碎日常下的灵魂频率得以被看见、被回响。
          </Text>
        </View>

        <View className='about-section'>
          <View className='section-header'>
            <Text className='section-title'>技术哲学</Text>
          </View>
          <Text className='section-text'>
            “灵魂共鸣” 搭载了先进的感应算法模型。它不提供教条式的建议，而是通过对文字张力与情感深度的捕捉，模拟出最契合用户当下的意识回响，辅助用户完成自我洞察。
          </Text>
        </View>

        <View className='about-section'>
          <View className='section-header'>
            <Text className='section-title'>隐私安全</Text>
          </View>
          <Text className='section-text'>
            您的每一缕思绪都极为珍贵。所有的对话数据均经过端到端加密处理，仅用于为您生成动态的共鸣反馈，我们承诺永不存储任何可识别个人身份的原始文本。
          </Text>
        </View>

        <View className='about-footer'>
          <Text className='footer-link'>服务协议</Text>
          <View className='divider' />
          <Text className='footer-link'>隐私政策</Text>
          <View className='copyright'>© 2024 Soul Resonance Team</View>
        </View>
      </ScrollView>
    </View>
  );
}
