import { useRef, useCallback, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Canvas, Button } from '@tarojs/components';
import './index.scss';

interface FortuneData {
  level: string;
  poem: string;
  advice: string;
  seal?: string;
}

export const FortuneCard = ({ data }: { data: FortuneData }) => {

  const canvasRef = useRef<any>(null);
  const isUnmounted = useRef(false);

  const drawCard = useCallback((ctx: any, w: number, h: number) => {
    if (isUnmounted.current) return;
    // 视觉辅助参数
    const padding = 36;

    // 1. 绘制背景 (统一全局背景色)
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#fdfcfb');
    grad.addColorStop(1, '#e2d1c3');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // 2. 绘制雅致内边框
    ctx.strokeStyle = 'rgba(93, 64, 55, 0.1)';
    ctx.lineWidth = 1;
    ctx.strokeRect(padding, padding, w - padding * 2, h - padding * 2);
    
    // 辅边框
    ctx.strokeRect(padding + 10, padding + 10, w - (padding + 10) * 2, h - (padding + 10) * 2);

    // 3. 绘制文字 - 等级 (书法中心感)
    ctx.font = `bold 54px sans-serif`;
    ctx.fillStyle = '#b71c1c';
    ctx.textAlign = 'center';
    ctx.fillText(data.level, w / 2, 160);

    // 4. 装饰线与印章
    ctx.strokeStyle = '#b71c1c';
    ctx.lineWidth = 2;
    // 绘制简易印章
    const sealSize = 50;
    const sealX = w - padding - 75;
    const sealY = padding + 30;
    ctx.strokeRect(sealX, sealY, sealSize, sealSize);
    ctx.fillStyle = '#b71c1c';
    ctx.fillRect(sealX + 2, sealY + 2, sealSize - 4, sealSize - 4);
    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';

    const sealText = data.seal || '修行';
    // 简单的垂直居中排版 (如果是两个字的话)
    if (sealText.length === 2) {
      ctx.fillText(sealText[0], sealX + sealSize/2, sealY + 22);
      ctx.fillText(sealText[1], sealX + sealSize/2, sealY + sealSize - 10);
    } else {
      ctx.fillText(sealText, sealX + sealSize/2, sealY + sealSize/2 + 6);
    }

    // 5. 绘制诗句 (针对长句换行处理)
    ctx.font = '24px sans-serif';
    ctx.fillStyle = '#1a1a1a';
    ctx.textAlign = 'center';
    const poemStr = data.poem || '';
    if (poemStr.length > 12) {
      ctx.fillText(poemStr.slice(0, 12), w / 2, 290);
      ctx.fillText(poemStr.slice(12), w / 2, 335);
    } else {
      ctx.fillText(poemStr, w / 2, 310);
    }

    // 6. 宜忌区 (比例平衡)
    ctx.font = '15px sans-serif';
    ctx.fillStyle = 'rgba(93, 64, 55, 0.5)';
    ctx.fillText('—— 宜忌指引 ——', w / 2, h * 0.72);
    
    ctx.font = '18px sans-serif';
    ctx.fillStyle = '#5d4037';
    const adviceLines = data.advice.split('；');
    adviceLines.forEach((line, index) => {
      ctx.fillText(line.trim(), w / 2, (h * 0.72) + 45 + index * 30);
    });

    // 7. 底部落款
    ctx.font = '13px sans-serif';
    ctx.fillStyle = 'rgba(120, 120, 120, 0.4)';
    ctx.fillText('© 签签有你 · 见字如晤', w / 2, h - 55);
  }, [data]);

  const initCanvas = useCallback(() => {
    const query = Taro.createSelectorQuery();
    query.select('#shareCanvas').fields({ node: true, size: true }).exec((res) => {
      if (!res[0] || isUnmounted.current) return;
      const canvas = res[0].node;
      const ctx = canvas.getContext('2d');
      const dpr = Taro.getWindowInfo().pixelRatio;
      
      const w = 400; 
      const h = 600; 
      
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
      Taro.showToast({ title: '已保存至相册', icon: 'success' });
    } catch (err) {
      console.error(err);
      Taro.showToast({ title: '保存失败', icon: 'none' });
    }
  }, []);

  return (
    <View className='fortune-card-container'>
      <Canvas id='shareCanvas' type='2d' className='share-canvas' />
      <Button className='save-btn' onClick={handleSave}>保存分享卡片</Button>
    </View>
  );
};
