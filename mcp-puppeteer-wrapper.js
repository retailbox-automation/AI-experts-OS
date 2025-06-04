#!/usr/bin/env node

/**
 * Обертка для MCP сервера Puppeteer с правильной конфигурацией для macOS
 * Решает проблему с путем к исполняемому файлу Chrome
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Настройка переменных окружения для Puppeteer
const chromePaths = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/opt/google/chrome/google-chrome'
];

// Найдем доступный Chrome
let chromeExecutable = null;
for (const chromePath of chromePaths) {
  if (fs.existsSync(chromePath)) {
    chromeExecutable = chromePath;
    break;
  }
}

if (chromeExecutable) {
  console.error(`[MCP Puppeteer Wrapper] Найден Chrome: ${chromeExecutable}`);
  process.env.PUPPETEER_EXECUTABLE_PATH = chromeExecutable;
} else {
  console.error('[MCP Puppeteer Wrapper] ВНИМАНИЕ: Chrome не найден в стандартных местах');
}

// Настройки для headless режима
process.env.PUPPETEER_ARGS = JSON.stringify([
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-dev-shm-usage',
  '--disable-accelerated-2d-canvas',
  '--no-first-run',
  '--no-zygote',
  '--disable-gpu',
  '--disable-background-timer-throttling',
  '--disable-backgrounding-occluded-windows',
  '--disable-renderer-backgrounding'
]);

console.error('[MCP Puppeteer Wrapper] Настройки Puppeteer применены');

// Теперь запускаем оригинальный MCP сервер
try {
  const serverPath = path.join(__dirname, 'node_modules/@modelcontextprotocol/server-puppeteer/dist/index.js');
  console.error(`[MCP Puppeteer Wrapper] Запуск MCP сервера: ${serverPath}`);
  
  if (!fs.existsSync(serverPath)) {
    throw new Error(`MCP сервер не найден по пути: ${serverPath}`);
  }
  
  // Запускаем MCP сервер как дочерний процесс
  const mcpServer = spawn('node', [serverPath], {
    stdio: 'inherit',
    env: { ...process.env }
  });
  
  mcpServer.on('error', (error) => {
    console.error('[MCP Puppeteer Wrapper] Ошибка запуска:', error.message);
    process.exit(1);
  });
  
  mcpServer.on('exit', (code, signal) => {
    console.error(`[MCP Puppeteer Wrapper] MCP сервер завершен с кодом: ${code}, сигнал: ${signal}`);
    process.exit(code);
  });
  
} catch (error) {
  console.error('[MCP Puppeteer Wrapper] Ошибка запуска MCP сервера:', error.message);
  process.exit(1);
} 