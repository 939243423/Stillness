import { View, Text, ScrollView } from '@tarojs/components';
import { ZenBackground } from '../../../components/ZenBackground';
import { useTheme } from '../../../hooks/useTheme';
import './legal.scss';

export default function Privacy() {
  const themeClass = useTheme();

  return (
    <View className={`legal-page ${themeClass}`}>
      <ZenBackground color={themeClass === 'dark-theme' ? '#000000' : '#FDFCFB'} intensity={0.1} speed={0.05} />
      
      <ScrollView className='legal-content' scrollY showScrollbar={false} enhanced>
        <View className='legal-header'>
          <Text className='legal-title'>隐私政策</Text>
          <Text className='legal-date'>生效日期：2026年01月01日</Text>
        </View>

        <View className='legal-section'>
          <Text className='section-title'>1. 数据收集</Text>
          <Text className='section-text'>
            我们深知隐私的重要性。本应用坚持“极简数据”原则：除了出于为您提供回响体验所必须的即时输入内容外，我们不会主动收集您的手机号、地理位置或联系人等敏感隐私信息。
          </Text>
        </View>

        <View className='legal-section'>
          <Text className='section-title'>2. 信息处理与加密</Text>
          <Text className='section-text'>
            您在“共鸣感应”中输入的文本，会立即同步至共鸣中枢进行处理。整个传输路径均经过端到端 SSL 加密。系统在生成回响后，会采取脱敏技术处理即时对话缓存。
          </Text>
        </View>

        <View className='legal-section'>
          <Text className='section-title'>3. 关于存储</Text>
          <Text className='section-text'>
            您的对话历史仅保存在您的本地设备中（除非您手动备份或导出）。我们不在服务器端持久化存储您的任何原始文本消息。
          </Text>
        </View>

        <View className='legal-section'>
          <Text className='section-title'>4. 用户权利</Text>
          <Text className='section-text'>
            您可以随时通过“清除数据”或卸载应用来删除保存在本地的所有痕迹。在本应用中，您的意识主权完全归您所有。
          </Text>
        </View>

        <View className='legal-footer'>
          <Text>© 2026 Soul Resonance Team</Text>
        </View>
      </ScrollView>
    </View>
  );
}
