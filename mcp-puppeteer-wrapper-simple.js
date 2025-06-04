#!/usr/bin/env node

/**
 * ПРОСТАЯ обертка для MCP сервера Puppeteer
 * Современный Puppeteer (23+) работает OOTB на macOS M1
 * Никаких дополнительных настроек не требуется!
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

console.error('[MCP Puppeteer Simple] Запуск MCP сервера Puppeteer');
console.error(`[MCP Puppeteer Simple] Система: ${process.platform} ${process.arch}, Node.js: ${process.version}`);

// Находим MCP сервер
const mcpServerPath = path.join(__dirname, 'node_modules/@modelcontextprotocol/server-puppeteer/dist/index.js');

if (!fs.existsSync(mcpServerPath)) {
  console.error(`[MCP Puppeteer Simple] ОШИБКА: MCP сервер не найден: ${mcpServerPath}`);
  process.exit(1);
}

console.error(`[MCP Puppeteer Simple] MCP сервер найден: ${mcpServerPath}`);

// Просто запускаем MCP сервер - современный Puppeteer работает сам!
const mcpProcess = spawn(process.execPath, [mcpServerPath], {
  stdio: 'inherit',
  env: { ...process.env }
});

mcpProcess.on('error', (error) => {
  console.error(`[MCP Puppeteer Simple] Ошибка: ${error.message}`);
  process.exit(1);
});

mcpProcess.on('exit', (code, signal) => {
  console.error(`[MCP Puppeteer Simple] Завершен: код=${code}, сигнал=${signal}`);
  process.exit(code || 0);
});

// Обработка сигналов
process.on('SIGTERM', () => {
  console.error('[MCP Puppeteer Simple] Получен SIGTERM, завершаем...');
  mcpProcess.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.error('[MCP Puppeteer Simple] Получен SIGINT, завершаем...');
  mcpProcess.kill('SIGINT');
});

console.error('[MCP Puppeteer Simple] MCP сервер запущен'); 