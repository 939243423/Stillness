# 灵魂共鸣 (Soul Resonance) 🌿

一个基于 AI 驱动的沉浸式灵魂对话小程序。通过捕捉用户言语背后的情绪波音，提供空灵、简约且具哲学深度的共鸣回响。

## ✨ 项目核心特性

- **沉浸式 AI 对话**：集成 DeepSeek-V3 与 GPT 双模型备份，提供极高稳定性的心灵感应。
- **视觉演化系统**：背景色彩与光影会根据对话的情绪深度动态演化。
- **云端安全架构**：所有 AI 秘钥均存储于微信云开发环境变量中，前端 0 泄露风险。
- **隐私合规适配**：深度适配微信最新隐私保护指引，确保用户数据安全与合规。
- **极简设计美学**：拒绝繁杂，回归心灵本质的 UI/UX 设计。

## 🛠 技术栈

- **框架**：[Taro v3](https://taro.jd.com/) (React)
- **后端**：[微信云开发](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html) (Cloud Functions)
- **AI 引擎**：SiliconFlow (DeepSeek-V3) + ChatAnywhere (GPT-3.5/4)
- **样式**：Sass + 动态内联样式控制背景演化

## 📂 项目结构

```text
├── cloudfunctions/        # 云函数目录
│   └── SILICON_KEY/       # AI 代理中转函数
├── src/
│   ├── components/        # 公用组件（如隐私弹窗）
│   ├── pages/             # 页面文件
│   ├── services/          # 核心业务逻辑（AI 请求、音频处理）
│   └── app.tsx            # 应用入口（云开发初始化）
├── project.config.json    # 小程序配置文件
└── package.json           # 项目依赖
```

## 🚀 快速开始

### 1. 克隆与安装
```bash
npm install
```

### 2. 环境配置
1. 在微信开发者工具中开启 **云开发**。
2. 在云开发控制台 -> 环境 -> 环境变量中添加：
   - `SILICON_KEY`: 你的 SiliconFlow API Key
   - `ANYWHERE_KEY`: 你的备选节点 API Key

### 3. 部署云函数
- 右键点击 `cloudfunctions/SILICON_KEY`。
- 选择 **“上传并部署：所有文件”**。

### 4. 本地开发
```bash
npm run dev:weapp
```

## 📜 开发协议
本项目在 UI 复制和文案产出上严格遵循**专业、客观、非宗教化**的原则。

---
*心之所向，境随心转。*
