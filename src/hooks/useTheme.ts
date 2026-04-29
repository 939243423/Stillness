import { useState, useEffect } from "react";
import Taro from '@tarojs/taro';
import { STORAGE_KEY } from '../constants';
import { getThemeState } from '../utils';

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const checkTheme = () => {
    const settings = Taro.getStorageSync(STORAGE_KEY.SYSTEM_SETTINGS);
    return getThemeState(settings);
  };

  useEffect(() => {
    const currentTheme = checkTheme();
    setTheme(currentTheme);

    // 同步原生页面背景色，防止滚动露白
    const bgColor = currentTheme === 'dark' ? '#000000' : '#fdfcfb';
    Taro.setBackgroundColor({
      backgroundColor: bgColor,
      backgroundColorTop: bgColor,
      backgroundColorBottom: bgColor,
      success: () => console.log('Background color synced:', bgColor),
      fail: (err) => console.error('Failed to sync background color:', err)
    });

    // 监听设置变化
    const interval = setInterval(() => {
      const nextTheme = checkTheme();
      if (nextTheme !== theme) {
        setTheme(nextTheme);
      }
    }, 2000); 

    return () => clearInterval(interval);
  }, [theme]);

  return theme === 'dark' ? 'dark-theme' : '';
}
