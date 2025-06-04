#!/usr/bin/env node

/**
 * Современная обертка для MCP сервера Puppeteer (версия 2.0)
 * Совместима с Puppeteer 23+ и Apple Silicon M1/M2
 * Использует официально поддерживаемые методы
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

console.error('[MCP Puppeteer Wrapper v2] Современная обертка для Apple Silicon');

// Проверяем версию Node.js и архитектуру
console.error(`[MCP Puppeteer Wrapper v2] Node.js: ${process.version}, Arch: ${process.arch}, Platform: ${process.platform}`);

// Для современного Puppeteer (23+) на macOS M1:
// 1. Puppeteer должен автоматически загружать правильную версию Chrome
// 2. Если есть проблемы, используем системный Chrome как fallback

let launchOptions = {
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--no-first-run',
    '--no-zygote',
    '--disable-gpu',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-renderer-backgrounding',
    '--disable-ipc-flooding-protection'
  ]
};

// Проверяем, нужен ли fallback на системный Chrome
const systemChromePaths = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/opt/homebrew/bin/chromium',
  '/usr/local/bin/chromium'
];

let systemChrome = null;
for (const chromePath of systemChromePaths) {
  if (fs.existsSync(chromePath)) {
    systemChrome = chromePath;
    console.error(`[MCP Puppeteer Wrapper v2] Найден системный Chrome: ${systemChrome}`);
    break;
  }
}

// Для Apple Silicon лучше использовать системный Chrome как fallback
if (process.arch === 'arm64' && process.platform === 'darwin' && systemChrome) {
  launchOptions.executablePath = systemChrome;
  console.error(`[MCP Puppeteer Wrapper v2] Используем системный Chrome для Apple Silicon: ${systemChrome}`);
}

// Устанавливаем конфигурацию через переменные окружения
process.env.PUPPETEER_LAUNCH_OPTIONS = JSON.stringify(launchOptions);
process.env.ALLOW_DANGEROUS = 'true';

console.error(`[MCP Puppeteer Wrapper v2] PUPPETEER_LAUNCH_OPTIONS: ${process.env.PUPPETEER_LAUNCH_OPTIONS}`);

// Находим MCP сервер
const mcpServerPath = path.join(__dirname, 'node_modules/@modelcontextprotocol/server-puppeteer/dist/index.js');

if (!fs.existsSync(mcpServerPath)) {
  console.error(`[MCP Puppeteer Wrapper v2] ОШИБКА: MCP сервер не найден: ${mcpServerPath}`);
  process.exit(1);
}

console.error(`[MCP Puppeteer Wrapper v2] Запуск MCP сервера: ${mcpServerPath}`);

// Запускаем MCP сервер
const mcpProcess = spawn(process.execPath, [mcpServerPath], {
  stdio: 'inherit',
  env: { ...process.env }
});

mcpProcess.on('error', (error) => {
  console.error(`[MCP Puppeteer Wrapper v2] Ошибка: ${error.message}`);
  process.exit(1);
});

mcpProcess.on('exit', (code, signal) => {
  console.error(`[MCP Puppeteer Wrapper v2] Завершен: код=${code}, сигнал=${signal}`);
  process.exit(code);
});

// Обработка сигналов
process.on('SIGTERM', () => {
  console.error('[MCP Puppeteer Wrapper v2] Получен SIGTERM, завершаем...');
  mcpProcess.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.error('[MCP Puppeteer Wrapper v2] Получен SIGINT, завершаем...');
  mcpProcess.kill('SIGINT');
});

console.error('[MCP Puppeteer Wrapper v2] MCP сервер запущен успешно'); 