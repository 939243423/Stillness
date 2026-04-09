import { View, Text } from '@tarojs/components';
import { useDidShow } from '@tarojs/taro';
import './index.scss';

export default function Trace() {
  useDidShow(() => {
    // 逻辑占位
  });

  return (
    <View className='placeholder-page'>
      <Text className='title'>修行轨迹</Text>
      <Text className='content'>记录您的每一次心静时刻...</Text>
    </View>
  );
}
