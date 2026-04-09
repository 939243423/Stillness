import { useState, useCallback } from 'react';
import Taro, { useDidShow } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import './index.scss';

export default function CustomTabBar() {
  const [selected, setSelected] = useState(0);

  const list = [
    {
      pagePath: '/pages/index/index',
      text: '首页',
      iconPath: '/assets/images/tab-home.png',
      selectedIconPath: '/assets/images/tab-home-active.png'
    },
    {
      pagePath: '/pages/mine/index',
      text: '修行',
      iconPath: '/assets/images/tab-mine.png',
      selectedIconPath: '/assets/images/tab-mine-active.png'
    }
  ];

  // 路径自感知逻辑
  useDidShow(() => {
    const curPages = Taro.getCurrentPages();
    const currPage = curPages[curPages.length - 1];
    const path = '/' + (currPage?.route || '');
    const index = list.findIndex(item => item.pagePath === path);
    if (index !== -1 && index !== selected) {
      setSelected(index);
    }
  });

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
          <Image 
            className='tab-icon'
            src={selected === index ? item.selectedIconPath : item.iconPath} 
          />
          <Text className='tab-text'>{item.text}</Text>
          {selected === index && <View className='tab-active-dot' />}
        </View>
      ))}
    </View>
  );
}
