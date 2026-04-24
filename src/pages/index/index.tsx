import { useState, useCallback, useEffect, lazy, Suspense, useRef } from 'react';
import Taro, { useDidShow } from '@tarojs/taro';
import { View, Text, Textarea, ScrollView } from '@tarojs/components';
import { ZenBackground } from '../../components/ZenBackground';
import { useRewardAd } from '../../hooks/useRewardAd';
import { getResonanceResponse, getFinalSoulInsight } from '../../services/aiService';
import { useTabActive } from '../../hooks/useTabActive';
import AudioService from '../../services/audioService';
import './index.scss';

const ResonanceRhythm = lazy(() => import('../../components/ResonanceRhythm').then(m => ({ default: m.ResonanceRhythm })));
const WishBottle = lazy(() => import('../../components/WishBottle').then(m => ({ default: m.WishBottle })));
const ResonanceTip = lazy(() => import('../../components/ResonanceTip').then(m => ({ default: m.ResonanceTip })));

export default function Index() {
  const [loading, setLoading] = useState(false);
  const [showTools, setShowTools] = useState(false);
  const [mode, setMode] = useState<'muyu' | 'bottle'>('muyu');
  const [thought, setThought] = useState('');
  
  // Resonance State
  const [isResonanceActive, setIsResonanceActive] = useState(false);
  const [roundIndex, setRoundIndex] = useState(0);
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [visualState, setVisualState] = useState({ color: '#FDFCFB', intensity: 0.3, flowSpeed: 0.2 });
  const [scrollInto, setScrollInto] = useState('');
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isClosing, setIsClosing] = useState(false); 
  const [showTip, setShowTip] = useState(false); 

  const [systemSettings, setSystemSettings] = useState({
    ambientSound: 'off',
    flowSpeed: 'normal',
    darkModeManual: false,
    darkModeAuto: false
  });

  useDidShow(() => {
    const sysSaved = Taro.getStorageSync('system_settings');
    if (sysSaved) setSystemSettings(prev => ({ ...prev, ...sysSaved }));
  });

  const getNightPreset = useCallback(() => {
    return { color: '#000000', intensity: 0.6 };
  }, []);

  const getTimeBasedAura = useCallback(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 8) return { color: '#FFF5F5', intensity: 0.2 };
    if (hour >= 8 && hour < 17) return { color: '#FDFCFB', intensity: 0.15 };
    if (hour >= 17 && hour < 20) return { color: '#FFF1E0', intensity: 0.3 };
    return getNightPreset();
  }, [getNightPreset]);

  // 环境自适应同步 (夜间模式与自动化)
  useEffect(() => {
    if (isResonanceActive) return;

    let targetAura = { color: '#FDFCFB', intensity: 0.15 }; 

    if (systemSettings.darkModeManual) {
      targetAura = getNightPreset();
    } else if (systemSettings.darkModeAuto) {
      const hour = new Date().getHours();
      const isSystemDark = Taro.getSystemInfoSync().theme === 'dark';
      // 满足时间 (19:00-05:00) 或 系统黑暗模式
      if (hour >= 19 || hour < 5 || isSystemDark) {
        targetAura = getNightPreset();
      } else {
        targetAura = getTimeBasedAura();
      }
    }

    setVisualState(prev => ({
      ...prev,
      color: targetAura.color,
      intensity: targetAura.intensity
    }));
  }, [systemSettings.darkModeManual, systemSettings.darkModeAuto, isResonanceActive, getTimeBasedAura, getNightPreset]);

  // 音频自适应逻辑
  useEffect(() => {
    if (isResonanceActive && systemSettings.ambientSound !== 'off') {
      AudioService.play(systemSettings.ambientSound);
    } else {
      AudioService.stop();
    }
  }, [isResonanceActive, systemSettings.ambientSound]);

  const getFlowSpeed = useCallback(() => {
    const mapping = { slow: 0.08, normal: 0.25, fast: 0.6 };
    return mapping[systemSettings.flowSpeed] || 0.25;
  }, [systemSettings.flowSpeed]);

  // 按钮点亮防抖逻辑
  useEffect(() => {
    if (!thought.trim()) {
      setIsButtonActive(false);
      return;
    }
    const timer = setTimeout(() => {
      setIsButtonActive(true);
    }, 500);
    return () => clearTimeout(timer);
  }, [thought]);

  const { showAd } = useRewardAd();
  useTabActive(0);

  // 自动滚动到底部
  useEffect(() => {
    if (chatHistory.length > 0) {
      setTimeout(() => {
        setScrollInto(`msg-${chatHistory.length - 1}`);
      }, 100);
    }
  }, [chatHistory]);

  const requestTaskRef = useRef<Taro.RequestTask<any> | null>(null);

  const stopResonance = useCallback(() => {
    if (requestTaskRef.current) {
      requestTaskRef.current.abort();
      requestTaskRef.current = null;
    }
    setLoading(false);
    Taro.showToast({ title: '已停止共鸣感应', icon: 'none' });
  }, []);

  const startResonance = useCallback(async () => {
    if (!thought.trim()) {
      Taro.vibrateShort({ type: 'medium' });
      setShowTip(true);
      return;
    }
    
    const canStart = await showAd();
    if (!canStart) return;

    // 开始“深潜”转场
    setIsTransitioning(true);
    Taro.vibrateShort({ type: 'heavy' });

    setLoading(true);
    const initialUserMsg = { role: 'user' as const, content: thought };
    setChatHistory([initialUserMsg]);
    setThought('');

    // 并行请求 AI
    const aiPromise = getResonanceResponse([initialUserMsg], (task) => {
       requestTaskRef.current = task;
    });

    setTimeout(async () => {
      setIsResonanceActive(true);
      setIsTransitioning(false);
      setRoundIndex(1);
      
      try {
        const res = await aiPromise;
        setChatHistory(prev => [...prev, { role: 'assistant', content: res.text }]);
        setVisualState(res.visualTarget);
      } catch (e) {
        if (e.errMsg?.includes('abort')) return;
        Taro.showToast({ title: '感应频率超时或中断', icon: 'none' });
      } finally {
        setLoading(false);
        requestTaskRef.current = null;
      }
    }, 800);
  }, [thought, showAd]);

  const handleNextRound = useCallback(async () => {
    if (!thought.trim() || loading) return;

    if (roundIndex >= 30) {
      Taro.showToast({ title: '本次共鸣已达上限，感谢这份深度的连接。', icon: 'none' });
      return;
    }

    setLoading(true);
    const userMsg = { role: 'user' as const, content: thought };
    const updatedHistory = [...chatHistory, userMsg];
    setChatHistory(updatedHistory);
    setThought('');

    try {
      const res = await getResonanceResponse(updatedHistory, (task) => {
        requestTaskRef.current = task;
      });
      setChatHistory(prev => [...prev, { role: 'assistant', content: res.text }]);
      setVisualState(res.visualTarget);
      setRoundIndex(prev => prev + 1);
    } catch (e) {
      if (e.errMsg?.includes('abort')) return;
      Taro.showToast({ title: '感应超时，请稍后重试', icon: 'none' });
    } finally {
      setLoading(false);
      requestTaskRef.current = null;
    }
  }, [chatHistory, thought, loading, roundIndex]);

  const handleFinish = useCallback(async () => {
    if (chatHistory.length < 2) {
      Taro.showToast({ title: '再多聊几句吧，灵感还在孕育中...', icon: 'none' });
      return;
    }

    Taro.showLoading({ title: '正在凝练灵魂印记...' });
    try {
      const insight = await getFinalSoulInsight(chatHistory);
      const now = new Date();
      const newRecord = {
        id: Date.now(),
        level: '深层共鸣',
        echo: insight.echo,
        insight: insight.insight,
        date: `${now.getMonth() + 1}/${now.getDate()}`,
        time: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`,
        dialogue: [...chatHistory] // 核心：保存完整对话记录
      };

      const history = Taro.getStorageSync('resonance_history') || [];
      Taro.setStorageSync('resonance_history', [newRecord, ...history]);
      
      // 更新共鸣计数
      const count = Taro.getStorageSync('resonance_count') || 0;
      Taro.setStorageSync('resonance_count', count + 1);

      Taro.hideLoading();
      Taro.showToast({ title: '印记已镌刻' });
      
      // 重置状态
      setIsResonanceActive(false);
      setChatHistory([]);
      setThought('');
      setRoundIndex(0);
      setIsTransitioning(false);
    } catch (e) {
      Taro.hideLoading();
      Taro.showToast({ title: '凝练失败，请重试', icon: 'none' });
    }
  }, [chatHistory]);

  const [quote] = useState(() => {
    const quotes = ['每个当下，都是新的开始。', '听，心跳的节奏。', '呼吸间，世界很静。', '温柔地对待自己。'];
    return quotes[Math.floor(Math.random() * quotes.length)];
  });

  const handleMessageAction = useCallback((idx: number, content: string) => {
    Taro.showActionSheet({
      itemList: ['复制', '删除'],
      success: (res) => {
        if (res.tapIndex === 0) {
          Taro.setClipboardData({
            data: content,
            success: () => Taro.showToast({ title: '已复制', icon: 'success' })
          });
        } else if (res.tapIndex === 1) {
          setChatHistory(prev => prev.filter((_, i) => i !== idx));
        }
      }
    });
  }, []);

  return (
    <View className='index'>
      {/* 动态背景 */}
      <ZenBackground 
        color={visualState.color} 
        intensity={visualState.intensity} 
        speed={isResonanceActive ? visualState.flowSpeed : getFlowSpeed()} 
      />

      {/* 首页阶段 */}
      {!isResonanceActive && (
        <View className={`index__main ${showTools ? 'pushed' : ''} ${isTransitioning ? 'exiting' : ''}`}>
           <View className={`index__header ${isTransitioning ? 'mini' : ''}`}>
              <Text className='quote-text'>{quote}</Text>
           </View>
          <View className={`diary-input-card ${isTransitioning ? 'exiting' : ''}`}>
            <View className='card-header'>
               <Text className='greeting'>你好，最近心情如何？</Text>
            </View>
            <Textarea 
              className='thought-input'
              placeholder='写下第一缕思绪，开启深度共鸣之旅...'
              placeholderStyle='font-size: 32rpx; color: rgba(44, 62, 80, 0.25); line-height: 1.8;'
              value={thought}
              onInput={(e) => setThought(e.detail.value)}
              maxlength={100}
              autoHeight
            />
          </View>
          <View className='resonance-action'>
            <View className={`resonance-draw-btn ${isButtonActive ? 'active' : ''}`} onClick={startResonance}>
              即时共鸣
              <View className='btn-effect' />
            </View>
          </View>
        </View>
      )}

      {/* 转场动效 */}
      {isTransitioning && <View className='ripple-overlay' />}

      {/* 对话阶段 */}
      {isResonanceActive && (
        <View className='resonance-stage'>
          <View className={`index__resonance ${isClosing ? 'closing' : ''}`}>
            <View className='resonance-header-nav'>
               <View className='back-btn' onClick={() => {
                  if (chatHistory.length > 0) {
                    Taro.showModal({
                      title: '暂时离开',
                      content: '当前共鸣尚未保存，确定要退出吗？',
                      success: (res) => {
                        if (res.confirm) setIsResonanceActive(false);
                      }
                    });
                  } else {
                    setIsResonanceActive(false);
                  }
               }} />
               {!loading && (
                 <View className='finish-session-btn' onClick={handleFinish}>
                    <Text>结束共鸣</Text>
                 </View>
               )}
            </View>

          <ScrollView 
            className='chat-scroll' 
            scrollY 
            scrollWithAnimation 
            scrollIntoView={scrollInto}
            enhanced
            showScrollbar={false}
          >
            <View className='chat-list'>
              {chatHistory.map((item, idx) => (
                item.content ? (
                  <View 
                    key={idx} 
                    id={`msg-${idx}`}
                    className={`chat-bubble ${item.role}`}
                    onLongPress={() => handleMessageAction(idx, item.content)}
                  >
                    <Text className='bubble-text'>{item.content}</Text>
                  </View>
                ) : null
              ))}
              {loading && (
                <View className='chat-bubble assistant loading'>
                    <View className='loading-aura'>
                      <Text className='aura-text'>感应中</Text>
                      <View className='aura-dot' />
                    </View>
                </View>
              )}
            </View>
          </ScrollView>

          </View>
          <View className='user-input-tray'>
            <View className='input-wrapper'>
              <Textarea 
                className='input-area'
                placeholder='在此刻，分享你的感悟...'
                value={thought}
                onInput={(e) => setThought(e.detail.value)}
                confirmType='send'
                onConfirm={handleNextRound}
                autoHeight
                fixed
                cursorSpacing={25}
                adjustPosition={true}
              />
              <View 
                className={`send-trigger ${loading ? 'loading' : (thought.trim() ? 'active' : '')}`} 
                onClick={loading ? stopResonance : handleNextRound}
              >
                <View className='send-icon' />
              </View>
            </View>
          </View>
        </View>
      )}

      {/* 底部功能盘 */}
      {!isResonanceActive && (
        <View className={`tools-tray ${showTools ? 'expanded' : ''}`}>
          <View className='tray-handle' onClick={() => setShowTools(!showTools)}>
            <View className='handle-bar' />
            <Text className='handle-text'>{showTools ? '回到共鸣' : '共鸣空间表'}</Text>
          </View>
          <View className='tools-content'>
             <View className='tools-tabs'>
                <View className={`tool-tab ${mode === 'muyu' ? 'active' : ''}`} onClick={() => setMode('muyu')}>解压律动</View>
                <View className={`tool-tab ${mode === 'bottle' ? 'active' : ''}`} onClick={() => setMode('bottle')}>情绪瓶子</View>
             </View>
             <View className='tool-display'>
                <Suspense fallback={null}>
                  {mode === 'muyu' ? <ResonanceRhythm /> : <WishBottle />}
                </Suspense>
             </View>
          </View>
        </View>
      )}
      
      <Suspense fallback={null}>
        <ResonanceTip show={showTip} onClose={() => setShowTip(false)} />
      </Suspense>
    </View>
  );
}
