const cloud = require('wx-server-sdk');
const tcb = require('@cloudbase/node-sdk');
const axios = require('axios');

cloud.init({
  env: cloud.DYNAMIC_TYPE_ANY,
});

const app = tcb.init({
  env: cloud.DYNAMIC_TYPE_ANY,
});
const ai = app.ai();

/**
 * 云函数 SILICON_KEY
 * 集成了混元 (Hunyuan) 和 SiliconFlow (DeepSeek/MiniMax)
 */
exports.main = async (event, context) => {
  const { messages, useAnywhere = false } = event;

  // 1. 策略选择：从环境变量获取供应商，默认优先使用混元
  const provider = process.env.PROVIDER || 'hunyuan';

  if (provider === 'hunyuan' && !useAnywhere) {
    try {
      // 混元体验模型 (hunyuan-exp)
      const model = ai.createModel("hunyuan-exp");
      const res = await model.generateText({
        model: "hunyuan-2.0-instruct-20251111", // 推荐使用的混元模型
        messages: messages,
      });

      // 封装成兼容前端的 OpenAI 格式
      return {
        success: true,
        data: {
          choices: [{
            message: {
              content: res.text
            }
          }]
        }
      };
    } catch (error) {
      console.error('混元模型调用失败，尝试备选方案:', error);
      // 如果混元失败且没有强制锁定，可以继续往下走尝试备选方案
    }
  }

  // 2. SiliconFlow / ChatAnywhere 备选方案
  const SILICON_KEY = process.env.SILICON_KEY;
  const ANYWHERE_KEY = process.env.ANYWHERE_KEY;

  const url = useAnywhere
    ? 'https://api.chatanywhere.tech/v1/chat/completions'
    : 'https://api.siliconflow.cn/v1/chat/completions';

  const key = useAnywhere ? ANYWHERE_KEY : SILICON_KEY;
  const defaultModel = useAnywhere ? 'gpt-3.5-turbo' : 'Pro/MiniMaxAI/MiniMax-M2.5';

  try {
    const response = await axios({
      method: 'POST',
      url: url,
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      data: {
        model: defaultModel,
        messages: messages,
        temperature: 0.7,
        stream: false,
      },
      timeout: 30000,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('AI接口请求最终失败:', error);
    return {
      success: false,
      error: error.response ? error.response.data : error.message,
    };
  }
};
