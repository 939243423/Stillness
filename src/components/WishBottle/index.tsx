import { useEffect, useRef } from 'react';
import Taro from '@tarojs/taro';
import { View, Canvas } from '@tarojs/components';
import './index.scss';

export const WishBottle = () => {
  const ctxRef = useRef<any>(null);
  const tiltRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (Taro.getEnv() !== Taro.ENV_TYPE.WEAPP) return;

    // 1. 初始化加速计
    Taro.startAccelerometer({ interval: 'ui' });
    const onAccelChange = (res) => {
      // 映射到具体的物理力
      tiltRef.current = { x: res.x * 5, y: -res.y * 5 };
    };
    Taro.onAccelerometerChange(onAccelChange);

    // 2. 初始化 Canvas
    const query = Taro.createSelectorQuery();
    query.select('#bottleCanvas').fields({ node: true, size: true }).exec((res) => {
      if (!res[0]) return;
      const canvas = res[0].node;
      const ctx = canvas.getContext('2d');
      const dpr = Taro.getSystemInfoSync().pixelRatio;
      canvas.width = res[0].width * dpr;
      canvas.height = res[0].height * dpr;
      ctx.scale(dpr, dpr);
      ctxRef.current = ctx;

      const width = res[0].width;
      const height = res[0].height;

      // 粒子池
      const particles: any[] = Array.from({ length: 45 }).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2.5 + 1.2,
        hue: Math.random() * 40 + 170, // 蓝青色调
        alpha: Math.random() * 0.6 + 0.4,
        vx: 0,
        vy: 0
      }));

      let animationId;
      const render = () => {
        ctx.clearRect(0, 0, width, height);

        // 绘制瓶身阴影/背景感 (增强对比)
        const bottleGrad = ctx.createLinearGradient(0, 0, width, height);
        bottleGrad.addColorStop(0, 'rgba(230, 240, 255, 0.4)');
        bottleGrad.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
        ctx.fillStyle = bottleGrad;
        ctx.fillRect(0, 0, width, height);

        particles.forEach(p => {
          // 受重力影响
          p.vx += tiltRef.current.x * 0.12;
          p.vy += tiltRef.current.y * 0.12;

          // 阻尼
          p.vx *= 0.94;
          p.vy *= 0.94;

          p.x += p.vx;
          p.y += p.vy;

          // 边界碰撞 (稍微留白)
          const padding = 8;
          if (p.x < padding) { p.x = padding; p.vx *= -0.4; }
          if (p.x > width - padding) { p.x = width - padding; p.vx *= -0.4; }
          if (p.y < padding) { p.y = padding; p.vy *= -0.4; }
          if (p.y > height - padding) { p.y = height - padding; p.vy *= -0.4; }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.shadowBlur = 12;
          ctx.shadowColor = `hsla(${p.hue}, 100%, 75%, ${p.alpha})`;
          ctx.fillStyle = `hsla(${p.hue}, 100%, 85%, ${p.alpha})`;
          ctx.fill();
        });

        animationId = canvas.requestAnimationFrame(render);
      };

      render();
      return () => {
        canvas.cancelAnimationFrame(animationId);
      };
    });

    return () => {
      Taro.stopAccelerometer();
      Taro.offAccelerometerChange(onAccelChange);
    };
  }, []);

  return (
    <View className='wish-bottle'>
      <View className='bottle-gloss' />
      <Canvas id='bottleCanvas' type='2d' className='bottle-canvas' />
    </View>
  );
};
