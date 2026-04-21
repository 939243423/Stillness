import Taro from '@tarojs/taro';

/**
 * 签文池定义
 */
export const FORTUNE_POOL = [
  { level: '极乐', poem: '架构如水，顺流无极。', advice: '宜：重构核心模块，释放技术理想；忌：无效开会。' },
  { level: '上上', poem: '需求如月，清辉自来。', advice: '宜：深度对齐颗粒度，一键发布上线；忌：反向对标。' },
  { level: '中吉', poem: '逻辑自洽，因果分明。', advice: '宜：修补冗余逻辑，感知底层温度；忌：过度封装。' },
  { level: '小吉', poem: '变量恒久，静待花开。', advice: '宜：沉淀通用组件，优化交互链路；忌：硬编码。' },
  { level: '归元', poem: '空灵无我，性能绝佳。', advice: '宜：垃圾回收，断舍离；忌：内存泄漏。' },
];

/**
 * 印章称号池
 */
export const SEAL_ROLES = ['修行', '禅心', '随缘', '精进', '持戒', '布施', '忍辱', '禅定', '智慧', '无我'];

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
 * 生成玄学随机种子
 */
export const generateZenSeed = async () => {
  const now = Date.now();
  let deviceId = 'zen-default';
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
 * 根据种子抽取签文
 */
export const drawFortune = (seed: number) => {
  const index = seed % FORTUNE_POOL.length;
  const sealIndex = (seed * 7) % SEAL_ROLES.length;
  return {
    ...FORTUNE_POOL[index],
    seal: SEAL_ROLES[sealIndex]
  };
};
