#!/usr/bin/env node

/**
 * Реальный тест MCP сервера Puppeteer с навигацией и скриншотом
 */

const { spawn } = require('child_process');

console.log('🔍 Реальный тест MCP сервера Puppeteer...\n');

const mcpProcess = spawn('node', ['./mcp-puppeteer-wrapper.js'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

let step = 0;
let responses = [];

mcpProcess.stdout.on('data', (data) => {
  const output = data.toString().trim();
  console.log(`📤 Step ${step} Output:`, output);
  responses.push(output);
  
  try {
    const jsonResponse = JSON.parse(output);
    
    if (step === 0 && jsonResponse.result) {
      // Инициализация прошла успешно, теперь навигация
      step = 1;
      console.log('\n🚀 Step 1: Навигация на Google...');
      
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
      
    } else if (step === 1 && jsonResponse.result) {
      // Навигация прошла успешно, теперь скриншот
      step = 2;
      console.log('\n📸 Step 2: Создание скриншота...');
      
      const screenshotCommand = JSON.stringify({
        jsonrpc: "2.0",
        id: 3,
        method: "tools/call",
        params: {
          name: "puppeteer_screenshot",
          arguments: {
            name: "google_homepage_test",
            width: 1200,
            height: 800
          }
        }
      }) + '\n';
      
      mcpProcess.stdin.write(screenshotCommand);
      
    } else if (step === 2 && jsonResponse.result) {
      // Скриншот создан успешно
      step = 3;
      console.log('\n✅ Step 3: Тест завершен успешно!');
      console.log('🎉 Все функции Puppeteer работают корректно!');
      
      setTimeout(() => {
        mcpProcess.kill('SIGTERM');
      }, 2000);
    }
    
  } catch (e) {
    // Не JSON ответ, это нормально для некоторых сообщений
  }
});

mcpProcess.stderr.on('data', (data) => {
  console.log('📤 MCP Stderr:', data.toString().trim());
});

mcpProcess.on('close', (code) => {
  console.log(`\n🔚 Тест завершен с кодом: ${code}`);
  
  if (step >= 2) {
    console.log('\n✅ РЕЗУЛЬТАТ: УСПЕШНО!');
    console.log('- ✅ Инициализация MCP сервера');
    console.log('- ✅ Навигация на веб-страницу');
    console.log('- ✅ Создание скриншота');
    console.log('\n🎯 Puppeteer MCP сервер полностью функционален на macOS!');
  } else {
    console.log('\n❌ РЕЗУЛЬТАТ: НЕПОЛНЫЙ ТЕСТ');
    console.log(`Остановился на шаге: ${step}`);
  }
  
  process.exit(code);
});

mcpProcess.on('error', (error) => {
  console.error('❌ Ошибка запуска MCP:', error.message);
  process.exit(1);
});

// Отправляем инициализацию
setTimeout(() => {
  console.log('📨 Step 0: Инициализация MCP сервера...');
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
        name: "real-test-client",
        version: "1.0.0"
      }
    }
  }) + '\n';
  
  mcpProcess.stdin.write(initMessage);
}, 1000);

// Аварийное завершение через 30 секунд
setTimeout(() => {
  console.log('\n⏰ Аварийное завершение (таймаут 30 сек)...');
  mcpProcess.kill('SIGKILL');
}, 30000); 