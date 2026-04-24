import { View, Text, Image } from '@tarojs/components';
import bearImg from '../../assets/images/bear.png';
import './index.scss';

interface ResonanceTipProps {
  show: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export const ResonanceTip = ({ 
  show, 
  onClose, 
  title = '开启感应',
  message = '每一粒思绪的种子都需要文字的灌溉。请先在输入框写下您此刻的心情，再开启灵魂共鸣吧。' 
}: ResonanceTipProps) => {
  if (!show) return null;

  return (
    <View className='resonance-tip-overlay' onClick={onClose}>
      <View className='tip-card' onClick={(e) => e.stopPropagation()}>
        <View className='bear-container'>
          <Image 
            className='bear-image' 
            src={bearImg}
            mode='aspectFit'
          />
        </View>
        <View className='tip-content'>
          <Text className='tip-title'>{title}</Text>
          <Text className='tip-message'>{message}</Text>
        </View>
        <View className='tip-action' onClick={onClose}>
          <Text className='action-text'>我知道了</Text>
        </View>
      </View>
    </View>
  );
};
