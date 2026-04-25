import { useState, useCallback, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import './index.scss';

// SVG Assets
const ICONS = {
  resonance: {
    inactive: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjYmRjM2M3IiBzdHJva2Utd2lkdGg9IjEuNSI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMyIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjYiIG9wYWNpdHk9IjAuNiIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjkiIG9wYWNpdHk9IjAuMyIvPjwvc3ZnPg==',
    active: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjYThkNWJhIiBzdHJva2Utd2lkdGg9IjEuNSI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMyIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjYiIG9wYWNpdHk9IjAuNiIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjkiIG9wYWNpdHk9IjAuMyIvPjwvc3ZnPg=='
  },
  mine: {
    inactive: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjYmRjM2M3IiBzdHJva2Utd2lkdGg9IjEuNSI+PHBhdGggZD0iTTIwIDIxdi0yYTQgNCAwIDAgMC00LTRIOGE0IDQgMCAwIDAtNCA0djIiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjciIHI9IjQiLz48L3N2Zz4=',
    active: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjYThkNWJhIiBzdHJva2Utd2lkdGg9IjEuNSI+PHBhdGggZD0iTTIwIDIxdi0yYTQgNCAwIDAgMC00LTRIOGE0IDQgMCAwIDAtNCA0djIiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjciIHI9IjQiLz48L3N2Zz4='
  }
};

export default function CustomTabBar() {
  const [selected, setSelected] = useState(0);

  const list = [
    {
      pagePath: '/pages/index/index',
      text: '共鸣',
      key: 'resonance'
    },
    {
      pagePath: '/pages/mine/index',
      text: '我的',
      key: 'mine'
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
          <Image 
            className='tab-icon' 
            mode='aspectFit'
            src={selected === index ? ICONS[item.key].active : ICONS[item.key].inactive} 
          />
          <Text className='tab-text'>{item.text}</Text>
        </View>
      ))}
    </View>
  );
}
