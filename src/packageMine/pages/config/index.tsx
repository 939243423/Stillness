import { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, ScrollView } from '@tarojs/components';
import { ZenBackground } from '../../../components/ZenBackground';
import './index.scss';

const ARCHETYPES = [
  { id: 'warm', name: '温暖感应者', icon: '☀️', desc: '温柔且充满力量的回应' },
  { id: 'cyber', name: '赛博修行者', icon: '⛩️', desc: '极简且富有禅意的智语' },
  { id: 'silent', name: '寂静观察者', icon: '🌌', desc: '静默中观察灵魂的起伏' },
  { id: 'druid', name: '森林德鲁伊', icon: '🌿', desc: '自然且具有深度的洞察' },
];

const TONES = [
  { id: 'gentle', label: '温和委婉' },
  { id: 'direct', label: '直抵核心' },
  { id: 'poetic', label: '极简诗意' },
];

const MEMORY_MODES = [
  { id: 'continuous', label: '深度记忆', desc: '保持多轮对话连贯性' },
  { id: 'instant', label: '即时感应', desc: '每一轮都是全新开始' },
];

export default function Config() {
  const [config, setConfig] = useState({
    archetype: '温暖感应者',
    tone: '温和委婉',
    coreMemory: 'continuous'
  });

  useEffect(() => {
    const saved = Taro.getStorageSync('resonance_config');
    if (saved) {
      setConfig(prev => ({
        ...prev,
        ...saved
      }));
    }
  }, []);

  const saveConfig = (newConfig: typeof config) => {
    setConfig(newConfig);
    Taro.setStorageSync('resonance_config', newConfig);
    Taro.vibrateShort({ type: 'medium' });
    Taro.showToast({ title: '共鸣频率已同步' });
  };

  return (
    <View className='config-page'>
      <ZenBackground color='#FDFCFB' intensity={0.15} speed={0.1} />
      
      <View className='config-header'>
         <Text className='title'>共鸣配置</Text>
         <Text className='subtitle'>定制专属您的灵魂原型与感应策略</Text>
      </View>

      <ScrollView className='config-content' scrollY>
        <View className='config-section'>
          <View className='section-header'>
            <Text className='section-title'>灵魂原型</Text>
            <Text className='section-desc'>决定共鸣的基础性格与角色</Text>
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

        <View className='config-section'>
          <View className='section-header'>
            <Text className='section-title'>记忆模式</Text>
            <Text className='section-desc'>控制共鸣感应的上下文连贯性</Text>
          </View>
          <View className='tone-list'>
            {MEMORY_MODES.map(item => (
              <View 
                key={item.id} 
                className={`tone-item ${config.coreMemory === item.id ? 'active' : ''}`}
                onClick={() => saveConfig({ ...config, coreMemory: item.id })}
              >
                <View className='label-group'>
                  <Text className='tone-label'>{item.label}</Text>
                  <Text className='tone-desc'>{item.desc}</Text>
                </View>
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
