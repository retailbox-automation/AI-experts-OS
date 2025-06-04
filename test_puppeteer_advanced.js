const puppeteer = require('puppeteer');
const path = require('path');

async function advancedPuppeteerTest() {
  console.log('🚀 Запуск расширенного теста Puppeteer...');
  
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
    
    // Устанавливаем User-Agent
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    // Устанавливаем размер страницы
    await page.setViewport({ width: 1920, height: 1080 });
    
    console.log('🎯 Тест 1: Навигация и основная информация');
    // Переходим на example.com
    await page.goto('https://example.com', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    // Получаем информацию о странице
    const title = await page.title();
    const url = page.url();
    console.log(`📜 Заголовок: ${title}`);
    console.log(`🔗 URL: ${url}`);
    
    // Делаем скриншот
    const screenshot1Path = path.join(__dirname, 'advanced_test_1_example.png');
    await page.screenshot({ 
      path: screenshot1Path,
      fullPage: true 
    });
    console.log(`✅ Скриншот 1 сохранен: ${screenshot1Path}`);
    
    console.log('🎯 Тест 2: Взаимодействие с элементами');
    // Получаем текст со страницы
    const bodyText = await page.evaluate(() => document.body.innerText);
    console.log(`📝 Содержимое страницы (первые 100 символов): ${bodyText.substring(0, 100)}...`);
    
    // Проверяем наличие ссылок
    const links = await page.evaluate(() => {
      const linkElements = Array.from(document.querySelectorAll('a[href]'));
      return linkElements.map(link => ({
        text: link.innerText.trim(),
        href: link.href
      })).filter(link => link.text && link.href);
    });
    
    console.log(`🔗 Найдено ${links.length} ссылок на странице`);
    links.forEach((link, index) => {
      if (index < 3) { // Показываем только первые 3
        console.log(`   ${index + 1}. "${link.text}" -> ${link.href}`);
      }
    });
    
    console.log('🎯 Тест 3: JavaScript в браузере');
    // Выполняем JavaScript в контексте страницы
    const pageInfo = await page.evaluate(() => {
      return {
        userAgent: navigator.userAgent,
        language: navigator.language,
        cookieEnabled: navigator.cookieEnabled,
        onlineStatus: navigator.onLine,
        screenResolution: `${screen.width}x${screen.height}`,
        windowSize: `${window.innerWidth}x${window.innerHeight}`,
        documentTitle: document.title,
        documentURL: document.URL,
        referrer: document.referrer || 'Direct',
        lastModified: document.lastModified,
        charset: document.characterSet,
        readyState: document.readyState
      };
    });
    
    console.log('📊 Информация о браузере и странице:');
    console.log(`   User Agent: ${pageInfo.userAgent}`);
    console.log(`   Язык: ${pageInfo.language}`);
    console.log(`   Cookies включены: ${pageInfo.cookieEnabled}`);
    console.log(`   Онлайн статус: ${pageInfo.onlineStatus}`);
    console.log(`   Разрешение экрана: ${pageInfo.screenResolution}`);
    console.log(`   Размер окна: ${pageInfo.windowSize}`);
    console.log(`   Кодировка: ${pageInfo.charset}`);
    console.log(`   Состояние документа: ${pageInfo.readyState}`);
    
    console.log('🎯 Тест 4: Работа с формами (на httpbin.org)');
    // Переходим на страницу с формой
    await page.goto('https://httpbin.org/forms/post', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    // Заполняем форму
    const emailInput = await page.$('input[name="email"]');
    const passwordInput = await page.$('input[name="password"]');
    
    if (emailInput && passwordInput) {
      await emailInput.type('test@example.com');
      await passwordInput.type('testpassword123');
      console.log('📝 Форма заполнена');
      
      // Делаем скриншот формы
      const screenshot2Path = path.join(__dirname, 'advanced_test_2_form.png');
      await page.screenshot({ 
        path: screenshot2Path,
        fullPage: false 
      });
      console.log(`✅ Скриншот 2 сохранен: ${screenshot2Path}`);
    } else {
      console.log('⚠️  Форма не найдена');
    }
    
    console.log('🎯 Тест 5: Производительность');
    // Измеряем время загрузки страницы
    const startTime = Date.now();
    await page.goto('https://httpbin.org/delay/2', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    const loadTime = Date.now() - startTime;
    console.log(`⏱️  Время загрузки страницы с задержкой: ${loadTime}ms`);
    
    // Получаем метрики производительности
    const metrics = await page.metrics();
    console.log('📈 Метрики производительности:');
    console.log(`   Timestamp: ${metrics.Timestamp}`);
    console.log(`   Documents: ${metrics.Documents}`);
    console.log(`   Frames: ${metrics.Frames}`);
    console.log(`   JSEventListeners: ${metrics.JSEventListeners}`);
    console.log(`   Nodes: ${metrics.Nodes}`);
    console.log(`   LayoutCount: ${metrics.LayoutCount}`);
    console.log(`   RecalcStyleCount: ${metrics.RecalcStyleCount}`);
    console.log(`   LayoutDuration: ${metrics.LayoutDuration}`);
    console.log(`   RecalcStyleDuration: ${metrics.RecalcStyleDuration}`);
    console.log(`   ScriptDuration: ${metrics.ScriptDuration}`);
    console.log(`   TaskDuration: ${metrics.TaskDuration}`);
    console.log(`   JSHeapUsedSize: ${Math.round(metrics.JSHeapUsedSize / 1024 / 1024)}MB`);
    console.log(`   JSHeapTotalSize: ${Math.round(metrics.JSHeapTotalSize / 1024 / 1024)}MB`);
    
    console.log('✅ Расширенный тест Puppeteer завершен успешно!');
    
    return {
      success: true,
      tests: {
        navigation: { title, url },
        links: links.length,
        pageInfo,
        loadTime,
        metrics: {
          heapUsedMB: Math.round(metrics.JSHeapUsedSize / 1024 / 1024),
          heapTotalMB: Math.round(metrics.JSHeapTotalSize / 1024 / 1024),
          documents: metrics.Documents,
          frames: metrics.Frames,
          nodes: metrics.Nodes
        }
      },
      message: 'Все тесты Puppeteer прошли успешно!'
    };
    
  } catch (error) {
    console.error('❌ Ошибка при выполнении расширенного теста:', error);
    return {
      success: false,
      error: error.message,
      message: 'Расширенный тест не прошел'
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
  advancedPuppeteerTest()
    .then(result => {
      console.log('\n📊 Результат расширенного теста:');
      console.log(JSON.stringify(result, null, 2));
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 Критическая ошибка:', error);
      process.exit(1);
    });
}

module.exports = advancedPuppeteerTest; 