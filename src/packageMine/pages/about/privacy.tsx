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
            本服务无需注册即可使用。我们仅在必要时获取微信公开的基础信息（头像、昵称），用于为您提供个性化的心旅体验。所有感应文本仅在内存中处理用于回响生成，我们承诺不进行持久化存储或第三方共享。我们不会主动收集您的手机号、地理位置或联系人等敏感隐私信息。
          </Text>
        </View>

        <View className='legal-section'>
          <Text className='section-title'>2. 信息处理与加密</Text>
          <Text className='section-text'>
            “情绪心旅”极度重视您的个人信息安全。我们承诺采用行业领先的加密技术（端到端加密），确保您的感应记录及对话内容在传输与处理过程中的绝对私密。系统在生成回响后，会采取脱敏技术处理即时对话缓存。
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
          <Text>© 2026 Mood Trip Team</Text>
        </View>
      </ScrollView>
    </View>
  );
}
