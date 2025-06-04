const puppeteer = require('puppeteer');
const path = require('path');

async function testPuppeteer() {
  console.log('🚀 Запуск теста Puppeteer...');
  
  let browser;
  try {
    // Запускаем браузер
    console.log('📱 Запуск браузера...');
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-extensions',
        '--disable-gpu',
        '--disable-web-security'
      ]
    });

    // Создаем новую страницу
    console.log('📄 Создание новой страницы...');
    const page = await browser.newPage();
    
    // Устанавливаем размер страницы
    await page.setViewport({ width: 1280, height: 720 });
    
    // Переходим на Google
    console.log('🌐 Навигация на Google...');
    await page.goto('https://www.google.com', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    // Ждем загрузки страницы
    await page.waitForSelector('body', { timeout: 10000 });
    
    // Получаем заголовок страницы
    const title = await page.title();
    console.log(`📜 Заголовок страницы: ${title}`);
    
    // Делаем скриншот
    const screenshotPath = path.join(__dirname, 'puppeteer_test_screenshot.png');
    console.log('📸 Создание скриншота...');
    await page.screenshot({ 
      path: screenshotPath,
      fullPage: true 
    });
    
    console.log(`✅ Скриншот сохранен: ${screenshotPath}`);
    
    // Проверяем наличие элементов на странице
    const searchBox = await page.$('input[name="q"], input[aria-label*="поиск" i], input[title*="поиск" i]');
    if (searchBox) {
      console.log('🔍 Поисковая строка найдена на странице');
      
      // Вводим текст в поисковую строку
      await searchBox.type('Puppeteer test');
      console.log('⌨️  Текст введен в поисковую строку');
      
      // Делаем еще один скриншот с введенным текстом
      const searchScreenshotPath = path.join(__dirname, 'puppeteer_search_screenshot.png');
      await page.screenshot({ 
        path: searchScreenshotPath,
        fullPage: false 
      });
      console.log(`✅ Скриншот поиска сохранен: ${searchScreenshotPath}`);
    } else {
      console.log('⚠️  Поисковая строка не найдена');
    }
    
    // Получаем информацию о странице
    const url = page.url();
    console.log(`🔗 Текущий URL: ${url}`);
    
    console.log('✅ Тест Puppeteer завершен успешно!');
    
    return {
      success: true,
      title,
      url,
      screenshotPath,
      message: 'Puppeteer работает корректно!'
    };
    
  } catch (error) {
    console.error('❌ Ошибка при тестировании Puppeteer:', error);
    return {
      success: false,
      error: error.message,
      message: 'Puppeteer тест не прошел'
    };
  } finally {
    if (browser) {
      console.log('🔒 Закрытие браузера...');
      await browser.close();
    }
  }
}

// Запускаем тест
if (require.main === module) {
  testPuppeteer()
    .then(result => {
      console.log('\n📊 Результат теста:');
      console.log(JSON.stringify(result, null, 2));
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 Критическая ошибка:', error);
      process.exit(1);
    });
}

module.exports = testPuppeteer; 