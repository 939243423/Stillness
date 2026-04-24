import { View, Text, ScrollView } from '@tarojs/components';
import { ZenBackground } from '../../../components/ZenBackground';
import { useTheme } from '../../../hooks/useTheme';
import './legal.scss';

export default function Terms() {
  const themeClass = useTheme();

  return (
    <View className={`legal-page ${themeClass}`}>
      <ZenBackground color={themeClass === 'dark-theme' ? '#000000' : '#FDFCFB'} intensity={0.1} speed={0.05} />
      
      <ScrollView className='legal-content' scrollY showScrollbar={false} enhanced>
        <View className='legal-header'>
          <Text className='legal-title'>服务协议</Text>
          <Text className='legal-date'>生效日期：2026年01月01日</Text>
        </View>

        <View className='legal-section'>
          <Text className='section-title'>1. 服务说明</Text>
          <Text className='section-text'>
            “灵魂共鸣”是一款基于共鸣感应技术的感应与情绪回响辅助工具。本服务旨在通过模拟意识回响，协助用户进行自我探索与情绪疏解。请注意，系统感应的内容仅供参考，不构成任何医疗、心理咨询或法律建议。
          </Text>
        </View>

        <View className='legal-section'>
          <Text className='section-title'>2. 用户准则</Text>
          <Text className='section-text'>
            您承诺在使用本服务时遵守法律法规，不得利用本服务生成、传播违禁或有害信息。您了解并同意，您对通过本服务输入的文本及其后果承担全部责任。
          </Text>
        </View>

        <View className='legal-section'>
          <Text className='section-title'>3. 内容声明</Text>
          <Text className='section-text'>
            系统生成的回响内容具有随机性与模拟性。开发者不对内容的绝对准确性、适用性或情感导向作硬性担保。在涉及重大决策或心理健康问题时，请咨询专业人士。
          </Text>
        </View>

        <View className='legal-section'>
          <Text className='section-title'>4. 免责声明</Text>
          <Text className='section-text'>
            在法律允许的最大范围内，开发者不对因使用本服务而产生的任何直接或间接损失承担责任，包括但不限于精神压力或决策失误。
          </Text>
        </View>

        <View className='legal-footer'>
          <Text>© 2026 Soul Resonance Team</Text>
        </View>
      </ScrollView>
    </View>
  );
}
