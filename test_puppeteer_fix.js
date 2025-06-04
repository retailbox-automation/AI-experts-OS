#!/usr/bin/env node

/**
 * Тестовый скрипт для проверки работы Puppeteer на macOS
 * Этот скрипт решает проблему с путем к Chrome
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

console.log('🔍 Тестирование Puppeteer с правильной конфигурацией для macOS...\n');

async function testPuppeteer() {
  let browser = null;
  
  try {
    console.log('1. Попытка запуска Puppeteer с автоопределением Chrome...');
    
    // Конфигурация для macOS
    const launchOptions = {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    };

    // Если Chrome установлен в стандартном месте на macOS, указываем путь
    const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    if (fs.existsSync(chromePath)) {
      launchOptions.executablePath = chromePath;
      console.log('✅ Найден Chrome по пути:', chromePath);
    }
    
    browser = await puppeteer.launch(launchOptions);
    console.log('✅ Puppeteer успешно запущен!');
    
    console.log('\n2. Создание новой страницы...');
    const page = await browser.newPage();
    
    console.log('3. Навигация на Google...');
    await page.goto('https://www.google.com', { waitUntil: 'networkidle2', timeout: 30000 });
    
    console.log('4. Создание скриншота...');
    const screenshotPath = path.join(__dirname, 'test_screenshot.png');
    await page.screenshot({ 
      path: screenshotPath,
      fullPage: false,
      clip: { x: 0, y: 0, width: 1200, height: 800 }
    });
    
    console.log('✅ Скриншот сохранен в:', screenshotPath);
    
    console.log('5. Получение заголовка страницы...');
    const title = await page.title();
    console.log('✅ Заголовок страницы:', title);
    
    await browser.close();
    console.log('\n🎉 Тест Puppeteer завершен успешно!');
    
    return true;
    
  } catch (error) {
    console.error('❌ Ошибка при тестировании Puppeteer:', error.message);
    
    if (browser) {
      await browser.close();
    }
    
    console.log('\n🔧 Рекомендации по устранению проблемы:');
    console.log('1. Убедитесь, что Chrome установлен');
    console.log('2. Установите puppeteer: npm install puppeteer');
    console.log('3. Попробуйте переустановить Chrome');
    
    return false;
  }
}

// Проверяем наличие puppeteer
try {
  require.resolve('puppeteer');
  console.log('✅ Puppeteer найден в node_modules');
} catch (error) {
  console.log('❌ Puppeteer не найден. Устанавливаю...');
  const { execSync } = require('child_process');
  try {
    execSync('npm install puppeteer', { stdio: 'inherit' });
    console.log('✅ Puppeteer успешно установлен');
  } catch (installError) {
    console.error('❌ Не удалось установить Puppeteer:', installError.message);
    process.exit(1);
  }
}

// Запускаем тест
testPuppeteer()
  .then(success => {
    if (success) {
      console.log('\n📋 Следующие шаги:');
      console.log('1. Puppeteer работает корректно');
      console.log('2. Можно использовать MCP сервер');
      console.log('3. Настройте executablePath в конфигурации если нужно');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('❌ Критическая ошибка:', error.message);
    process.exit(1);
  }); 