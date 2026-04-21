import { useEffect, useRef } from 'react';
import Taro from '@tarojs/taro';
import { Canvas } from '@tarojs/components';

export const ZenBackground = () => {
  const cleanupRef = useRef<(() => void) | null>(null);
  const canvasRef = useRef<any>(null);

  useEffect(() => {
    if (Taro.getEnv() !== Taro.ENV_TYPE.WEAPP) return;

    const query = Taro.createSelectorQuery();
    query
      .select('#zenBackground')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res[0] || !canvasRef) return;
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        const dpr = Taro.getWindowInfo().pixelRatio;

        canvas.width = res[0].width * dpr;
        canvas.height = res[0].height * dpr;
        ctx.scale(dpr, dpr);

        const width = res[0].width;
        const height = res[0].height;

        // 根据当前月份自动切换时节视觉主题
        const month = new Date().getMonth();
        let seasonTheme = {
          label: 'Winter',
          colors: ['rgba(255, 255, 255, 0.4)', 'rgba(173, 216, 230, 0.3)', 'rgba(240, 248, 255, 0.3)']
        };

        if (month >= 2 && month <= 4) {
          seasonTheme = { label: 'Spring', colors: ['rgba(255, 192, 203, 0.4)', 'rgba(144, 238, 144, 0.3)', 'rgba(255, 255, 255, 0.4)'] };
        } else if (month >= 5 && month <= 7) {
          seasonTheme = { label: 'Summer', colors: ['rgba(0, 255, 255, 0.3)', 'rgba(255, 255, 224, 0.4)', 'rgba(127, 255, 212, 0.3)'] };
        } else if (month >= 8 && month <= 10) {
          seasonTheme = { label: 'Autumn', colors: ['rgba(255, 140, 0, 0.4)', 'rgba(218, 165, 32, 0.5)', 'rgba(255, 215, 0, 0.3)'] };
        }

        // 模拟流体光晕的粒子 (根据时节动态着色)
        const particles = [
          { x: width * 0.2, y: height * 0.2, r: 150, color: seasonTheme.colors[0], vx: 0.5, vy: 0.3 },
          { x: width * 0.8, y: height * 0.7, r: 200, color: seasonTheme.colors[1], vx: -0.4, vy: -0.2 },
          { x: width * 0.5, y: height * 0.5, r: 180, color: seasonTheme.colors[2], vx: 0.2, vy: 0.6 },
        ];

        let animationId;
        const render = () => {
          if (!canvasRef.current) return;
          ctx.clearRect(0, 0, width, height);
          
          particles.forEach((p) => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
            gradient.addColorStop(0, p.color);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
          });

          animationId = canvas.requestAnimationFrame(render);
        };

        canvasRef.current = canvas;
        render();
        // 存储到引用以便后续清理
        cleanupRef.current = () => canvas.cancelAnimationFrame(animationId);
      });

    return () => {
      canvasRef.current = null;
      if (cleanupRef.current) cleanupRef.current();
    };
  }, []);

  return (
    <Canvas
      id='zenBackground'
      type='2d'
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
    />
  );
};
