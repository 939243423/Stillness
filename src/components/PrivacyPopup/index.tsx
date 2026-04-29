import { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components';
import { useTheme } from '../../hooks/useTheme';
import './index.scss';

// 全局标记，确保在小程序本次运行期间只主动检查一次
let hasProactiveChecked = false;

export const PrivacyPopup = () => {
  const [show, setShow] = useState(false);
  const [resolvePrivacyAuthorization, setResolvePrivacyAuthorization] = useState<any>(null);
  const themeClass = useTheme();

  useEffect(() => {
    // 1. 主动检查：结合 getPrivacySetting 和 requirePrivacyAuthorize
    if (!hasProactiveChecked && Taro.getPrivacySetting) {
      hasProactiveChecked = true; 
      
      Taro.getPrivacySetting({
        success: (res) => {
          console.log('>>> 隐私授权状态查询:', res);
          if (res.needAuthorization) {
            // 确实需要授权，主动触发拦截
            if (Taro.requirePrivacyAuthorize) {
              Taro.requirePrivacyAuthorize();
            } else {
              // 降级方案：如果不支持 require 接口，直接弹窗
              setShow(true);
            }
          }
        }
      });
    }

    // 2. 被动监听：实时拦截敏感操作（如 chooseAvatar）
    let listener: any = null;
    if (Taro.onNeedPrivacyAuthorization) {
      listener = Taro.onNeedPrivacyAuthorization((resolve) => {
        console.log('>>> 触发隐私拦截');
        setShow(true);
        setResolvePrivacyAuthorization(() => resolve);
      });
    }

    return () => {
      if (listener && listener.deregister) {
        listener.deregister();
      }
    };
  }, []);

  const handleAgree = () => {
    setShow(false);
    Taro.eventCenter.trigger('privacyAgreed');
    if (resolvePrivacyAuthorization) {
      resolvePrivacyAuthorization({ buttonId: 'agree-btn', event: 'agree' });
    }
  };

  const handleDisagree = () => {
    setShow(false);
    if (resolvePrivacyAuthorization) {
      resolvePrivacyAuthorization({ event: 'disagree' });
    }
  };

  const openPrivacyContract = () => {
    Taro.openPrivacyContract({
      fail: () => {
        Taro.showToast({
          title: '协议打开失败',
          icon: 'none',
        });
      },
    });
  };

  if (!show) return null;

  return (
    <View className={`privacy-popup-overlay ${themeClass}`}>
      <View className='privacy-card'>
        <View className='privacy-header'>
          <Text className='privacy-title'>用户隐私保护提示</Text>
        </View>
        
        <View className='privacy-content'>
          <Text className='privacy-text'>
            在使用当前小程序服务之前，请仔细阅读
            <Text className='privacy-link' onClick={openPrivacyContract}>《用户隐私保护指引》</Text>
            。如您同意该指引，请点击“同意”开始使用。
          </Text>
        </View>

        <View className='privacy-actions'>
          <Button className='action-btn decline' onClick={handleDisagree}>
            拒绝
          </Button>
          <Button 
            id='agree-btn'
            className='action-btn agree' 
            openType='agreePrivacyAuthorization'
            onAgreePrivacyAuthorization={handleAgree}
          >
            同意
          </Button>
        </View>
      </View>
    </View>
  );
};
