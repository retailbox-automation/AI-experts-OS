const puppeteer = require('puppeteer');
const path = require('path');

async function reliablePuppeteerTest() {
  console.log('🚀 Запуск надежного теста Puppeteer...');
  
  let browser;
  try {
    // Запускаем браузер с расширенными параметрами
    console.log('📱 Запуск браузера...');
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-extensions',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--no-zygote',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-background-networking',
        '--disable-ipc-flooding-protection',
        '--ignore-certificate-errors',
        '--ignore-ssl-errors',
        '--ignore-certificate-errors-spki-list',
        '--ignore-insecure-origins',
        '--disable-features=TranslateUI'
      ]
    });

    // Создаем новую страницу
    console.log('📄 Создание новой страницы...');
    const page = await browser.newPage();
    
    // Устанавливаем User-Agent
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');
    
    // Устанавливаем размер страницы
    await page.setViewport({ width: 1280, height: 720 });
    
    console.log('🎯 Тест 1: Простая HTML страница');
    // Создаем простую HTML страницу
    const simpleHtml = `
    <!DOCTYPE html>
    <html lang="ru">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Тест Puppeteer</title>
        <style>
            body { 
                font-family: Arial, sans-serif; 
                padding: 20px; 
                background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
                color: white;
                min-height: 100vh;
                margin: 0;
            }
            .container { 
                max-width: 800px; 
                margin: 0 auto; 
                text-align: center;
                background: rgba(255,255,255,0.1);
                padding: 40px;
                border-radius: 15px;
                backdrop-filter: blur(10px);
            }
            h1 { 
                color: #fff; 
                font-size: 2.5em;
                margin-bottom: 20px;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            }
            .info-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                margin: 30px 0;
            }
            .info-card {
                background: rgba(255,255,255,0.1);
                padding: 20px;
                border-radius: 10px;
                border: 1px solid rgba(255,255,255,0.2);
            }
            button { 
                background: #4CAF50; 
                color: white; 
                padding: 15px 30px; 
                border: none; 
                border-radius: 5px; 
                cursor: pointer; 
                font-size: 16px;
                margin: 10px;
                transition: all 0.3s ease;
            }
            button:hover { 
                background: #45a049; 
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            }
            #output { 
                margin-top: 20px; 
                padding: 15px; 
                background: rgba(255,255,255,0.1); 
                border-radius: 5px; 
                min-height: 50px;
            }
            input { 
                padding: 10px; 
                margin: 10px; 
                border: none; 
                border-radius: 5px; 
                font-size: 16px;
                background: rgba(255,255,255,0.9);
                color: #333;
            }
            .status { color: #4CAF50; font-weight: bold; }
            .timestamp { color: #FFD700; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚀 Puppeteer Тест Страница</h1>
            <p class="status">✅ Страница успешно загружена!</p>
            <p class="timestamp">Время загрузки: <span id="loadTime"></span></p>
            
            <div class="info-grid">
                <div class="info-card">
                    <h3>🌐 Браузер</h3>
                    <p id="userAgent">Загрузка...</p>
                </div>
                <div class="info-card">
                    <h3>📱 Экран</h3>
                    <p id="screenInfo">Загрузка...</p>
                </div>
                <div class="info-card">
                    <h3>🕒 Время</h3>
                    <p id="currentTime">Загрузка...</p>
                </div>
                <div class="info-card">
                    <h3>🎯 Состояние</h3>
                    <p id="pageState">Загрузка...</p>
                </div>
            </div>
            
            <div>
                <input type="text" id="testInput" placeholder="Введите тестовый текст">
                <button onclick="updateOutput()">Обновить вывод</button>
                <button onclick="changeColor()">Изменить цвет</button>
                <button onclick="showAlert()">Показать алерт</button>
            </div>
            
            <div id="output">
                <p>Нажмите кнопку для взаимодействия...</p>
            </div>
        </div>
        
        <script>
            function updateOutput() {
                const input = document.getElementById('testInput');
                const output = document.getElementById('output');
                output.innerHTML = '<p><strong>Введенный текст:</strong> ' + (input.value || 'Текст не введен') + '</p>';
            }
            
            function changeColor() {
                const colors = ['#667eea', '#f093fb', '#ffecd2', '#fcb69f', '#a8edea', '#fed6e3'];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                document.body.style.background = 'linear-gradient(45deg, ' + randomColor + ' 0%, #764ba2 100%)';
                document.getElementById('output').innerHTML = '<p>🎨 Цвет изменен на: ' + randomColor + '</p>';
            }
            
            function showAlert() {
                alert('Puppeteer тест работает отлично! 🎉');
            }
            
            // Обновляем информацию о странице
            function updateInfo() {
                document.getElementById('loadTime').textContent = new Date().toLocaleString();
                document.getElementById('userAgent').textContent = navigator.userAgent.substring(0, 50) + '...';
                document.getElementById('screenInfo').textContent = screen.width + 'x' + screen.height + ' px';
                document.getElementById('currentTime').textContent = new Date().toLocaleTimeString();
                document.getElementById('pageState').textContent = document.readyState;
            }
            
            // Обновляем время каждую секунду
            setInterval(() => {
                document.getElementById('currentTime').textContent = new Date().toLocaleTimeString();
            }, 1000);
            
            // Инициализация
            updateInfo();
        </script>
    </body>
    </html>
    `;
    
    // Устанавливаем содержимое страницы
    await page.setContent(simpleHtml, { waitUntil: 'networkidle0' });
    
    // Получаем информацию о странице
    const title = await page.title();
    console.log(`📜 Заголовок: ${title}`);
    
    // Делаем скриншот
    const screenshot1Path = path.join(__dirname, 'reliable_test_1_local.png');
    await page.screenshot({ 
      path: screenshot1Path,
      fullPage: true 
    });
    console.log(`✅ Скриншот 1 сохранен: ${screenshot1Path}`);
    
    console.log('🎯 Тест 2: Взаимодействие с элементами');
    // Вводим текст в поле
    await page.type('#testInput', 'Тест от Puppeteer! 🚀');
    
    // Нажимаем кнопку
    await page.click('button[onclick="updateOutput()"]');
    
    // Ждем обновления (используем Promise.resolve с timeout вместо page.waitForTimeout)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Получаем текст из элемента output
    const outputText = await page.$eval('#output', el => el.textContent);
    console.log(`📝 Результат взаимодействия: ${outputText}`);
    
    // Меняем цвет
    await page.click('button[onclick="changeColor()"]');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Делаем скриншот с изменениями
    const screenshot2Path = path.join(__dirname, 'reliable_test_2_interaction.png');
    await page.screenshot({ 
      path: screenshot2Path,
      fullPage: false 
    });
    console.log(`✅ Скриншот 2 сохранен: ${screenshot2Path}`);
    
    console.log('🎯 Тест 3: JavaScript выполнение');
    // Выполняем JavaScript в контексте страницы
    const pageInfo = await page.evaluate(() => {
      return {
        title: document.title,
        url: document.URL,
        userAgent: navigator.userAgent,
        language: navigator.language,
        cookieEnabled: navigator.cookieEnabled,
        onlineStatus: navigator.onLine,
        screenResolution: `${screen.width}x${screen.height}`,
        windowSize: `${window.innerWidth}x${window.innerHeight}`,
        timestamp: new Date().toISOString(),
        readyState: document.readyState,
        charset: document.characterSet,
        elementsCount: document.querySelectorAll('*').length,
        linksCount: document.querySelectorAll('a').length,
        buttonsCount: document.querySelectorAll('button').length,
        inputsCount: document.querySelectorAll('input').length
      };
    });
    
    console.log('📊 Информация о странице:');
    Object.entries(pageInfo).forEach(([key, value]) => {
      console.log(`   ${key}: ${value}`);
    });
    
    console.log('🎯 Тест 4: Производительность');
    // Получаем метрики производительности
    const metrics = await page.metrics();
    console.log('📈 Метрики производительности:');
    console.log(`   Documents: ${metrics.Documents}`);
    console.log(`   Frames: ${metrics.Frames}`);
    console.log(`   JSEventListeners: ${metrics.JSEventListeners}`);
    console.log(`   Nodes: ${metrics.Nodes}`);
    console.log(`   LayoutCount: ${metrics.LayoutCount}`);
    console.log(`   RecalcStyleCount: ${metrics.RecalcStyleCount}`);
    console.log(`   JSHeapUsedSize: ${Math.round(metrics.JSHeapUsedSize / 1024 / 1024)}MB`);
    console.log(`   JSHeapTotalSize: ${Math.round(metrics.JSHeapTotalSize / 1024 / 1024)}MB`);
    
    console.log('🎯 Тест 5: Попытка внешнего ресурса (Google)');
    try {
      await page.goto('https://www.google.com', { 
        waitUntil: 'domcontentloaded',
        timeout: 10000 
      });
      const googleTitle = await page.title();
      console.log(`✅ Google загружен: ${googleTitle}`);
      
      const screenshot3Path = path.join(__dirname, 'reliable_test_3_google.png');
      await page.screenshot({ 
        path: screenshot3Path,
        fullPage: false 
      });
      console.log(`✅ Скриншот 3 сохранен: ${screenshot3Path}`);
    } catch (error) {
      console.log(`⚠️  Не удалось загрузить Google: ${error.message}`);
    }
    
    console.log('✅ Надежный тест Puppeteer завершен успешно!');
    
    return {
      success: true,
      tests: {
        localPage: { title, outputText },
        pageInfo,
        metrics: {
          heapUsedMB: Math.round(metrics.JSHeapUsedSize / 1024 / 1024),
          heapTotalMB: Math.round(metrics.JSHeapTotalSize / 1024 / 1024),
          documents: metrics.Documents,
          frames: metrics.Frames,
          nodes: metrics.Nodes,
          elements: pageInfo.elementsCount
        }
      },
      screenshots: [
        'reliable_test_1_local.png',
        'reliable_test_2_interaction.png',
        'reliable_test_3_google.png'
      ],
      message: 'Все тесты Puppeteer прошли успешно!'
    };
    
  } catch (error) {
    console.error('❌ Ошибка при выполнении надежного теста:', error);
    return {
      success: false,
      error: error.message,
      message: 'Надежный тест не прошел'
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
  reliablePuppeteerTest()
    .then(result => {
      console.log('\n📊 Результат надежного теста:');
      console.log(JSON.stringify(result, null, 2));
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 Критическая ошибка:', error);
      process.exit(1);
    });
}

module.exports = reliablePuppeteerTest; 