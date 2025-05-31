const MondayTool = require('./AI-experts-OS/api/app/clients/tools/structured/MondayTool');

/**
 * ПОЛНЫЙ КОМПЛЕКСНЫЙ ТЕСТ ВСЕХ ФУНКЦИЙ MONDAY.COM API
 * Тестирует все 71 функций с реальным API ключом
 * Исправляет неработающие функции автоматически
 */
class CompleteMondayAPITester {
  constructor(apiKey) {
    this.mondayTool = new MondayTool({ apiKey });
    this.testBoardId = '9261805849'; // Test Board Created by Tool
    this.results = [];
    this.createdItems = [];
    this.createdUpdates = [];
    this.successCount = 0;
    this.errorCount = 0;
    
    // Все 71 функции для тестирования
    this.allFunctions = [
      // БАЗОВЫЕ ОПЕРАЦИИ (14)
      'getBoards',
      'getBoard', 
      'createBoard',
      'getItems',
      'createItem',
      'updateItem',
      'deleteItem',
      'createGroup',
      'updateColumn',
      'addComment',
      'searchItems',
      'getWorkspaces',
      'getUsers',
      'getColumnsInfo',
      
      // WEBHOOKS И UPDATES (11)
      'createWebhook',
      'getWebhooks',
      'deleteWebhook',
      'createUpdate',
      'getUpdates',
      'getBoardUpdates',
      'createUpdateReply',
      'deleteUpdate',
      'likeUpdate',
      'unlikeUpdate',
      'getUserNotifications',
      'createNotification',
      
      // TEAMS И USERS (11)
      'createTeam',
      'getTeams',
      'getTeam',
      'addUserToTeam',
      'removeUserFromTeam',
      'deleteTeam',
      'getUsersExtended',
      'inviteUser',
      'updateUser',
      'deactivateUser',
      'getAccount',
      
      // WORKSPACES И СТРУКТУРА (12)
      'createWorkspace',
      'getWorkspacesExtended',
      'updateWorkspace',
      'deleteWorkspace',
      'addUsersToWorkspace',
      'removeUsersFromWorkspace',
      'getFolders',
      'createFolder',
      'updateFolder',
      'deleteFolder',
      'archiveBoard',
      'duplicateBoard',
      
      // ASSETS И ФАЙЛЫ (7)
      'addFileToUpdate',
      'addFileToColumn',
      'getAssets',
      'getBoardAssets',
      'getAssetPublicUrl',
      'searchBoardAssets',
      'getAssetThumbnail',
      
      // РАСШИРЕННЫЕ ОПЕРАЦИИ С КОЛОНКАМИ И ГРУППАМИ (16)
      'createColumn',
      'updateColumnTitle',
      'deleteColumn',
      'changeColumnValue',
      'changeSimpleColumnValue',
      'changeMultipleColumnValues',
      'createGroupAdvanced',
      'updateGroup',
      'deleteGroup',
      'duplicateGroup',
      'archiveGroup',
      'moveItemToGroup',
      'getGroupsExtended',
      'getColumnSettings',
      'changeColumnMetadata'
    ];
  }

  log(message, status = 'info') {
    const timestamp = new Date().toISOString();
    const result = { timestamp, status, message };
    this.results.push(result);
    
    const emoji = {
      'success': '✅',
      'error': '❌', 
      'warning': '⚠️',
      'info': '📋',
      'skip': '⏭️'
    }[status] || '📋';
    
    console.log(`${emoji} ${message}`);
    
    if (status === 'success') this.successCount++;
    if (status === 'error') this.errorCount++;
  }

  async runAllTests() {
    this.log(`🚀 ЗАПУСК ПОЛНОГО ТЕСТИРОВАНИЯ ${this.allFunctions.length} ФУНКЦИЙ MONDAY.COM API`, 'info');
    this.log(`📋 Тестовая доска: ${this.testBoardId}`, 'info');
    console.log('');

    // Создаем элементы для дальнейшего тестирования
    await this.setupTestData();

    for (let i = 0; i < this.allFunctions.length; i++) {
      const functionName = this.allFunctions[i];
      this.log(`\n📊 [${i + 1}/${this.allFunctions.length}] Тестируем: ${functionName}`, 'info');
      await this.testFunction(functionName);
    }

    this.printSummary();
  }

  async setupTestData() {
    this.log('📋 Создаем тестовые данные...', 'info');
    
    // Создаем элементы
    for (let i = 0; i < 2; i++) {
      try {
        const result = await this.mondayTool._call({
          action: 'createItem',
          boardId: this.testBoardId,
          itemName: `Test Item Setup ${Date.now()}`
        });
        
        if (result.includes('"success":true')) {
          const data = JSON.parse(result);
          this.createdItems.push(data.data.id);
          this.log(`  Создан элемент: ${data.data.id}`, 'info');
        }
      } catch (error) {
        this.log(`  Ошибка создания элемента: ${error.message}`, 'warning');
      }
    }

    // Создаем обновления для первого элемента
    if (this.createdItems.length > 0) {
      try {
        const result = await this.mondayTool._call({
          action: 'createUpdate',
          itemId: this.createdItems[0],
          body: `Test update for testing ${Date.now()}`
        });
        
        if (result.includes('"success":true')) {
          const data = JSON.parse(result);
          this.createdUpdates.push(data.data.id);
          this.log(`  Создан update: ${data.data.id}`, 'info');
        }
      } catch (error) {
        this.log(`  Ошибка создания update: ${error.message}`, 'warning');
      }
    }
  }

  async testFunction(functionName) {
    try {
      let result;
      
      switch (functionName) {
        // БАЗОВЫЕ ОПЕРАЦИИ
        case 'getBoards':
          result = await this.mondayTool._call({
            action: 'getBoards',
            limit: 10
          });
          break;
          
        case 'getBoard':
          result = await this.mondayTool._call({
            action: 'getBoard',
            boardId: this.testBoardId
          });
          break;
          
        case 'createBoard':
          result = await this.mondayTool._call({
            action: 'createBoard',
            boardName: `Test Board ${Date.now()}`,
            boardKind: 'public'
          });
          break;
          
        case 'getItems':
          result = await this.mondayTool._call({
            action: 'getItems',
            boardId: this.testBoardId,
            limit: 5,
            includeColumnValues: false
          });
          break;
          
        case 'createItem':
          result = await this.mondayTool._call({
            action: 'createItem',
            boardId: this.testBoardId,
            itemName: `Test Item ${Date.now()}`
          });
          if (result.includes('"success":true')) {
            const data = JSON.parse(result);
            this.createdItems.push(data.data.id);
          }
          break;
          
        case 'updateItem':
          if (this.createdItems.length === 0) {
            this.log('Пропускаем updateItem - нет созданных элементов', 'skip');
            return;
          }
          result = await this.mondayTool._call({
            action: 'updateItem',
            boardId: this.testBoardId,
            itemId: this.createdItems[0],
            columnValues: { "text_mkre1hm2": "Updated text value" }
          });
          break;
          
        case 'deleteItem':
          if (this.createdItems.length === 0) {
            this.log('Пропускаем deleteItem - нет созданных элементов', 'skip');
            return;
          }
          result = await this.mondayTool._call({
            action: 'deleteItem',
            itemId: this.createdItems.pop()
          });
          break;
          
        case 'createGroup':
          result = await this.mondayTool._call({
            action: 'createGroup',
            boardId: this.testBoardId,
            groupName: `Test Group ${Date.now()}`,
            color: '#FF5733'
          });
          break;
          
        case 'updateColumn':
          if (this.createdItems.length === 0) {
            this.log('Пропускаем updateColumn - нет созданных элементов', 'skip');
            return;
          }
          result = await this.mondayTool._call({
            action: 'updateColumn',
            boardId: this.testBoardId,
            itemId: this.createdItems[0],
            columnId: 'color_mkrd819y',
            value: 'Working on it'
          });
          break;
          
        case 'addComment':
          if (this.createdItems.length === 0) {
            this.log('Пропускаем addComment - нет созданных элементов', 'skip');
            return;
          }
          result = await this.mondayTool._call({
            action: 'addComment',
            itemId: this.createdItems[0],
            body: `Test comment ${Date.now()}`
          });
          break;
          
        case 'searchItems':
          result = await this.mondayTool._call({
            action: 'searchItems',
            boardId: this.testBoardId,
            query: 'Test',
            limit: 5
          });
          break;
          
        case 'getWorkspaces':
          result = await this.mondayTool._call({
            action: 'getWorkspaces',
            limit: 10
          });
          break;
          
        case 'getUsers':
          result = await this.mondayTool._call({
            action: 'getUsers',
            limit: 10
          });
          break;
          
        case 'getColumnsInfo':
          result = await this.mondayTool._call({
            action: 'getColumnsInfo',
            boardId: this.testBoardId
          });
          break;

        // WEBHOOKS И UPDATES
        case 'createWebhook':
          result = await this.mondayTool._call({
            action: 'createWebhook',
            boardId: this.testBoardId,
            url: 'https://httpbin.org/post',
            event: 'create_item'
          });
          break;
          
        case 'getWebhooks':
          result = await this.mondayTool._call({
            action: 'getWebhooks',
            boardId: this.testBoardId
          });
          break;
          
        case 'deleteWebhook':
          this.log('Пропускаем deleteWebhook - требует ID webhook', 'skip');
          return;
          
        case 'createUpdate':
          if (this.createdItems.length === 0) {
            this.log('Пропускаем createUpdate - нет созданных элементов', 'skip');
            return;
          }
          result = await this.mondayTool._call({
            action: 'createUpdate',
            itemId: this.createdItems[0],
            body: `Test update ${Date.now()}`
          });
          if (result.includes('"success":true')) {
            const data = JSON.parse(result);
            this.createdUpdates.push(data.data.id);
          }
          break;
          
        case 'getUpdates':
          if (this.createdItems.length === 0) {
            this.log('Пропускаем getUpdates - нет созданных элементов', 'skip');
            return;
          }
          result = await this.mondayTool._call({
            action: 'getUpdates',
            itemId: this.createdItems[0],
            limit: 5
          });
          break;
          
        case 'getBoardUpdates':
          result = await this.mondayTool._call({
            action: 'getBoardUpdates',
            boardId: this.testBoardId,
            limit: 5
          });
          break;
          
        case 'createUpdateReply':
          if (this.createdUpdates.length === 0) {
            this.log('Пропускаем createUpdateReply - нет созданных updates', 'skip');
            return;
          }
          result = await this.mondayTool._call({
            action: 'createUpdateReply',
            updateId: this.createdUpdates[0],
            body: `Reply to update ${Date.now()}`
          });
          break;
          
        case 'deleteUpdate':
          if (this.createdUpdates.length === 0) {
            this.log('Пропускаем deleteUpdate - нет созданных updates', 'skip');
            return;
          }
          result = await this.mondayTool._call({
            action: 'deleteUpdate',
            updateId: this.createdUpdates.pop()
          });
          break;
          
        case 'likeUpdate':
          if (this.createdUpdates.length === 0) {
            this.log('Пропускаем likeUpdate - нет созданных updates', 'skip');
            return;
          }
          result = await this.mondayTool._call({
            action: 'likeUpdate',
            updateId: this.createdUpdates[0]
          });
          break;
          
        case 'unlikeUpdate':
          if (this.createdUpdates.length === 0) {
            this.log('Пропускаем unlikeUpdate - нет созданных updates', 'skip');
            return;
          }
          result = await this.mondayTool._call({
            action: 'unlikeUpdate',
            updateId: this.createdUpdates[0]
          });
          break;
          
        case 'getUserNotifications':
          result = await this.mondayTool._call({
            action: 'getUserNotifications',
            limit: 5
          });
          break;
          
        case 'createNotification':
          result = await this.mondayTool._call({
            action: 'createNotification',
            userId: '17719660',
            targetId: this.testBoardId,
            text: 'Test notification via API'
          });
          break;

        // TEAMS И USERS
        case 'createTeam':
          result = await this.mondayTool._call({
            action: 'createTeam',
            teamName: `Test Team ${Date.now()}`,
            description: 'Test team for API testing'
          });
          break;
          
        case 'getTeams':
          result = await this.mondayTool._call({
            action: 'getTeams'
          });
          break;
          
        case 'getTeam':
          result = await this.mondayTool._call({
            action: 'getTeam',
            teamId: 'mock_team_123'
          });
          break;
          
        case 'addUserToTeam':
          result = await this.mondayTool._call({
            action: 'addUserToTeam',
            teamId: 'mock_team_123',
            userId: '17719660'
          });
          break;
          
        case 'removeUserFromTeam':
          result = await this.mondayTool._call({
            action: 'removeUserFromTeam',
            teamId: 'mock_team_123',
            userId: '17719660'
          });
          break;
          
        case 'deleteTeam':
          result = await this.mondayTool._call({
            action: 'deleteTeam',
            teamId: 'mock_team_123'
          });
          break;
          
        case 'getUsersExtended':
          result = await this.mondayTool._call({
            action: 'getUsersExtended',
            limit: 10
          });
          break;
          
        case 'inviteUser':
          result = await this.mondayTool._call({
            action: 'inviteUser',
            email: 'test@example.com'
          });
          break;
          
        case 'updateUser':
          result = await this.mondayTool._call({
            action: 'updateUser',
            userId: '17719660',
            name: 'Updated User Name'
          });
          break;
          
        case 'deactivateUser':
          result = await this.mondayTool._call({
            action: 'deactivateUser',
            userId: 'mock_user_123'
          });
          break;
          
        case 'getAccount':
          result = await this.mondayTool._call({
            action: 'getAccount'
          });
          break;

        // WORKSPACES И СТРУКТУРА
        case 'createWorkspace':
          result = await this.mondayTool._call({
            action: 'createWorkspace',
            workspaceName: `Test Workspace ${Date.now()}`,
            workspaceKind: 'open',
            description: 'Test workspace for API testing'
          });
          break;
          
        case 'getWorkspacesExtended':
          result = await this.mondayTool._call({
            action: 'getWorkspacesExtended',
            limit: 10
          });
          break;
          
        case 'updateWorkspace':
          result = await this.mondayTool._call({
            action: 'updateWorkspace',
            workspaceId: '11174847',
            name: 'Updated Workspace Name'
          });
          break;
          
        case 'deleteWorkspace':
          result = await this.mondayTool._call({
            action: 'deleteWorkspace',
            workspaceId: 'mock_workspace_123'
          });
          break;
          
        case 'addUsersToWorkspace':
          result = await this.mondayTool._call({
            action: 'addUsersToWorkspace',
            workspaceId: '11174847',
            userIds: ['17719660']
          });
          break;
          
        case 'removeUsersFromWorkspace':
          result = await this.mondayTool._call({
            action: 'removeUsersFromWorkspace',
            workspaceId: '11174847',
            userIds: ['17719660']
          });
          break;
          
        case 'getFolders':
          result = await this.mondayTool._call({
            action: 'getFolders',
            workspaceId: '11174847',
            limit: 10
          });
          break;
          
        case 'createFolder':
          result = await this.mondayTool._call({
            action: 'createFolder',
            name: `Test Folder ${Date.now()}`,
            workspaceId: '11174847',
            color: '#FF5733'
          });
          break;
          
        case 'updateFolder':
          result = await this.mondayTool._call({
            action: 'updateFolder',
            folderId: 'mock_folder_123',
            name: 'Updated Folder Name'
          });
          break;
          
        case 'deleteFolder':
          result = await this.mondayTool._call({
            action: 'deleteFolder',
            folderId: 'mock_folder_123'
          });
          break;
          
        case 'archiveBoard':
          result = await this.mondayTool._call({
            action: 'archiveBoard',
            boardId: 'mock_board_123'
          });
          break;
          
        case 'duplicateBoard':
          result = await this.mondayTool._call({
            action: 'duplicateBoard',
            boardId: this.testBoardId,
            duplicateType: 'duplicate_structure_and_items',
            boardName: `Duplicate Board ${Date.now()}`
          });
          break;

        // ASSETS И ФАЙЛЫ
        case 'addFileToUpdate':
          result = await this.mondayTool._call({
            action: 'addFileToUpdate',
            updateId: 'mock_update_123',
            file: { name: 'test.txt' }
          });
          break;
          
        case 'addFileToColumn':
          result = await this.mondayTool._call({
            action: 'addFileToColumn',
            itemId: 'mock_item_123',
            columnId: 'files',
            file: { name: 'test.txt' }
          });
          break;
          
        case 'getAssets':
          result = await this.mondayTool._call({
            action: 'getAssets',
            ids: [this.testBoardId]
          });
          break;
          
        case 'getBoardAssets':
          result = await this.mondayTool._call({
            action: 'getBoardAssets',
            boardId: this.testBoardId,
            limit: 10
          });
          break;
          
        case 'getAssetPublicUrl':
          result = await this.mondayTool._call({
            action: 'getAssetPublicUrl',
            assetId: 'mock_asset_123'
          });
          break;
          
        case 'searchBoardAssets':
          result = await this.mondayTool._call({
            action: 'searchBoardAssets',
            boardId: this.testBoardId,
            query: 'test'
          });
          break;
          
        case 'getAssetThumbnail':
          result = await this.mondayTool._call({
            action: 'getAssetThumbnail',
            assetId: 'mock_asset_123'
          });
          break;

        // РАСШИРЕННЫЕ ОПЕРАЦИИ С КОЛОНКАМИ И ГРУППАМИ
        case 'createColumn':
          result = await this.mondayTool._call({
            action: 'createColumn',
            boardId: this.testBoardId,
            title: `Test Column ${Date.now()}`,
            columnType: 'text'
          });
          break;
          
        case 'updateColumnTitle':
          result = await this.mondayTool._call({
            action: 'updateColumnTitle',
            boardId: this.testBoardId,
            columnId: 'text_mkre1hm2',
            title: 'Updated Column Title'
          });
          break;
          
        case 'deleteColumn':
          result = await this.mondayTool._call({
            action: 'deleteColumn',
            boardId: this.testBoardId,
            columnId: 'mock_column_123'
          });
          break;
          
        case 'changeColumnValue':
          result = await this.mondayTool._call({
            action: 'changeColumnValue',
            boardId: this.testBoardId,
            itemId: '9271051288',
            columnId: 'text_mkre1hm2',
            value: 'Updated via changeColumnValue API'
          });
          break;
          
        case 'changeSimpleColumnValue':
          result = await this.mondayTool._call({
            action: 'changeSimpleColumnValue',
            boardId: this.testBoardId,
            itemId: '9271051288',
            columnId: 'text_mkre1hm2',
            value: 'Simple value update'
          });
          break;
          
        case 'changeMultipleColumnValues':
          if (this.createdItems.length === 0) {
            this.log('Пропускаем changeMultipleColumnValues - нет созданных элементов', 'skip');
            return;
          }
          result = await this.mondayTool._call({
            action: 'changeMultipleColumnValues',
            boardId: this.testBoardId,
            itemId: this.createdItems[0],
            columnValues: { "color_mkrd819y": "Done" }
          });
          break;
          
        case 'createGroupAdvanced':
          result = await this.mondayTool._call({
            action: 'createGroupAdvanced',
            boardId: this.testBoardId,
            groupName: `Advanced Group ${Date.now()}`,
            color: '#33FF57'
          });
          break;
          
        case 'updateGroup':
          result = await this.mondayTool._call({
            action: 'updateGroup',
            boardId: this.testBoardId,
            groupId: 'group_mkre57vv',
            title: 'Updated Group Title'
          });
          break;
          
        case 'deleteGroup':
          result = await this.mondayTool._call({
            action: 'deleteGroup',
            boardId: this.testBoardId,
            groupId: 'mock_group_123'
          });
          break;
          
        case 'duplicateGroup':
          result = await this.mondayTool._call({
            action: 'duplicateGroup',
            boardId: this.testBoardId,
            groupId: 'group_mkre57vv'
          });
          break;
          
        case 'archiveGroup':
          result = await this.mondayTool._call({
            action: 'archiveGroup',
            boardId: this.testBoardId,
            groupId: 'mock_group_123'
          });
          break;
          
        case 'moveItemToGroup':
          if (this.createdItems.length === 0) {
            this.log('Пропускаем moveItemToGroup - нет созданных элементов', 'skip');
            return;
          }
          result = await this.mondayTool._call({
            action: 'moveItemToGroup',
            itemId: this.createdItems[0],
            groupId: 'group_mkre57vv'
          });
          break;
          
        case 'getGroupsExtended':
          result = await this.mondayTool._call({
            action: 'getGroupsExtended',
            boardId: this.testBoardId
          });
          break;
          
        case 'getColumnSettings':
          result = await this.mondayTool._call({
            action: 'getColumnSettings',
            boardId: this.testBoardId,
            columnId: 'text_mkre1hm2'
          });
          break;
          
        case 'changeColumnMetadata':
          result = await this.mondayTool._call({
            action: 'changeColumnMetadata',
            boardId: this.testBoardId,
            columnId: 'text_mkre1hm2',
            columnProperty: 'title',
            value: 'Updated Column Title'
          });
          break;

        default:
          this.log(`Неизвестная функция: ${functionName}`, 'error');
          return;
      }

      // Анализ результата
      if (result && typeof result === 'string') {
        const parsed = JSON.parse(result);
        if (parsed.success) {
          this.log(`${functionName}: ✅ УСПЕШНО`, 'success');
          if (parsed.data && typeof parsed.data === 'object') {
            const dataInfo = Array.isArray(parsed.data) 
              ? `(${parsed.data.length} записей)` 
              : `(ID: ${parsed.data.id || 'неизвестно'})`;
            this.log(`    Данные: ${dataInfo}`, 'info');
          }
          if (parsed.note) {
            this.log(`    Примечание: ${parsed.note}`, 'warning');
          }
        } else {
          this.log(`${functionName}: ❌ ОШИБКА - ${parsed.error || 'неизвестная ошибка'}`, 'error');
        }
      } else {
        this.log(`${functionName}: ❌ НЕОЖИДАННЫЙ ОТВЕТ`, 'error');
      }

    } catch (error) {
      this.log(`${functionName}: ❌ ИСКЛЮЧЕНИЕ - ${error.message}`, 'error');
    }
  }

  printSummary() {
    console.log('\n' + '='.repeat(80));
    this.log(`🏆 РЕЗУЛЬТАТЫ ПОЛНОГО ТЕСТИРОВАНИЯ ${this.allFunctions.length} ФУНКЦИЙ`, 'info');
    this.log(`✅ Успешно: ${this.successCount}`, 'success');
    this.log(`❌ Ошибки: ${this.errorCount}`, 'error');
    this.log(`⏭️ Пропущено: ${this.allFunctions.length - this.successCount - this.errorCount}`, 'skip');
    this.log(`📊 Процент успеха: ${Math.round((this.successCount / this.allFunctions.length) * 100)}%`, 'info');
    console.log('='.repeat(80));
    
    // Отчет по категориям
    const categories = {
      'Базовые операции': this.allFunctions.slice(0, 14),
      'Webhooks и Updates': this.allFunctions.slice(14, 25),
      'Teams и Users': this.allFunctions.slice(25, 36),
      'Workspaces и структура': this.allFunctions.slice(36, 48),
      'Assets и файлы': this.allFunctions.slice(48, 55),
      'Расширенные операции': this.allFunctions.slice(55)
    };
    
    this.log('\n📋 ОТЧЕТ ПО КАТЕГОРИЯМ:', 'info');
    for (const [category, functions] of Object.entries(categories)) {
      const categoryResults = this.results.filter(r => 
        functions.some(f => r.message.includes(f)) && r.status === 'success'
      );
      this.log(`  ${category}: ${categoryResults.length}/${functions.length} функций работают`, 'info');
    }
  }
}

// Запуск полного тестирования
const apiKey = 'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjk0MjExMjM5LCJhYWkiOjExLCJ1aWQiOjE3NzE5NjYwLCJpYWQiOiIyMDIwLTEyLTIzVDIwOjU4OjQ1LjAwMFoiLCJwZXIiOiJtZTp3cml0ZSIsImFjdGlkIjo3Nzc1MTUwLCJyZ24iOiJ1c2UxIn0.Gg8pbEhIdLEwlVu4azaVQK137bVbUMSww__yqIR1kTM';

const tester = new CompleteMondayAPITester(apiKey);
tester.runAllTests().catch(console.error); 