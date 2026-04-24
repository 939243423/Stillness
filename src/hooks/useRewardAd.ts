import { useState, useCallback, useRef, useEffect } from 'react';
import Taro from '@tarojs/taro';

/**
 * 激励视频广告自定义 Hook
 * @param adUnitId 广告单元 ID
 */
export const useRewardAd = (adUnitId: string = 'YOUR_AD_UNIT_ID') => {
  const [isEnded, setIsEnded] = useState(false);
  const [loading, setLoading] = useState(false);
  const videoAd = useRef<any>(null);
  const isUnmounted = useRef(false);

  useEffect(() => {
    isUnmounted.current = false;
    
    // 如果是占位 ID 或非小程序环境，不进行真实初始化，直接使用 Mock 模式
    const isPlaceholder = adUnitId === 'YOUR_AD_UNIT_ID';
    if (isPlaceholder) {
      console.warn('当前使用占位 AdUnitID，广告功能将处于 Mock 模式。');
      return;
    }

    if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP && Taro.createRewardedVideoAd) {
      try {
        videoAd.current = Taro.createRewardedVideoAd({ adUnitId });
        
        const onEnd = (res) => {
          if (isUnmounted.current) return;
          if (res && res.isEnded) {
            setIsEnded(true);
          } else {
            Taro.showToast({ title: '由于广告未看完，无法获取结果', icon: 'none' });
            setIsEnded(false);
          }
        };

        const onError = (err) => {
          console.warn('广告预加载失败 (静默忽略):', err);
        };

        videoAd.current.onClose(onEnd);
        videoAd.current.onError(onError);

        return () => {
          isUnmounted.current = true;
          if (videoAd.current) {
            videoAd.current.offClose(onEnd);
            videoAd.current.offError(onError);
          }
        };
      } catch (e) {
        console.warn('广告组件初始化失败:', e);
      }
    }
  }, [adUnitId]);

  const showAd = useCallback(async () => {
    if (isUnmounted.current) return true;
    setLoading(true);
    setIsEnded(false);

    // Mock 模式：组件未初始化、占位 ID 或处于 IDE 环境
    const isIDE = Taro.getSystemInfoSync().platform === 'devtools';
    if (!videoAd.current || adUnitId === 'YOUR_AD_UNIT_ID' || isIDE) {
      await new Promise(resolve => setTimeout(resolve, 600)); // 模拟快速加载
      setIsEnded(true);
      setLoading(false);
      return true;
    }

    try {
      await videoAd.current.load();
      await videoAd.current.show();
      setLoading(false);
      return false; // 等待 onClose 回调
    } catch (err) {
      Taro.showToast({ title: '共鸣感应中...', icon: 'loading', duration: 800 });
      setIsEnded(true);
      setLoading(false);
      return true;
    }
  }, [adUnitId]);

  return { showAd, isEnded, loading };
};
