import Taro, { useDidShow } from '@tarojs/taro';

/**
 * 自感知 TabBar 活跃状态 Hook
 * @param index 当前页面的 TabBar 索引
 */
export const useTabActive = (index: number) => {
  useDidShow(() => {
    // 通过事件中心通知 TabBar 切换索引
    Taro.eventCenter.trigger('syncTabBar', index);
  });
};
