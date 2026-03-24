/**
 * Claude API 调用封装
 *
 * 自动判断运行环境：
 * - localhost 开发环境：走本地代理 /api/messages（避免 CORS）
 * - 线上部署环境：直连 Anthropic API（需开启 dangerous-direct-browser-access）
 */

const PROXY_ENDPOINT = '/api/messages';
const DIRECT_ENDPOINT = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';
const MAX_TOKENS = 2048;

function isLocalDev() {
  const host = window.location.hostname;
  return host === 'localhost' || host === '127.0.0.1';
}

/**
 * 调用 Claude API 生成 prompt
 * @param {string} apiKey - Anthropic API Key
 * @param {string} systemPrompt - 当前模式的 system prompt
 * @param {string} userMessage - 用户输入的自然语言描述
 * @returns {Promise<string>} 生成的 prompt 文本
 */
export async function generatePrompt(apiKey, systemPrompt, userMessage) {
  const useProxy = isLocalDev();
  const endpoint = useProxy ? PROXY_ENDPOINT : DIRECT_ENDPOINT;

  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': apiKey,
  };

  if (!useProxy) {
    headers['anthropic-version'] = '2023-06-01';
    headers['anthropic-dangerous-direct-browser-access'] = 'true';
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `API 请求失败 (${response.status})`);
  }

  const data = await response.json();
  return data.content?.[0]?.text || '未收到有效响应';
}
