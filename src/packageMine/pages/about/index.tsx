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
      <ZenBackground color={themeClass === 'dark-theme' ? '#000000' : '#FDFCFB'} intensity={0.1} speed={0.04} />
      
      <View className='about-container'>
        <View className='about-hero'>
          <View className='logo-box'>
            <View className='logo-glow' />
            <Text className='logo-leaf'>🌿</Text>
          </View>
          <Text className='brand-name'>情绪心旅</Text>
          <Text className='brand-tagline'>静谧 · 洞察 · 归处</Text>
        </View>

        <View className='about-content-grid'>
          <View className='about-item'>
            <Text className='item-label'>品牌愿景</Text>
            <Text className='item-desc'>于喧嚣中，觅得一处意识岛屿。</Text>
          </View>
          <View className='about-item'>
            <Text className='item-label'>心旅哲学</Text>
            <Text className='item-desc'>不提供建议，只为您回响真实的内心。</Text>
          </View>
          <View className='about-item'>
            <Text className='item-label'>隐私声明</Text>
            <Text className='item-desc'>思绪端到端加密，永不存储个人私密文本。</Text>
          </View>
        </View>

        <View className='about-footer'>
          <View className='footer-nav'>
            <Text className='nav-link' onClick={() => Taro.navigateTo({ url: '/packageMine/pages/about/terms' })}>服务协议</Text>
            <Text className='nav-link' onClick={() => Taro.navigateTo({ url: '/packageMine/pages/about/privacy' })}>隐私政策</Text>
          </View>
          <Text className='version-info'>VERSION {version} · MOOD TRIP</Text>
        </View>
      </View>
    </View>
  );
}
