import { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components';
import './index.scss';

export const PrivacyPopup = () => {
  const [show, setShow] = useState(false);
  const [resolvePrivacyAuthorization, setResolvePrivacyAuthorization] = useState<any>(null);

  useEffect(() => {
    console.log('>>> PrivacyPopup 组件已挂载，开始检查隐私设置');

    // 1. 主动检查：一打开小程序就检查是否需要授权
    if (Taro.getPrivacySetting) {
      Taro.getPrivacySetting({
        success: (res) => {
          console.log('>>> 微信返回隐私状态:', res);
          if (res.needAuthorization) {
            setShow(true);
          }
        },
        fail: (err) => {
          console.error('>>> 获取隐私设置失败:', err);
        },
      });
    } else {
      console.warn('>>> 当前基础库不支持 getPrivacySetting');
    }

    // 2. 被动监听：当用户触发敏感 API 时系统自动拦截并触发
    if (Taro.onNeedPrivacyAuthorization) {
      Taro.onNeedPrivacyAuthorization((resolve) => {
        console.log('>>> 触发被动隐私拦截');
        setShow(true);
        setResolvePrivacyAuthorization(() => resolve);
      });
    }
  }, []);

  const handleAgree = () => {
    setShow(false);
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
    <View className='privacy-popup-overlay'>
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
