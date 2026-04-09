import { useState } from 'react';
import Taro, { useDidShow } from '@tarojs/taro';
import { View, Text, ScrollView } from '@tarojs/components';
import { ZenBackground } from '../../components/ZenBackground';
import './index.scss';

export default function Mine() {
  const [stats, setStats] = useState({
    muyu: 0,
    fortune: 0,
    wish: 0
  });

  useDidShow(() => {
    // 获取统计数据 (从 Storage 获取)
    const muyuCount = Taro.getStorageSync('muyu_count') || 0;
    const fortuneCount = Taro.getStorageSync('fortune_count') || 0;
    const wishCount = Taro.getStorageSync('wish_count') || 0;
    setStats({ muyu: muyuCount, fortune: fortuneCount, wish: wishCount });
  });

  const achievements = [
    { label: '累计功德', value: stats.muyu, icon: '🙏' },
    { label: '已解签文', value: stats.fortune, icon: '📜' },
    { label: '流光许愿', value: stats.wish, icon: '✨' },
  ];

  const handleItemClick = (title: string) => {
    const routes: Record<string, string> = {
      '我的修行轨迹': '/packageMine/pages/trace/index',
      '内心修复指南': '/packageMine/pages/guide/index',
      '关于签签有你': '/packageMine/pages/about/index'
    };
    if (routes[title]) {
      Taro.navigateTo({ url: routes[title] });
    } else {
      Taro.showToast({ title: '即将开放', icon: 'none' });
    }
  };

  const menuItems = [
    { title: '我的修行轨迹', icon: '📍' },
    { title: '禅意白名单', icon: '🛡️' },
    { title: '内心修复指南', icon: '🛠️' },
    { title: '关于签签有你', icon: '🍵' },
  ];

  return (
    <View className='mine-page'>
      <ZenBackground />
      
      <ScrollView className='mine-content' scrollY>
        {/* 用户信息卡片 */}
        <View className='user-card'>
          <View className='avatar-box'>
            <View className='avatar-placeholder'>
              <Text>禅</Text>
            </View>
          </View>
          <View className='info-box'>
            <Text className='nickname'>静心修行者</Text>
            <Text className='status'>已步入修行第 1 天</Text>
          </View>
        </View>

        {/* 成就成就区 */}
        <View className='section-title'>成就盘点</View>
        <ScrollView className='achievement-scroll' scrollX enableFlex>
          {achievements.map((item, idx) => (
            <View key={idx} className='achievement-card'>
              <Text className='icon'>{item.icon}</Text>
              <Text className='value'>{item.value}</Text>
              <Text className='label'>{item.label}</Text>
            </View>
          ))}
        </ScrollView>

        {/* 功能菜单 */}
        <View className='menu-list'>
          {menuItems.map((item, idx) => (
            <View key={idx} className='menu-item' onClick={() => handleItemClick(item.title)}>
              <Text className='menu-icon'>{item.icon}</Text>
              <Text className='menu-title'>{item.title}</Text>
              <View className='menu-arrow' />
            </View>
          ))}
        </View>

        <View className='footer'>
          <Text>一花一世界，一叶一菩提</Text>
          <Text className='ver'>v2.0.0 Pure Zen</Text>
        </View>
      </ScrollView>
    </View>
  );
}
