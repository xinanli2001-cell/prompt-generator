/**
 * UI 交互逻辑：模式切换、事件绑定、结果展示
 */

import { MODE_CONFIG } from './prompts.js';
import { generatePrompt } from './api.js';

// State
let currentMode = 'chat';

// DOM elements
const $ = (sel) => document.querySelector(sel);
const tabs = document.querySelectorAll('.mode-tab');
const inputEl = $('#userInput');
const inputLabel = $('#inputLabel');
const btn = $('#generateBtn');
const outputBox = $('#outputBox');
const outputPlaceholder = $('#outputPlaceholder');
const copyBtn = $('#copyBtn');
const apiKeyInput = $('#apiKey');
const toastEl = $('#toast');
const charCount = $('#charCount');

// ── API Key 持久化 ──
apiKeyInput.value = localStorage.getItem('claude_api_key') || '';
apiKeyInput.addEventListener('change', () => {
  localStorage.setItem('claude_api_key', apiKeyInput.value.trim());
});

// ── 字数统计 ──
inputEl.addEventListener('input', () => {
  charCount.textContent = inputEl.value.length;
});

// ── 模式切换 ──
function switchMode(mode) {
  currentMode = mode;
  const config = MODE_CONFIG[mode];

  tabs.forEach((t) => t.classList.remove('active'));
  document.querySelector(`.mode-tab[data-mode="${mode}"]`).classList.add('active');

  inputEl.placeholder = config.placeholder;
  inputLabel.textContent = config.label;
  btn.dataset.mode = mode;
}

tabs.forEach((tab) => {
  tab.addEventListener('click', () => switchMode(tab.dataset.mode));
});

// ── 生成 ──
async function handleGenerate() {
  const apiKey = apiKeyInput.value.trim();
  if (!apiKey) { showToast('请先输入 API Key'); return; }

  const userText = inputEl.value.trim();
  if (!userText) { showToast('请输入描述内容'); return; }

  btn.disabled = true;
  btn.innerHTML = '<span class="loading-dots">生成中</span>';

  if (outputPlaceholder) outputPlaceholder.style.display = 'none';
  outputBox.textContent = '';

  try {
    const text = await generatePrompt(
      apiKey,
      MODE_CONFIG[currentMode].systemPrompt,
      userText,
    );
    outputBox.textContent = text;
  } catch (e) {
    outputBox.textContent = '错误: ' + e.message;
  } finally {
    btn.disabled = false;
    btn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
      生成`;
  }
}

btn.addEventListener('click', handleGenerate);
inputEl.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') handleGenerate();
});

// ── 复制结果 ──
copyBtn.addEventListener('click', () => {
  const text = outputBox.textContent;
  if (!text || text === '结果将在这里显示...') return;
  navigator.clipboard.writeText(text).then(() => showToast('已复制到剪贴板'));
});

// ── Toast 提示 ──
function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  setTimeout(() => toastEl.classList.remove('show'), 2000);
}
