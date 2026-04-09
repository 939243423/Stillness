import { useRef, useCallback } from 'react';
import Taro from '@tarojs/taro';
import { View, Canvas, Button } from '@tarojs/components';
import './index.scss';

interface FortuneData {
  level: string;
  poem: string;
  advice: string;
}

export const FortuneCard = ({ data }: { data: FortuneData }) => {

  const handleSave = useCallback(async () => {
    const query = Taro.createSelectorQuery();
    query.select('#shareCanvas').fields({ node: true, size: true }).exec(async (res) => {
      if (!res[0]) return;
      const canvas = res[0].node;
      const ctx = canvas.getContext('2d');
      const dpr = Taro.getSystemInfoSync().pixelRatio;

      // 视觉设计参数
      const w = res[0].width;
      const h = res[0].height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);

      // 1. 绘制背景渐变
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#fdfcfb');
      grad.addColorStop(1, '#e2d1c3');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // 2. 绘制装饰边框
      ctx.strokeStyle = 'rgba(93, 64, 55, 0.1)';
      ctx.lineWidth = 1;
      ctx.strokeRect(20, 20, w - 40, h - 40);

      // 3. 绘制文字 - 等级
      ctx.font = 'bold 40px sans-serif';
      ctx.fillStyle = '#d32f2f';
      ctx.textAlign = 'center';
      ctx.fillText(data.level, w / 2, 120);

      // 4. 绘制诗句 (自动换行模拟)
      ctx.font = '20px serif';
      ctx.fillStyle = '#5d4037';
      ctx.fillText(data.poem, w / 2, 220);

      // 5. 绘制宜忌
      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#8d6e63';
      ctx.fillText(data.advice, w / 2, 320);

      // 6. 底部标识
      ctx.font = '12px sans-serif';
      ctx.fillStyle = 'rgba(93, 64, 55, 0.4)';
      ctx.fillText('—— 签签有你 · 禅意生活 ——', w / 2, h - 60);

      // 保存图片
      try {
        const tempPath = await Taro.canvasToTempFilePath({ canvas });
        await Taro.saveImageToPhotosAlbum({ filePath: tempPath.tempFilePath });
        Taro.showToast({ title: '已保存至相册', icon: 'success' });
      } catch (err) {
        console.error(err);
        Taro.showToast({ title: '保存失败', icon: 'none' });
      }
    });
  }, [data]);

  return (
    <View className='fortune-card-container'>
      <Canvas id='shareCanvas' type='2d' className='share-canvas' />
      <Button className='save-btn' onClick={handleSave}>保存分享卡片</Button>
    </View>
  );
};
