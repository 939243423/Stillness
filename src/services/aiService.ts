import Taro from '@tarojs/taro';

const SILICON_KEY = 'sk-grregxjdqfcoutmccnxxtkuqingipcosydblwiyefekktdcr';
const BASE_URL = 'https://api.siliconflow.cn/v1/chat/completions';

export interface AIInsight {
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
export const getResonanceResponse = async (messages: { role: 'user' | 'assistant', content: string }[]): Promise<ResonanceResponse> => {
  const config = Taro.getStorageSync('resonance_config') || {
    archetype: '温暖感应者',
    tone: '温和委婉'
  };

  const systemPrompt = `你是一位灵魂共鸣师。
    当前设定：${config.archetype} (${config.tone})。
    任务：与用户开启极简、空灵且具启发性的深度对话。
    按 JSON 回复：
    {
      "text": "你的回应，40字以内",
      "visualTarget": {"color": "hex", "intensity": 0-1, "flowSpeed": 0-1},
      "roundScore": 0-100,
      "isFinal": false
    }`;

  try {
    const response = await Taro.request({
      url: BASE_URL,
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
            content: systemPrompt
          },
          ...messages
        ],
        temperature: 0.7,
        top_p: 0.7,
        max_tokens: 512,
        response_format: { type: 'json_object' }
      }
    });

    if (response.statusCode === 200) {
      let content = response.data.choices[0].message.content;
      content = content.replace(/```json/g, '').replace(/```/g, '').trim();
      
      try {
        return JSON.parse(content);
      } catch (e) {
        console.error('JSON Parse Error:', content);
        throw e;
      }
    } else {
      console.error('API Error Response:', response.data);
      throw new Error(`API Status ${response.statusCode}`);
    }
  } catch (error) {
    console.error('Therapy API Error:', error);
    return {
      text: '感应到你的思绪正在流动。再多分享一点，我一直在听。',
      visualTarget: { color: '#FDFCFB', intensity: 0.3, flowSpeed: 0.2 },
      roundScore: 10,
      isFinal: false
    };
  }
};

/**
 * 最终灵魂画像生成 (在第10轮后调用)
 */
export const getFinalSoulInsight = async (history: any[]): Promise<AIInsight> => {
  try {
    const response = await Taro.request({
      url: BASE_URL,
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
        temperature: 0.8,
        top_p: 0.7,
        max_tokens: 1024,
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
