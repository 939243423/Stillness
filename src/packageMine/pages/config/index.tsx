import { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, ScrollView } from '@tarojs/components';
import { ZenBackground } from '../../../components/ZenBackground';
import './index.scss';

const ARCHETYPES = [
  { id: 'healer', name: '温暖感应者', desc: '语气温和，像深夜的一盏明灯', icon: '🕯️' },
  { id: 'philosopher', name: '冷峻哲学家', desc: '言简意赅，充满深层智慧洞察', icon: '🌓' },
  { id: 'mentor', name: '严厉导师', desc: '直指人心，不避讳痛点与真实', icon: '⚔️' },
  { id: 'friend', name: '感性共鸣者', desc: '情感充沛，像老友般的亲切倾听', icon: '🌿' },
];

const TONES = [
  { id: 'gentle', label: '温和委婉' },
  { id: 'direct', label: '直接犀利' },
  { id: 'poetic', label: '极简诗意' },
];

export default function Config() {
  const [config, setConfig] = useState({
    archetype: '温暖感应者',
    tone: '温和委婉'
  });

  useEffect(() => {
    const saved = Taro.getStorageSync('resonance_config');
    if (saved) setConfig(saved);
  }, []);

  const saveConfig = (newConfig: typeof config) => {
    setConfig(newConfig);
    Taro.setStorageSync('resonance_config', newConfig);
    Taro.vibrateShort({ type: 'medium' });
    Taro.showToast({ title: '共鸣频率已同步', icon: 'success' });
  };

  return (
    <View className='config-page'>
      <ZenBackground color='#FDFCFB' intensity={0.15} speed={0.1} />
      
      <View className='config-header'>
         <Text className='title'>共鸣空间配置</Text>
         <Text className='subtitle'>定制专属您的灵魂原型</Text>
      </View>

      <ScrollView className='config-content' scrollY>
        <View className='config-section'>
          <View className='section-header'>
            <Text className='section-title'>灵魂原型</Text>
            <Text className='section-desc'>决定 AI 的基础性格与角色</Text>
          </View>
          
          <View className='archetype-grid'>
            {ARCHETYPES.map(item => (
              <View 
                key={item.id} 
                className={`archetype-card ${config.archetype === item.name ? 'active' : ''}`}
                onClick={() => saveConfig({ ...config, archetype: item.name })}
              >
                <View className='card-glow' />
                <Text className='card-icon'>{item.icon}</Text>
                <Text className='card-name'>{item.name}</Text>
                <Text className='card-desc'>{item.desc}</Text>
                {config.archetype === item.name && <View className='active-badge' />}
              </View>
            ))}
          </View>
        </View>

        <View className='config-section'>
          <View className='section-header'>
            <Text className='section-title'>感应语气</Text>
            <Text className='section-desc'>调整对话的表达力度与风格</Text>
          </View>
          
          <View className='tone-list'>
            {TONES.map(item => (
              <View 
                key={item.id} 
                className={`tone-item ${config.tone === item.label ? 'active' : ''}`}
                onClick={() => saveConfig({ ...config, tone: item.label })}
              >
                <Text className='tone-label'>{item.label}</Text>
                <View className='tone-radio'>
                  <View className='radio-inner' />
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className='config-footer'>
          <Text className='footer-hint'>配置将在下一次开启共鸣时生效</Text>
        </View>
      </ScrollView>
    </View>
  );
}
