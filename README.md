# Prompt Generator

自然语言 → 结构化 Prompt，支持对话 / 图像 / 代码三种场景。

🔗 **在线体验**：[https://xinanli2001-cell.github.io/prompt-generator/](https://xinanli2001-cell.github.io/prompt-generator/)

![preview](https://img.shields.io/badge/status-live-brightgreen) ![license](https://img.shields.io/badge/license-MIT-blue)

## 功能

| 模式 | 输入 | 输出 |
|------|------|------|
| 💬 对话 AI | 中文场景描述 | 结构化 prompt（含角色定义、输出格式） |
| 🎨 图像生成 | 中文画面描述 | 英文关键词串（主体/风格/光线/质量词） |
| 💻 代码生成 | 中文功能描述 | 英文代码 prompt（含语言、函数签名、边界条件） |

## 快速开始

### 在线使用

1. 打开 [在线地址](https://xinanli2001-cell.github.io/prompt-generator/)
2. 输入你的 [OpenRouter API Key](https://openrouter.ai/keys)
3. 选择模式，输入描述，点击生成

### 本地运行

```bash
git clone https://github.com/xinanli2001-cell/prompt-generator.git
cd prompt-generator

# 方式一：直接打开（纯静态，无需安装）
open index.html

# 方式二：用任意静态服务器
npx serve .
```

## 技术栈

- **前端**：原生 HTML / CSS / JS（ES Modules），零依赖
- **API**：OpenRouter（兼容 OpenAI 格式，支持多种模型）
- **部署**：GitHub Pages，自动 CI/CD

## 项目结构

```
├── index.html          # 页面结构
├── css/
│   └── style.css       # 样式（Google Translate 风格）
├── js/
│   ├── app.js          # UI 交互逻辑
│   ├── api.js          # API 调用封装
│   └── prompts.js      # 三种模式的 system prompt
└── .github/
    └── workflows/
        └── pages.yml   # GitHub Pages 自动部署
```

## 自定义模型

编辑 `js/api.js` 中的 `MODEL` 变量，可切换为 OpenRouter 支持的任意模型：

```js
const MODEL = 'google/gemini-2.5-flash';       // 当前默认
const MODEL = 'anthropic/claude-sonnet-4.6';    // Claude
const MODEL = 'openai/gpt-4o';                 // GPT-4o
```

完整模型列表见 [OpenRouter Models](https://openrouter.ai/models)。

## License

MIT
