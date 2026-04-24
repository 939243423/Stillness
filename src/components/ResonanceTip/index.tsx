import { View, Text, Image } from '@tarojs/components';
import './index.scss';

interface ResonanceTipProps {
  show: boolean;
  onClose: () => void;
  message?: string;
}

export const ResonanceTip = ({ show, onClose, message = '想对自己说点什么吗？' }: ResonanceTipProps) => {
  if (!show) return null;

  return (
    <View className='resonance-tip-overlay' onClick={onClose}>
      <View className='tip-card' onClick={(e) => e.stopPropagation()}>
        <View className='bear-container'>
          <Image 
            className='bear-image' 
            src='file:///C:/Users/杜若/.gemini/antigravity/brain/abb107d8-462d-4de5-827d-814003e641ea/polar_bear_heart_hug_1777000146452.png'
            mode='aspectFit'
          />
        </View>
        <Text className='tip-message'>{message}</Text>
        <View className='tip-action' onClick={onClose}>
          <Text className='action-text'>我知道了</Text>
        </View>
      </View>
    </View>
  );
};
