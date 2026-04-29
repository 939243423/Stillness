const cloud = require('wx-server-sdk');
const axios = require('axios');

cloud.init({
  env: cloud.DYNAMIC_TYPE_ANY,
});

/**
 * 云函数 SILICON_KEY
 * 用于安全地调用 AI 接口
 */
exports.main = async (event, context) => {
  const { messages, useAnywhere = false, model } = event;

  // 从环境变量中获取 Key
  const SILICON_KEY = process.env.SILICON_KEY;
  const ANYWHERE_KEY = process.env.ANYWHERE_KEY;

  // 根据参数选择 URL 和 Key
  const url = useAnywhere
    ? 'https://api.chatanywhere.tech/v1/chat/completions'
    : 'https://api.siliconflow.cn/v1/chat/completions';

  const key = useAnywhere ? ANYWHERE_KEY : SILICON_KEY;
  
  // 默认模型设置
  const defaultModel = useAnywhere ? 'gpt-3.5-turbo' : 'deepseek-ai/DeepSeek-V3';

  try {
    const response = await axios({
      method: 'POST',
      url: url,
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      data: {
        model: model || defaultModel,
        messages: messages,
        temperature: 0.7,
        stream: false,
      },
      timeout: 30000, // 30秒超时
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('AI接口请求失败:', error);
    return {
      success: false,
      error: error.response ? error.response.data : error.message,
    };
  }
};
