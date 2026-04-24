import { useEffect, useRef } from 'react';
import Taro from '@tarojs/taro';
import { Canvas } from '@tarojs/components';

interface ZenBackgroundProps {
  color?: string;
  intensity?: number;
  speed?: number;
}

export const ZenBackground = ({ color = '#FDFCFB', intensity = 0.3, speed = 0.2 }: ZenBackgroundProps) => {
  const cleanupRef = useRef<(() => void) | null>(null);
  const canvasRef = useRef<any>(null);
  const stateRef = useRef({ color, intensity, speed });

  // 同步外部 Props 到内部 Ref，避免动画循环触发重新渲染
  useEffect(() => {
    stateRef.current = { color, intensity, speed };
  }, [color, intensity, speed]);

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

        // 仅保留大光晕粒子，去除细碎的小点提高高级感
        const glowParticles = [
          { x: width * 0.2, y: height * 0.2, r: 600, vx: 0.1, vy: 0.05 },
          { x: width * 0.8, y: height * 0.7, r: 800, vx: -0.08, vy: -0.05 },
          { x: width * 0.5, y: height * 0.4, r: 700, vx: 0.05, vy: 0.1 },
        ];

        let animationId;
        const render = () => {
          if (!canvasRef.current) return;
          const { color: targetColor, intensity: targetIntensity, speed: targetSpeed } = stateRef.current;
          
          ctx.clearRect(0, 0, width, height);

          // 绘制背景大光晕 (丝滑流动的云雾感)
          glowParticles.forEach((p) => {
            p.x += p.vx * targetSpeed * 5;
            p.y += p.vy * targetSpeed * 5;
            if (p.x < -p.r || p.x > width + p.r) p.vx *= -1;
            if (p.y < -p.r || p.y > height + p.r) p.vy *= -1;

            const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
            // 降低透明度阈值，让边界更模糊
            const alpha = Math.floor(targetIntensity * 80).toString(16).padStart(2, '0');
            gradient.addColorStop(0, `${targetColor}${alpha}`); 
            gradient.addColorStop(1, `${targetColor}00`);
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
          });

          animationId = canvas.requestAnimationFrame(render);
        };

        canvasRef.current = canvas;
        render();
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
