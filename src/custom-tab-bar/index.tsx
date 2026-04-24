import { useState, useCallback, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import './index.scss';

export default function CustomTabBar() {
  const [selected, setSelected] = useState(0);

  const list = [
    {
      pagePath: '/pages/index/index',
      text: '共鸣',
      // iconPath: '../assets/images/tab-resonance.png',
      // selectedIconPath: '../assets/images/tab-resonance-active.png'
    },
    {
      pagePath: '/pages/mine/index',
      text: '我的',
      // iconPath: '../assets/images/tab-mine.png',
      // selectedIconPath: '../assets/images/tab-mine-active.png'
    }
  ];

  // 路径自感知逻辑：通过监听自定义事件来实现无感同步
  useEffect(() => {
    const handleSync = (index: number) => {
      if (index !== selected) {
        setSelected(index);
      }
    };
    Taro.eventCenter.on('syncTabBar', handleSync);
    
    // 首次加载初始化
    const curPages = Taro.getCurrentPages();
    const currPage = curPages[curPages.length - 1];
    const path = '/' + (currPage?.route || '');
    const index = list.findIndex(item => item.pagePath === path);
    if (index !== -1) setSelected(index);

    return () => {
      Taro.eventCenter.off('syncTabBar', handleSync);
    };
  }, [selected]);

  const switchTab = useCallback((index, url) => {
    setSelected(index);
    Taro.switchTab({ url });
  }, []);

  return (
    <View className='custom-tab-bar'>
      {list.map((item, index) => (
        <View 
          key={item.text} 
          className={`tab-item ${selected === index ? 'active' : ''}`}
          onClick={() => switchTab(index, item.pagePath)}
        >
          <View className={`tab-icon-mask ${index === 0 ? 'resonance' : 'mine'}`} />
          <Text className='tab-text'>{item.text}</Text>
        </View>
      ))}
    </View>
  );
}
