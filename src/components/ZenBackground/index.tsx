import { useEffect } from 'react';
import Taro from '@tarojs/taro';
import { Canvas } from '@tarojs/components';

export const ZenBackground = () => {

  useEffect(() => {
    if (Taro.getEnv() !== Taro.ENV_TYPE.WEAPP) return;

    const query = Taro.createSelectorQuery();
    query
      .select('#zenBackground')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res[0]) return;
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        const dpr = Taro.getSystemInfoSync().pixelRatio;

        canvas.width = res[0].width * dpr;
        canvas.height = res[0].height * dpr;
        ctx.scale(dpr, dpr);

        const width = res[0].width;
        const height = res[0].height;

        // 模拟流体光晕的粒子
        const particles = [
          { x: width * 0.2, y: height * 0.2, r: 150, color: 'rgba(253, 252, 251, 0.4)', vx: 0.5, vy: 0.3 },
          { x: width * 0.8, y: height * 0.7, r: 200, color: 'rgba(226, 209, 195, 0.5)', vx: -0.4, vy: -0.2 },
          { x: width * 0.5, y: height * 0.5, r: 180, color: 'rgba(255, 255, 255, 0.3)', vx: 0.2, vy: 0.6 },
        ];

        let animationId;
        const render = () => {
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

        render();
        return () => canvas.cancelAnimationFrame(animationId);
      });
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
