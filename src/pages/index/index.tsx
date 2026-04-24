import { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Textarea, ScrollView } from '@tarojs/components';
import { ZenBackground } from '../../components/ZenBackground';
import { useRewardAd } from '../../hooks/useRewardAd';
import { getResonanceResponse } from '../../services/aiService';
import { useTabActive } from '../../hooks/useTabActive';
import './index.scss';

// 按需加载性能优化
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
    const aiPromise = getResonanceResponse([initialUserMsg]);

    setTimeout(async () => {
      setIsResonanceActive(true);
      setIsTransitioning(false);
      setRoundIndex(1);
      
      try {
        const res = await aiPromise;
        setChatHistory(prev => [...prev, { role: 'assistant', content: res.text }]);
        setVisualState(res.visualTarget);
      } catch (e) {
        Taro.showToast({ title: '频率连接不稳', icon: 'none' });
      } finally {
        setLoading(false);
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
      const res = await getResonanceResponse(updatedHistory);
      setChatHistory(prev => [...prev, { role: 'assistant', content: res.text }]);
      setVisualState(res.visualTarget);
      setRoundIndex(prev => prev + 1);
    } catch (e) {
      Taro.showToast({ title: '感应中断', icon: 'none' });
    } finally {
      setLoading(false);
    }
  }, [chatHistory, thought, loading, roundIndex]);

  const [quote] = useState(() => {
    const quotes = ['每个当下，都是新的开始。', '听，心跳的节奏。', '呼吸间，世界很静。', '温柔地对待自己。'];
    return quotes[Math.floor(Math.random() * quotes.length)];
  });

  return (
    <View className='index'>
      {/* 动态背景 */}
      <ZenBackground 
        color={visualState.color} 
        intensity={visualState.intensity} 
        speed={visualState.flowSpeed} 
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
        <View className={`resonance-stage ${isClosing ? 'closing' : ''}`}>
          <View className='resonance-header'>
            <View className='depth-indicator'>
              <View className='depth-dot' style={{ opacity: Math.min(roundIndex / 10, 1) }} />
              <Text className='depth-text'>灵魂共鸣中</Text>
            </View>
            <Text className='close-resonance' onClick={() => {
              setIsClosing(true);
              setTimeout(() => {
                setIsResonanceActive(false);
                setIsClosing(false);
                setChatHistory([]);
                setRoundIndex(0);
                setVisualState({ color: '#FDFCFB', intensity: 0.3, flowSpeed: 0.2 });
              }, 600);
            }}>结束共鸣</Text>
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
                <View 
                  key={idx} 
                  id={`msg-${idx}`}
                  className={`chat-bubble ${item.role}`}
                >
                  <Text className='bubble-text'>{item.content}</Text>
                </View>
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
              <View className={`send-trigger ${thought.trim() && !loading ? 'active' : ''}`} onClick={handleNextRound}>
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
