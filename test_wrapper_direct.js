#!/usr/bin/env node

/**
 * Простой тест для проверки работы обертки MCP сервера
 */

const { spawn } = require('child_process');

console.log('🔍 Тестирование MCP обертки Puppeteer...\n');

const mcpProcess = spawn('node', ['./mcp-puppeteer-wrapper.js'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

let hasInitialized = false;

mcpProcess.stdout.on('data', (data) => {
  const output = data.toString().trim();
  console.log('📤 MCP Output:', output);
  
  // Если получили JSON ответ от MCP сервера, отправим команду навигации
  if (output.includes('"jsonrpc"') && !hasInitialized) {
    hasInitialized = true;
    console.log('\n🚀 Отправляем команду навигации...');
    
    const navigateCommand = JSON.stringify({
      jsonrpc: "2.0",
      id: 2,
      method: "tools/call",
      params: {
        name: "puppeteer_navigate",
        arguments: {
          url: "https://www.google.com"
        }
      }
    }) + '\n';
    
    mcpProcess.stdin.write(navigateCommand);
  }
});

mcpProcess.stderr.on('data', (data) => {
  console.log('📤 MCP Stderr:', data.toString().trim());
});

mcpProcess.on('close', (code) => {
  console.log(`\n🔚 MCP процесс завершен с кодом: ${code}`);
  process.exit(code);
});

mcpProcess.on('error', (error) => {
  console.error('❌ Ошибка запуска MCP:', error.message);
  process.exit(1);
});

// Отправляем инициализацию
setTimeout(() => {
  console.log('📨 Отправляем инициализацию...');
  const initMessage = JSON.stringify({
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: {
      protocolVersion: "2024-11-05",
      capabilities: {
        roots: {
          listChanged: true
        },
        sampling: {}
      },
      clientInfo: {
        name: "test-client",
        version: "1.0.0"
      }
    }
  }) + '\n';
  
  mcpProcess.stdin.write(initMessage);
}, 1000);

// Закрываем через 15 секунд
setTimeout(() => {
  console.log('\n⏰ Завершение тестирования...');
  mcpProcess.kill('SIGTERM');
}, 15000); 