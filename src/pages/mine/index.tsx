import { useState } from 'react';
import Taro, { useDidShow } from '@tarojs/taro';
import { View, Text, ScrollView, Button, Input, Image } from '@tarojs/components';
import { ZenBackground } from '../../components/ZenBackground';
import { useTabActive } from '../../hooks/useTabActive';
import { useTheme } from '../../hooks/useTheme';
import './index.scss';

// SVG Assets for Mine Page
const MINE_ICONS = {
  resonance: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjYThkNWJhIiBzdHJva2Utd2lkdGg9IjEuNSI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMyIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjYiIG9wYWNpdHk9IjAuNiIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjkiIG9wYWNpdHk9IjAuMyIvPjwvc3ZnPg==',
  insight: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjYThkNWJhIiBzdHJva2Utd2lkdGg9IjEuNSI+PHBhdGggZD0iTTEyIDNsMS45IDEuOS40IDIuMS45LjUgMi4xLjQgMS45IDEuOS0xLjkgMS45LS40IDIuMS0uOS41LTIuMS40LTEuOSAxLjktMS45LTEuOS0uNC0yLjEtLjktLjUtMi4xLS40LTEuOS0xLjkgMS45LTEuOS40LTIuMS45LS41IDIuMS0uNCAxLjktMS45eiIvPjwvc3ZnPg==',
  calm: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjYThkNWJhIiBzdHJva2Utd2lkdGg9IjEuNSI+PHBhdGggZD0iTTEyIDIyYzUuNTIgMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMHpNMTIgMnYyMCIvPjwvc3ZnPg==',
  history: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjYmRjM2M3IiBzdHJva2Utd2lkdGg9IjEuNSI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiLz48cGF0aCBkPSJNMTIgNnY2bDQgMiIvPjwvc3ZnPg==',
  config: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjYmRjM2M3IiBzdHJva2Utd2lkdGg9IjIiPjxsaW5lIHgxPSI0IiB5MT0iMjEiIHgyPSI0IiB5Mj0iMTQiLz48bGluZSB4MT0iNCIgeTE9IjEwIiB4Mj0iNCIgeTI9IjMiLz48bGluZSB4MT0iMTIiIHkxPSIyMSIgeDI9IjEyIiB5Mj0iMTIiLz48bGluZSB4MT0iMTIiIHkxPSI4IiB4Mj0iMTIiIHkyPSIzIi8+PGxpbmUgeDE9IjIwIiB5MT0iMjEiIHgyPSIyMCIgeTI9IjE2Ii8+PGxpbmUgeDE9IjIwIiB5MT0iMTIiIHgyPSIyMCIgeTI9IjMiLz48bGluZSB4MT0iMiIgeTE9IjE0IiB4Mj0iNiIgeTI9IjE0Ii8+PGxpbmUgeDE9IjEwIiB5MT0iOCIgeDI9IjE0IiB5Mj0iOCIvPjxsaW5lIHgxPSIxOCIgeTE9IjE2IiB4Mj0iMjIiIHkyPSIxNiIvPjwvc3ZnPg==',
  guide: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjYmRjM2M3IiBzdHJva2Utd2lkdGg9IjEuNSI+PHBhdGggZD0iTTQgMTkuNXYtMTVBMi41IDIuNSAwIDAgMSA2LjUgMkgyMHYyMEg2LjVBMi41IDIuNSAwIDAgMSA2LjUgMTdIMjAiLz48L3N2Zz4=',
  settings: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjYmRjM2M3IiBzdHJva2Utd2lkdGg9IjEuNSI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMyIvPjxwYXRoIGQ9Ik0xOS40IDE1YTEuNjUgMS42NSAwIDAgMCAuMzMgMS44MmwuMDYuMDZhMiAyIDAgMCAxLTIuODMgMi44M2wtLjA2LS4wNmExLjY1IDEuNjUgMCAwIDAtMS44Mi0uMzMgMS42NSAxLjY1IDAgMCAwLTEgMS41di4xYTIgMiAwIDAgMS00IDB2LS4xYTEuNjUgMS42NSAwIDAgMC0xLTEuNSAxLjY1IDEuNjUgMCAwIDAtMS44My4zM2wtLjA2LjA2YTIgMiAwIDAgMS0yLjgzLTIuODNsLjA2LS4wNmExLjY1IDEuNjUgMCAwIDAgLjMzLTEuODIgMS42NSAxLjY1IDAgMCAwLTEuNS0xdi0uMWEyIDIgMCAwIDEgMC00di4xYTEuNjUgMS42NSAwIDAgMCAxLjUtMWExLjY1IDEuNjUgMCAwIDAtLjMzLTEuODJsLS4wNi0uMDZhMiAyIDAgMCAxIDIuODMtMi44M2wuMDYuMDZhMS42NSAxLjY1IDAgMCAwIDEuODIuMzMgMS42NSAxLjY1IDAgMCAwIDEtMS41di0uMWEyIDIgMCAwIDEgNCAwdi4xYTEuNjUgMS42NSAwIDAgMCAxIDEuNSAxLjY1IDEuNjUgMCAwIDAgMS44My4zM2wuMDYuMDZhMiAyIDAgMCAxIDIuODMtMi44M2wtLjA2LjA2YTEuNjUgMS42NSAwIDAgMC0uMzMgMS44MiAxLjY1IDEuNjUgMCAwIDAgMS41IDF6Ii8+PC9zdmc+',
  about: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjYmRjM2M3IiBzdHJva2Utd2lkdGg9IjEuNSI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiLz48cGF0aCBkPSJNMTEgOHY0TTEyIDE2aC4wMSIvPjwvc3ZnPg==',
};

export default function Mine() {
  const themeClass = useTheme();
  const [stats, setStats] = useState({
    resonance: 0,
    insight: 0,
    calm: 0
  });

  const [userInfo, setUserInfo] = useState({
    avatarUrl: '',
    nickName: '灵魂旅行者'
  });

  useTabActive(1);

  useDidShow(() => {
    // 加载统计数据
    const resonanceCount = Taro.getStorageSync('resonance_count') || 0;
    const history = Taro.getStorageSync('resonance_history') || [];
    setStats({ 
      resonance: resonanceCount, 
      insight: history.length,
      calm: Math.floor(resonanceCount * 1.5)
    });

    // 加载用户信息
    const savedInfo = Taro.getStorageSync('user_info');
    if (savedInfo) {
      setUserInfo(savedInfo);
    }
  });

  const onChooseAvatar = (e) => {
    const { avatarUrl } = e.detail;
    setUserInfo(prev => {
      const newInfo = { ...prev, avatarUrl };
      Taro.setStorageSync('user_info', newInfo);
      return newInfo;
    });
  };

  const onNicknameChange = (e) => {
    const nickName = e.detail.value;
    if (!nickName) return;
    setUserInfo(prev => {
      const newInfo = { ...prev, nickName };
      Taro.setStorageSync('user_info', newInfo);
      return newInfo;
    });
  };

const soulInsights = [
    { label: '共鸣次数', value: stats.resonance, icon: MINE_ICONS.resonance },
    { label: '灵魂印记', value: stats.insight, icon: MINE_ICONS.insight },
    { label: '平静指数', value: stats.calm, icon: MINE_ICONS.calm },
  ];

  const handleItemClick = (title: string) => {
    const routes: Record<string, string> = {
      '我的共鸣历史': '/packageMine/pages/trace/index',
      '共鸣空间配置': '/packageMine/pages/config/index',
      '系统设置': '/packageMine/pages/settings/index',
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
    { title: '我的共鸣历史', icon: MINE_ICONS.history },
    { title: '共鸣空间配置', icon: MINE_ICONS.config },
    { title: '系统设置', icon: MINE_ICONS.settings },
    { title: '灵魂感应手册', icon: MINE_ICONS.guide },
    { title: '关于灵魂共鸣', icon: MINE_ICONS.about },
  ];

  return (
    <View className={`mine-page ${themeClass}`}>
      <ZenBackground color={themeClass === 'dark-theme' ? '#000000' : '#FDFCFB'} intensity={0.2} speed={0.1} />
      
      <ScrollView className='mine-content' scrollY showScrollbar={false} enhanced>
        {/* 用户信息卡片 (高阶极简) */}
        <View className='user-card'>
          <Button 
            className='avatar-btn' 
            openType='chooseAvatar' 
            onChooseAvatar={onChooseAvatar}
          >
            <View className='avatar-container'>
              <View className='avatar-glow' />
              {userInfo.avatarUrl ? (
                <Image className='user-avatar' src={userInfo.avatarUrl} mode='aspectFill' />
              ) : (
                <View className='avatar-placeholder'>
                  <Text>Soul</Text>
                </View>
              )}
            </View>
          </Button>
          <View className='info-box'>
            <Input 
              className='nickname-input' 
              type='nickname' 
              value={userInfo.nickName} 
              onBlur={onNicknameChange}
              onInput={onNicknameChange}
              placeholder='输入灵魂昵称'
            />
            <Text className='status'>已与自我共鸣 {stats.resonance} 次</Text>
          </View>
        </View>

        {/* 灵魂数据统计 */}
        <View className='section-title'>灵魂印记</View>
        <View className='stats-grid'>
          {soulInsights.map((item, idx) => (
            <View key={idx} className='stat-card'>
              <Image className='card-icon' src={item.icon} mode='aspectFit' />
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
                <Image className='menu-icon' src={item.icon} mode='aspectFit' />
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
