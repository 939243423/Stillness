import Taro from '@tarojs/taro';

/**
 * 灵魂共鸣 AI 服务 (云开发版)
 * 已移除本地 API Key，统一通过云函数 SILICON_KEY 进行中转请求
 */

export interface SoulInsight {
  archetype: string;
  energyColor: string;
  vibeTags: string[];
  echo: string;
  insight: string;
  decode: string;
  spiritId: string;
}

export interface ResonanceResponse {
  text: string;
  visualTarget: {
    color: string;
    intensity: number;
    flowSpeed: number;
  };
  roundScore: number;
  isFinal: boolean;
}

/**
 * 核心：调用云函数进行 AI 感应
 */
const callAiCloud = async (messages: any[], useAnywhere: boolean = false): Promise<any> => {
  const res = await Taro.cloud.callFunction({
    name: 'SILICON_KEY',
    data: {
      messages,
      useAnywhere,
      model: useAnywhere ? 'gpt-3.5-turbo' : 'deepseek-ai/DeepSeek-V3'
    }
  });

  const result = res.result as any;
  if (!result || !result.success) {
    throw new Error(result?.error || '云端感应频率失联');
  }

  let content = result.data.choices[0].message.content;
  // 清理可能存在的 markdown 标记
  content = content.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(content);
};

/**
 * 获取即时共鸣回响
 */
export const getResonanceResponse = async (
  messages: { role: 'user' | 'assistant', content: string }[],
  _onTask?: (task: any) => void
): Promise<ResonanceResponse> => {
  const config = Taro.getStorageSync('resonance_config') || {
    archetype: '温暖感应者',
    tone: '温和委婉'
  };

  const systemPrompt = `你是一位游历于意识边缘的“灵魂共鸣师”。
    当前感应频率：${config.archetype} (${config.tone})。
    请捕捉用户言语背后的情绪波音，给予空灵、简约且具哲学深度的共鸣。
    请严格按以下 JSON 格式回应：
    {
      "text": "此处为你的共鸣回响",
      "visualTarget": {"color": "建议背景色hex", "intensity": 0-1, "flowSpeed": 0-1},
      "roundScore": 0-100,
      "isFinal": false
    }`;

  const finalMessages = [{ role: 'system', content: systemPrompt }, ...messages];

  try {
    // 优先尝试 SiliconFlow (DeepSeek)
    return await callAiCloud(finalMessages, false);
  } catch (error) {
    console.warn('SiliconFlow 响应异常，尝试备选节点...', error);
    try {
      // 备选节点 (ChatAnywhere)
      return await callAiCloud(finalMessages, true);
    } catch (fallbackError) {
      console.error('所有模型均感应失败');
      return {
        text: '感应到你的思绪正在流动。再多分享一点，我一直在听。',
        visualTarget: { color: '#FDFCFB', intensity: 0.3, flowSpeed: 0.2 },
        roundScore: 10,
        isFinal: false
      };
    }
  }
};

/**
 * 最终灵魂画像生成
 */
export const getFinalSoulInsight = async (history: any[]): Promise<SoulInsight> => {
  const prompt = `基于整场灵魂对话的历史记录，为用户生成最终的灵魂画像内容。请严格按照以下 JSON 回复：
  {
    "archetype": "灵魂原型名称",
    "energyColor": "能量色hex",
    "vibeTags": ["标签1", "标签2"],
    "echo": "结论性回响描述",
    "insight": "成长洞察",
    "decode": "深度总结",
    "spiritId": "SN-XXXX"
  }`;

  try {
    return await callAiCloud([...history, { role: 'user', content: prompt }], false);
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
