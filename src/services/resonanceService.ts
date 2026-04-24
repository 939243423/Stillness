import Taro from '@tarojs/taro';

/**
 * 回响文库定义
 */
export const ECHO_POOL = [
  { level: '深邃', echo: '架构如波，意念无疆。', insight: '深度链接核心，感知万物律动。' },
  { level: '纯净', echo: '清辉入梦，觉醒自来。', insight: '对齐内在频率，释放潜在能量。' },
  { level: '共鸣', echo: '逻辑生花，因果共振。', insight: '修补感知裂痕，体验生命温度。' },
  { level: '轻灵', echo: '繁星恒久，照见本来。', insight: '沉淀生命底色，在当下呼吸。' },
  { level: '空灵', echo: '虚极静笃，回归本源。', insight: '释怀过往，让内在之光自然呈亮。' },
];

/**
 * 灵魂属性池 (共鸣印记)
 */
export const RESONANCE_PROPS = ['共鸣', '觉醒', '流光', '静谧', '灵犀', '真我', '空灵', '破晓', '回归', '永恒'];

/**
 * 简单的 Hash 函数
 */
const hashString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
};

/**
 * 生成系统算法种子
 */
export const generateResonanceSeed = async () => {
  const now = Date.now();
  let deviceId = 'res-default';
  let batteryLevel = 100;

  try {
    const device = await Taro.getSystemInfo();
    deviceId = device.model || 'unknown';
    const battery = await Taro.getBatteryInfo();
    batteryLevel = battery.level || 100;
  } catch (e) {
    console.warn('获取系统信息失败，使用默认种子');
  }

  const seed = (now ^ hashString(deviceId)) * (batteryLevel + 1);
  return seed;
};

/**
 * 根据种子计算共鸣深度
 */
export const calcResonance = (seed: number) => {
  const safeSeed = Math.floor(Math.abs(seed)) || Date.now();
  const index = safeSeed % ECHO_POOL.length;
  const propIndex = (safeSeed * 7) % RESONANCE_PROPS.length;
  
  const item = ECHO_POOL[index];
  return {
    level: item.level || '感应',
    echo: item.echo || '静观自得。',
    insight: item.insight || '平常心，观自在。',
    prop: RESONANCE_PROPS[propIndex] || '随缘'
  };
};
