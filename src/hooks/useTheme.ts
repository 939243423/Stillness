import { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const checkTheme = () => {
    const settings = Taro.getStorageSync('system_settings');
    if (!settings) return 'light';

    if (settings.darkModeManual) {
      return 'dark';
    }

    if (settings.darkModeAuto) {
      // 1. 检查时段 (20:00 - 06:00)
      const hour = new Date().getHours();
      if (hour >= 20 || hour < 6) return 'dark';
      
      // 2. 检查系统主题 (需要基础库支持)
      const systemInfo = Taro.getSystemInfoSync();
      if (systemInfo.theme === 'dark') return 'dark';
    }

    return 'light';
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
