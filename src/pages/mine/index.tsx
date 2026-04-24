import { useState } from 'react';
import Taro, { useDidShow } from '@tarojs/taro';
import { View, Text, ScrollView } from '@tarojs/components';
import { ZenBackground } from '../../components/ZenBackground';
import { useTabActive } from '../../hooks/useTabActive';
import './index.scss';

export default function Mine() {
  const [stats, setStats] = useState({
    resonance: 0,
    insight: 0,
    calm: 0
  });

  useTabActive(1);

  useDidShow(() => {
    // 从存储中获取最新的数据
    const resonanceCount = Taro.getStorageSync('resonance_count') || 0;
    const history = Taro.getStorageSync('resonance_history') || [];
    setStats({ 
      resonance: resonanceCount, 
      insight: history.length,
      calm: Math.floor(resonanceCount * 1.5)
    });
  });

  const soulInsights = [
    { label: '共鸣次数', value: stats.resonance, iconClass: 'icon-resonance' },
    { label: '灵魂印记', value: stats.insight, iconClass: 'icon-insight' },
    { label: '平静指数', value: stats.calm, iconClass: 'icon-calm' },
  ];

  const handleItemClick = (title: string) => {
    const routes: Record<string, string> = {
      '我的共鸣历史': '/packageMine/pages/trace/index',
      '共鸣空间配置': '/packageMine/pages/config/index',
      '灵魂感应手册': '/packageMine/pages/guide/index',
      '关于灵魂共鸣': '/packageMine/pages/about/index'
    };
    if (routes[title]) {
      Taro.navigateTo({ url: routes[title] });
    } else {
      Taro.showToast({ title: '深度链接校准中', icon: 'none' });
    }
  };

  const menuItems = [
    { title: '我的共鸣历史', iconClass: 'icon-history' },
    { title: '共鸣空间配置', iconClass: 'icon-config' },
    { title: '灵魂感应手册', iconClass: 'icon-guide' },
    { title: '关于灵魂共鸣', iconClass: 'icon-about' },
  ];

  return (
    <View className='mine-page'>
      <ZenBackground color='#FDFCFB' intensity={0.2} speed={0.1} />
      
      <ScrollView className='mine-content' scrollY showScrollbar={false} enhanced>
        {/* 用户信息卡片 (高阶极简) */}
        <View className='user-card'>
          <View className='avatar-container'>
             <View className='avatar-glow' />
             <View className='avatar-placeholder'>
                <Text>Soul</Text>
             </View>
          </View>
          <View className='info-box'>
            <Text className='nickname'>灵魂旅行者</Text>
            <Text className='status'>已与自我共鸣 {stats.resonance} 次</Text>
          </View>
        </View>

        {/* 灵魂数据统计 */}
        <View className='section-title'>灵魂印记</View>
        <View className='stats-grid'>
          {soulInsights.map((item, idx) => (
            <View key={idx} className='stat-card'>
              <View className={`card-icon ${item.iconClass}`} />
              <Text className='card-value'>{item.value}</Text>
              <Text className='card-label'>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* 交互菜单 */}
        <View className='menu-section'>
          {menuItems.map((item, idx) => (
            <View key={idx} className='menu-item' onClick={() => handleItemClick(item.title)}>
              <View className='menu-left'>
                <View className={`menu-icon ${item.iconClass}`} />
                <Text className='menu-title'>{item.title}</Text>
              </View>
              <View className='menu-arrow-icon' />
            </View>
          ))}
        </View>

        <View className='page-footer'>
          <Text className='motto'>万物皆有裂痕，那是光照进来的地方</Text>
          <View className='brand-info'>
            <Text className='brand-name'>SOUL RESONANCE</Text>
            <Text className='ver'>v3.0.0 Premium Flow</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
