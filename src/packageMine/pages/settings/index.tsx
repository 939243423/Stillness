import { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, ScrollView } from '@tarojs/components';
import { ZenBackground } from '../../../components/ZenBackground';
import { useTheme } from '../../../hooks/useTheme';
import { DEFAULT_SYSTEM_SETTINGS, STORAGE_KEY } from '../../../constants';
import './index.scss';

const SOUNDS = [
  { id: 'off', label: '静谧 (无声)' },
  { id: 'rain', label: '空灵雨声' },
  { id: 'white_noise', label: '纯净白噪' },
  { id: 'forest', label: '森林晨曦' },
];

const SPEEDS = [
  { id: 'slow', label: '沉静', value: 0.1 },
  { id: 'normal', label: '均衡', value: 0.25 },
  { id: 'fast', label: '灵动', value: 0.6 },
];

export default function Settings() {
  const themeClass = useTheme();
  const [settings, setSettings] = useState(DEFAULT_SYSTEM_SETTINGS);

  useEffect(() => {
    const saved = Taro.getStorageSync(STORAGE_KEY.SYSTEM_SETTINGS);
    if (saved) {
      setSettings(prev => ({
        ...prev,
        ...saved
      }));
    }
  }, []);

  const saveSettings = (newSettings: typeof settings) => {
    setSettings(newSettings);
    Taro.setStorageSync(STORAGE_KEY.SYSTEM_SETTINGS, newSettings);
    Taro.vibrateShort({ type: 'medium' });
    Taro.showToast({ title: '系统设置已更新', icon: 'success' });
  };

  return (
    <View className={`settings-page ${themeClass}`}>
      <ZenBackground color={themeClass === 'dark-theme' ? '#000000' : '#FDFCFB'} intensity={0.15} speed={0.1} />
      
      <View className='settings-header'>
         <Text className='title'>系统设置</Text>
         <Text className='subtitle'>优化您的感官与交互环境</Text>
      </View>

      <ScrollView className='settings-content' scrollY>
        <View className='settings-section'>
          <View className='section-header'>
            <Text className='section-title'>氛围音效</Text>
            <Text className='section-desc'>在共鸣感应开启时自动播放</Text>
          </View>
          <View className='option-list'>
            {SOUNDS.map(item => (
              <View 
                key={item.id} 
                className={`option-item ${settings.ambientSound === item.id ? 'active' : ''}`}
                onClick={() => saveSettings({ ...settings, ambientSound: item.id })}
              >
                <Text className='option-label'>{item.label}</Text>
                <View className='option-radio'>
                  <View className='radio-inner' />
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className='settings-section'>
          <View className='section-header'>
            <Text className='section-title'>流光速度</Text>
            <Text className='section-desc'>调整背景背景频率的流动感</Text>
          </View>
          <View className='option-list'>
            {SPEEDS.map(item => (
              <View 
                key={item.id} 
                className={`option-item ${settings.flowSpeed === item.id ? 'active' : ''}`}
                onClick={() => saveSettings({ ...settings, flowSpeed: item.id })}
              >
                <Text className='option-label'>{item.label}</Text>
                <View className='option-radio'>
                  <View className='radio-inner' />
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className='settings-section'>
          <View className='section-header'>
            <Text className='section-title'>黑夜模式 (Night Mode)</Text>
            <Text className='section-desc'>在暗光环境下获得更舒适的感官体验</Text>
          </View>
          <View className='option-list'>
            <View 
              className={`option-item ${settings.darkModeManual ? 'active' : ''}`}
              onClick={() => saveSettings({ 
                ...settings, 
                darkModeManual: !settings.darkModeManual,
                darkModeAuto: false // 互斥
              })}
            >
              <View className='label-group'>
                <Text className='option-label'>强制开启黑夜模式</Text>
                <Text className='option-desc'>手动切换至真黑背景色调</Text>
              </View>
              <View className='option-radio'>
                <View className='radio-inner' />
              </View>
            </View>
            <View 
              className={`option-item ${settings.darkModeAuto ? 'active' : ''}`}
              onClick={() => saveSettings({ 
                ...settings, 
                darkModeAuto: !settings.darkModeAuto,
                darkModeManual: false // 互斥
              })}
            >
              <View className='label-group'>
                <Text className='option-label'>根据系统/时间自动切换</Text>
                <Text className='option-desc'>智能识别环境光线或当前时段</Text>
              </View>
              <View className='option-radio'>
                <View className='radio-inner' />
              </View>
            </View>
          </View>
        </View>

        <View className='settings-footer'>
          <Text className='footer-hint'>系统设置实时生效</Text>
        </View>
      </ScrollView>
    </View>
  );
}
