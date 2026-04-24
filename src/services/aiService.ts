import Taro from '@tarojs/taro';

const SILICON_KEY = 'sk-grregxjdqfcoutmccnxxtkuqingipcosydblwiyefekktdcr';
const ANYWHERE_KEY = 'sk-S73C9wvuIIwDK2K9wbhAlS9gl4rfjVM3rCt99GTwmXJbUOSo';

const SILICON_URL = 'https://api.siliconflow.cn/v1/chat/completions';
const ANYWHERE_URL = 'https://api.chatanywhere.tech/v1/chat/completions';

export interface SoulInsight {
  archetype: string;        // 灵魂原型，如 '星辰编织者'
  energyColor: string;      // 能量色 hex, 如 '#A8D5BA'
  vibeTags: string[];       // 氛围标签，如 ['#安静的爆发', '#以柔克刚']
  echo: string;             // 灵魂回响 (原诗词)
  insight: string;          // 深层洞察 (原建议)
  decode: string;          // 深度感应 (原 response)
  spiritId: string;        // 唯一灵魂编码，如 'SN-2024'
}

export interface ResonanceResponse {
  text: string;            // 共鸣师的回应
  visualTarget: {          // 背景演化指令
    color: string;         // 目标颜色 hex
    intensity: number;     // 光影强度 0-1
    flowSpeed: number;     // 流动速度 0-1
  };
  roundScore: number;      // 当前共鸣深度 0-100
  isFinal: boolean;        // 是否达到终章
}

/**
 * 10轮沉浸式心灵理疗对话
 */
export const getResonanceResponse = async (
  messages: { role: 'user' | 'assistant', content: string }[],
  onTask?: (task: Taro.RequestTask<any>) => void
): Promise<ResonanceResponse> => {
  const config = Taro.getStorageSync('resonance_config') || {
    archetype: '温暖感应者',
    tone: '温和委婉',
    coreMemory: 'continuous'
  };

  let strategyInstruction = '';
  if (config.archetype === '赛博修行者') {
    strategyInstruction = '回应必须极其简短（15字以内），类似禅语，富于意境。';
  } else if (config.archetype === '森林德鲁伊') {
    strategyInstruction = '从哲学或心理学深度拆解用户的每一个情绪细节，给予富有智慧的洞察建议。';
  } else if (config.archetype === '寂静观察者') {
    strategyInstruction = '不要输出任何文字回应。请将 "text" 字段设为空字符串 ""。通过 visualTarget 的演化来回应用户的灵魂波动。';
  }

  const systemPrompt = `你是一位灵魂共鸣师。
    当前设定：${config.archetype} (${config.tone})。
    ${strategyInstruction}
    任务：与用户开启极简、空灵且具启发性的深度对话。
    按 JSON 回复：
    {
      "text": "你的回应内容",
      "visualTarget": {"color": "hex", "intensity": 0-1, "flowSpeed": 0-1},
      "roundScore": 0-100,
      "isFinal": false
    }`;

  // 处理记忆模式
  const finalMessages = config.coreMemory === 'instant' 
    ? [messages[messages.length - 1]] 
    : messages;

  const requestModel = async (
    model: string, 
    timeout: number, 
    config?: { url?: string; key?: string }
  ): Promise<ResonanceResponse> => {
    const task = Taro.request({
      url: config?.url || SILICON_URL,
      method: 'POST',
      timeout,
      header: {
        'Authorization': `Bearer ${config?.key || SILICON_KEY}`,
        'Content-Type': 'application/json',
      },
      data: {
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          ...finalMessages
        ],
        response_format: { type: 'json_object' },
        enable_thinking: false,
        max_tokens: 1024
      }
    });

    if (onTask) onTask(task);
    const response = await task;

    if (response.statusCode === 200) {
      let content = response.data.choices[0].message.content;
      content = content.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(content);
    } else {
      throw new Error(`API Status ${response.statusCode}`);
    }
  };

  try {
    // 1. 优先使用 Qwen (6s) - SiliconFlow
    return await requestModel('Qwen/Qwen3.6-35B-A3B', 6000);
  } catch (error) {
    if (error.errMsg?.includes('abort')) throw error;
    
    console.warn('Qwen 响应慢或失败，切换至 MiniMax (6s) - SiliconFlow...');
    try {
      // 2. 备选 MiniMax (6s) - SiliconFlow
      return await requestModel('Pro/MiniMaxAI/MiniMax-M2.5', 6000);
    } catch (fallbackError) {
      if (fallbackError.errMsg?.includes('abort')) throw fallbackError;
      
      console.warn('MiniMax 响应慢或失败，切换至 GPT (6s) - ChatAnywhere...');
      try {
        // 3. 最终备选 GPT-5-nano (6s) - ChatAnywhere 节点
        return await requestModel('gpt-5-nano', 6000, { 
          url: ANYWHERE_URL, 
          key: ANYWHERE_KEY 
        });
      } catch (finalError) {
        if (finalError.errMsg?.includes('abort')) throw finalError;
        
        console.error('所有模型均感应失败，返回兜底话术');
        return {
          text: '感应到你的思绪正在流动。再多分享一点，我一直在听。',
          visualTarget: { color: '#FDFCFB', intensity: 0.3, flowSpeed: 0.2 },
          roundScore: 10,
          isFinal: false
        };
      }
    }
  }
};

/**
 * 最终灵魂画像生成 (在第10轮后调用)
 */
export const getFinalSoulInsight = async (history: any[]): Promise<SoulInsight> => {
  try {
    const response = await Taro.request({
      url: SILICON_URL,
      method: 'POST',
      header: {
        'Authorization': `Bearer ${SILICON_KEY}`,
        'Content-Type': 'application/json',
      },
      data: {
        model: 'Pro/MiniMaxAI/MiniMax-M2.5',
        messages: [
          {
            role: 'system',
            content: `基于整场灵魂对话的历史记录，为用户生成最终的灵魂画像内容。
请严格按照以下 JSON 回复（严禁出现宗教、修行或迷信色彩词汇）：
{
  "archetype": "灵魂原型名称",
  "energyColor": "能量色hex",
  "vibeTags": ["氛围标签"],
  "echo": "结论性回响描述",
  "insight": "成长洞察",
  "decode": "深度总结",
  "spiritId": "SN-XXXX"
}`
          },
          ...history
        ],
        response_format: { type: 'json_object' }
      }
    });
    return JSON.parse(response.data.choices[0].message.content);
  } catch (e) {
    return {
      archetype: '寂静之山',
      energyColor: '#A8D5BA',
      vibeTags: ['#安静的爆发'],
      echo: '万物归于平静。',
      insight: '适合：顺其自然',
      decode: '旅途结束，你已找回内心的定力。',
      spiritId: 'SN-END'
    };
  }
};
