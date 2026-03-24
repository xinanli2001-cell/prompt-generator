/**
 * OpenRouter API 调用封装
 * 支持浏览器直连，无需后端代理
 */

const API_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'anthropic/claude-sonnet-4-20250514';
const MAX_TOKENS = 2048;

/**
 * 调用 OpenRouter API 生成 prompt
 * @param {string} apiKey - OpenRouter API Key
 * @param {string} systemPrompt - 当前模式的 system prompt
 * @param {string} userMessage - 用户输入的自然语言描述
 * @returns {Promise<string>} 生成的 prompt 文本
 */
export async function generatePrompt(apiKey, systemPrompt, userMessage) {
  const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': window.location.origin,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `API 请求失败 (${response.status})`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '未收到有效响应';
}
