import { useRef, useCallback, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Canvas, Button } from '@tarojs/components';
import './index.scss';

export interface SoulResultData {
  archetype: string;
  energyColor: string;
  vibeTags: string[];
  echo: string;
  insight: string;
  decode: string;
  spiritId: string;
}

export const FortuneCard = ({ data }: { data: SoulResultData }) => {
  const canvasRef = useRef<any>(null);
  const isUnmounted = useRef(false);

  const drawCard = useCallback((ctx: any, w: number, h: number) => {
    if (isUnmounted.current) return;
    const { 
      archetype = '寂静之山', 
      energyColor = '#A8D5BA', 
      vibeTags = ['#安静的爆发'], 
      echo = '风过林梢，心中无事。', 
      insight = '深呼吸，感受当下。', 
      decode = '你的内心如山般稳固。', 
      spiritId = 'SN-0000' 
    } = data || {};

    // 1. 绘制底色面 (奶油感背景)
    ctx.fillStyle = '#FDFCFB';
    ctx.fillRect(0, 0, w, h);

    // 2. 绘制柔和渐变背景
    const bgGrad = ctx.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, `${energyColor}15`); 
    bgGrad.addColorStop(1, '#FFFFFF');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // 3. 核心装饰：能量共鸣球
    const orbX = w / 2;
    const orbY = h * 0.42;
    const orbR = 140;
    const orbGrad = ctx.createRadialGradient(orbX, orbY, 0, orbX, orbY, orbR);
    orbGrad.addColorStop(0, `${energyColor}60`);
    orbGrad.addColorStop(0.5, `${energyColor}20`);
    orbGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = orbGrad;
    ctx.beginPath();
    ctx.arc(orbX, orbY, orbR, 0, Math.PI * 2);
    ctx.fill();

    // 4. 灵魂原型名称 (SOUL ARCHETYPE)
    ctx.textAlign = 'center';
    ctx.fillStyle = '#2c3e50';
    ctx.font = '300 24px sans-serif';
    ctx.fillText('SOUL ARCHETYPE', w / 2, 80);
    
    ctx.font = 'bold 48px serif';
    ctx.fillStyle = '#1a1a1a';
    ctx.fillText(archetype, w / 2, 140);

    // 5. 核心回响 (Echo)
    ctx.font = '300 32px serif';
    ctx.fillStyle = '#2c3e50';
    const echoLines = echo.split(/[，。]/).filter(s => s.length > 0);
    echoLines.forEach((line, idx) => {
      ctx.fillText(line, w / 2, h * 0.45 + (idx * 45) - (echoLines.length * 20));
    });

    // 6. 深度感应 (Decode)
    ctx.font = '300 24px sans-serif';
    ctx.fillStyle = '#7f8c8d';
    const decodeChars = 16;
    for (let i = 0; i < decode.length; i += decodeChars) {
      const line = decode.slice(i, i + decodeChars);
      ctx.fillText(line, w / 2, h * 0.7 + (Math.floor(i / decodeChars) * 35));
    }

    // 7. 氛围标签
    const tagY = h * 0.85;
    ctx.font = '300 22px sans-serif';
    ctx.fillStyle = energyColor;
    ctx.fillText(vibeTags.join('   '), w / 2, tagY);

    // 8. 底部页脚
    ctx.fillStyle = '#bdc3c7';
    ctx.font = '200 18px sans-serif';
    ctx.fillText(`ID: ${spiritId}  |  POWERED BY RESONANCE AI`, w / 2, h - 50);
    
    // 9. 感醒洞察 (Insight)
    ctx.font = 'bold 22px sans-serif';
    ctx.fillStyle = '#2c3e50';
    ctx.fillText(insight, w / 2, h - 100);

  }, [data]);

  const initCanvas = useCallback(() => {
    const query = Taro.createSelectorQuery();
    query.select('#shareCanvas').fields({ node: true, size: true }).exec((res) => {
      if (!res[0] || isUnmounted.current) return;
      const canvas = res[0].node;
      const ctx = canvas.getContext('2d');
      const dpr = Taro.getWindowInfo().pixelRatio;
      
      const w = 450; 
      const h = 750; 
      
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      canvasRef.current = canvas;
      drawCard(ctx, w, h);
    });
  }, [drawCard]);

  useEffect(() => {
    isUnmounted.current = false;
    setTimeout(initCanvas, 100);
    return () => { isUnmounted.current = true; };
  }, [initCanvas]);

  const handleSave = useCallback(async () => {
    if (!canvasRef.current) return;
    try {
      const tempPath = await Taro.canvasToTempFilePath({ canvas: canvasRef.current });
      await Taro.saveImageToPhotosAlbum({ filePath: tempPath.tempFilePath });
      Taro.showToast({ title: '已保存画报至相册', icon: 'success' });
    } catch (err) {
      console.error(err);
      Taro.showToast({ title: '保存失败', icon: 'none' });
    }
  }, []);

  return (
    <View className='soul-result-container'>
      <Canvas id='shareCanvas' type='2d' className='soul-canvas' />
      <View className='action-bar'>
        <Button className='save-poster-btn' onClick={handleSave}>保存分享灵魂画报</Button>
      </View>
    </View>
  );
};
