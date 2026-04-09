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

  useEffect(() => {
    // 只有在小程序环境下初始化
    if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP && Taro.createRewardedVideoAd) {
      videoAd.current = Taro.createRewardedVideoAd({ adUnitId });
      
      const onEnd = (res) => {
        if (res && res.isEnded) {
          setIsEnded(true);
        } else {
          Taro.showToast({ title: '由于广告未看完，无法获取结果', icon: 'none' });
          setIsEnded(false);
        }
      };

      videoAd.current.onClose(onEnd);
      return () => {
        if (videoAd.current) {
          videoAd.current.offClose(onEnd);
        }
      };
    }
  }, [adUnitId]);

  const showAd = useCallback(async () => {
    setLoading(true);
    setIsEnded(false);

    // Mock 逻辑：如果是非小程序环境或广告组件不可用，直接通过
    if (!videoAd.current) {
      console.log('广告组件不可用，进入 Mock 模式');
      await new Promise(resolve => setTimeout(resolve, 800)); // 模拟加载
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
      console.error('广告加载失败', err);
      Taro.showToast({ title: '广告加载失败，已为你跳过', icon: 'none' });
      setIsEnded(true);
      setLoading(false);
      return true;
    }
  }, []);

  return { showAd, isEnded, loading };
};
