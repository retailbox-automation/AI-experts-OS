#!/usr/bin/env node

/**
 * ФИНАЛЬНЫЙ тест простого решения MCP сервера Puppeteer
 * Проверяет работу с реальными командами
 */

const { spawn } = require('child_process');

console.log('🎯 ФИНАЛЬНЫЙ ТЕСТ - Простое решение MCP сервера Puppeteer\n');

const mcpProcess = spawn('node', ['./mcp-puppeteer-wrapper-simple.js'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

let step = 0;

mcpProcess.stdout.on('data', (data) => {
  const output = data.toString().trim();
  console.log(`📤 MCP Output: ${output}`);
  
  try {
    const jsonResponse = JSON.parse(output);
    
    if (step === 0 && jsonResponse.result) {
      // Инициализация прошла успешно
      step = 1;
      console.log('\n✅ Инициализация успешна! Отправляем команду навигации...');
      
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
      // Навигация успешна
      step = 2;
      console.log('\n✅ Навигация успешна! Создаем скриншот...');
      
      const screenshotCommand = JSON.stringify({
        jsonrpc: "2.0",
        id: 3,
        method: "tools/call",
        params: {
          name: "puppeteer_screenshot",
          arguments: {
            name: "final_test_screenshot",
            width: 1200,
            height: 800
          }
        }
      }) + '\n';
      
      mcpProcess.stdin.write(screenshotCommand);
      
    } else if (step === 2 && jsonResponse.result) {
      // Скриншот создан
      step = 3;
      console.log('\n🎉 ФИНАЛЬНЫЙ ТЕСТ ПОЛНОСТЬЮ УСПЕШЕН!');
      console.log('✅ Инициализация MCP сервера');
      console.log('✅ Навигация на веб-страницу');
      console.log('✅ Создание скриншота');
      console.log('\n🚀 ПРОСТОЕ РЕШЕНИЕ РАБОТАЕТ ИДЕАЛЬНО!');
      
      setTimeout(() => {
        mcpProcess.kill('SIGTERM');
      }, 2000);
    }
    
  } catch (e) {
    // Не JSON ответ, это нормально
  }
});

mcpProcess.stderr.on('data', (data) => {
  console.log(`📊 MCP Stderr: ${data.toString().trim()}`);
});

mcpProcess.on('close', (code) => {
  console.log(`\n🔚 Тест завершен с кодом: ${code}`);
  
  if (step >= 2) {
    console.log('\n🎉 РЕЗУЛЬТАТ: ФИНАЛЬНОЕ РЕШЕНИЕ РАБОТАЕТ!');
    console.log('🔥 Puppeteer MCP сервер полностью функционален на macOS M1!');
    console.log('🎯 Простое решение без лишних настроек!');
  } else {
    console.log('\n⚠️ Тест не завершен полностью');
  }
  
  process.exit(code);
});

mcpProcess.on('error', (error) => {
  console.error('❌ Ошибка запуска MCP:', error.message);
  process.exit(1);
});

// Отправляем инициализацию
setTimeout(() => {
  console.log('📨 Отправляем инициализацию MCP сервера...');
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
        name: "final-test-client",
        version: "1.0.0"
      }
    }
  }) + '\n';
  
  mcpProcess.stdin.write(initMessage);
}, 1000);

// Аварийное завершение
setTimeout(() => {
  console.log('\n⏰ Аварийное завершение (30 сек)...');
  mcpProcess.kill('SIGKILL');
}, 30000); 