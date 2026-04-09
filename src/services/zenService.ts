import Taro from '@tarojs/taro';

/**
 * 签文池定义
 */
export const FORTUNE_POOL = [
  { level: '大吉', poem: '春风得意马蹄疾，一日看尽长安花。', advice: '宜：跨界探索，深度交流；忌：故步自封。' },
  { level: '上吉', poem: '山重水复疑无路，柳暗花明又一村。', advice: '宜：静心思考，顺势而为；忌：急功近利。' },
  { level: '中吉', poem: '行到水穷处，坐看云起时。', advice: '宜：修身养性，随遇而安；忌：纠结过往。' },
  { level: '小吉', poem: '采菊东篱下，悠然见南山。', advice: '宜：回归自我，亲近自然；忌：盲目攀比。' },
  { level: '平', poem: '莫愁前路无知己，天下谁人不识君。', advice: '宜：广结善缘，平稳推进；忌：犹豫不决。' },
];

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
  return FORTUNE_POOL[index];
};
