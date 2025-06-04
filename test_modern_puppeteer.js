#!/usr/bin/env node

/**
 * Тест современного Puppeteer на macOS M1
 * Проверяет работу Puppeteer 24+ без дополнительных настроек
 */

console.log('🔍 Тестирование современного Puppeteer на macOS M1...\n');

async function testModernPuppeteer() {
  try {
    const puppeteer = require('puppeteer');
    console.log('✅ Puppeteer импортирован успешно');
    
    console.log(`📊 Информация о системе:
- Node.js: ${process.version}
- Архитектура: ${process.arch}
- Платформа: ${process.platform}
- Версия Puppeteer: ${puppeteer.version || 'неизвестно'}`);

    console.log('\n🚀 Попытка запуска браузера без дополнительных настроек...');
    
    // Тестируем modern Puppeteer OOTB
    const browser = await puppeteer.launch({
      headless: true
    });
    
    console.log('✅ Браузер запущен успешно!');
    
    const page = await browser.newPage();
    console.log('✅ Страница создана');
    
    await page.goto('https://www.google.com');
    console.log('✅ Навигация на Google выполнена');
    
    const title = await page.title();
    console.log(`✅ Заголовок страницы: ${title}`);
    
    // Проверяем путь к исполняемому файлу
    const browserProcess = browser.process();
    if (browserProcess && browserProcess.spawnfile) {
      console.log(`✅ Путь к Chrome: ${browserProcess.spawnfile}`);
    }
    
    await browser.close();
    console.log('✅ Браузер закрыт');
    
    console.log('\n🎉 ТЕСТ УСПЕШЕН! Современный Puppeteer работает OOTB на macOS M1!');
    return true;
    
  } catch (error) {
    console.error('❌ ОШИБКА:', error.message);
    
    console.log('\n🔄 Пробуем с системным Chrome...');
    
    // Fallback на системный Chrome
    try {
      const fs = require('fs');
      const chromePaths = [
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        '/Applications/Chromium.app/Contents/MacOS/Chromium',
        '/opt/homebrew/bin/chromium'
      ];
      
      let systemChrome = null;
      for (const chromePath of chromePaths) {
        if (fs.existsSync(chromePath)) {
          systemChrome = chromePath;
          break;
        }
      }
      
      if (!systemChrome) {
        throw new Error('Системный Chrome не найден');
      }
      
      console.log(`🔧 Используем системный Chrome: ${systemChrome}`);
      
      const puppeteer = require('puppeteer');
      const browser = await puppeteer.launch({
        headless: true,
        executablePath: systemChrome,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      console.log('✅ Браузер запущен с системным Chrome!');
      
      const page = await browser.newPage();
      await page.goto('https://www.google.com');
      const title = await page.title();
      console.log(`✅ Заголовок: ${title}`);
      
      await browser.close();
      
      console.log('\n🎉 FALLBACK УСПЕШЕН! Puppeteer работает с системным Chrome!');
      return true;
      
    } catch (fallbackError) {
      console.error('❌ FALLBACK ОШИБКА:', fallbackError.message);
      return false;
    }
  }
}

testModernPuppeteer().then(success => {
  console.log(`\n📈 Результат: ${success ? 'УСПЕХ' : 'НЕУДАЧА'}`);
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('💥 Критическая ошибка:', error);
  process.exit(1);
}); 