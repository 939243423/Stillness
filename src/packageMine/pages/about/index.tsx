import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { useTheme } from '../../../hooks/useTheme';
import { ZenBackground } from '../../../components/ZenBackground';
import './index.scss';

export default function About() {
  const themeClass = useTheme();
  const version = 'v1.2.0';

  return (
    <View className={`about-page ${themeClass}`}>
      <ZenBackground color={themeClass === 'dark-theme' ? '#000000' : '#FDFCFB'} intensity={0.15} speed={0.05} />
      
      <View className='about-container'>
        <View className='about-hero'>
          <View className='logo-box'>
            <View className='logo-aura' />
            <Text className='logo-icon'>🌿</Text>
          </View>
          <Text className='brand-name'>情绪心旅</Text>
          <Text className='version'>{version}</Text>
        </View>

        <View className='about-body'>
          <View className='about-section'>
            <Text className='section-title'>品牌愿景</Text>
            <Text className='section-text'>
              在喧嚣时代，开辟一片纯净的意识岛屿。让隐藏在日常下的情绪频率得以被看见、被回响。
            </Text>
          </View>

          <View className='about-section'>
            <Text className='section-title'>心旅哲学</Text>
            <Text className='section-text'>
              搭载温情的回响机制。不提供教条建议，而是通过细腻的情感捕捉，辅助您完成深度的自我洞察。
            </Text>
          </View>

          <View className='about-section'>
            <Text className='section-title'>隐私安全</Text>
            <Text className='section-text'>
              心绪弥足珍贵。所有对话端到端加密，承诺永不存储任何可识别个人身份的原始文本。
            </Text>
          </View>
        </View>

        <View className='about-footer'>
          <View className='legal-links'>
            <Text className='link' onClick={() => Taro.navigateTo({ url: '/packageMine/pages/about/terms' })}>服务协议</Text>
            <View className='dot' />
            <Text className='link' onClick={() => Taro.navigateTo({ url: '/packageMine/pages/about/privacy' })}>隐私政策</Text>
          </View>
          <Text className='copyright'>© 2026 Mood Trip Team</Text>
        </View>
      </View>
    </View>
  );
}
