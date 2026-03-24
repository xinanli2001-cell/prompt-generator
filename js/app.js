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
const outputSection = $('#outputSection');
const outputBox = $('#outputBox');
const copyBtn = $('#copyBtn');
const apiKeyInput = $('#apiKey');
const toastEl = $('#toast');

// ── API Key 持久化 ──
apiKeyInput.value = localStorage.getItem('claude_api_key') || '';
apiKeyInput.addEventListener('change', () => {
  localStorage.setItem('claude_api_key', apiKeyInput.value.trim());
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
  btn.innerHTML = '生成中<span class="loading-dots"></span>';
  outputSection.classList.add('visible');
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
    btn.textContent = '生成 Prompt';
  }
}

btn.addEventListener('click', handleGenerate);
inputEl.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') handleGenerate();
});

// ── 复制结果 ──
copyBtn.addEventListener('click', () => {
  const text = outputBox.textContent;
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => showToast('已复制到剪贴板'));
});

// ── Toast 提示 ──
function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  setTimeout(() => toastEl.classList.remove('show'), 2000);
}
