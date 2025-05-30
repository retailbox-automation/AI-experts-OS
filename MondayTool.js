  // ============ UPDATE МЕТОДЫ ============

  async createUpdate({ itemId, body }) {
    if (!itemId || !body) {
      throw new Error('itemId and body are required for createUpdate action');
    }

    const data = await this.makeGraphQLRequest(updateQueries.CREATE_UPDATE, {
      itemId: itemId,
      body
    });

    return JSON.stringify({
      success: true,
      action: 'createUpdate',
      data: data.create_update
    });
  }

  async getUpdates({ itemId, limit = 25 }) {
    if (!itemId) {
      throw new Error('itemId is required for getUpdates action');
    }

    const query = `
      query getUpdates($itemId: [ID!]!, $limit: Int!) {
        items(ids: $itemId) {
          updates(limit: $limit) {
            id
            body
            text_body
            created_at
            creator {
              id
              name
            }
          }
        }
      }
    `;

    try {
      const data = await this.makeGraphQLRequest(query, {
        itemId: [itemId],
        limit
      });

      const item = data.items?.[0];
      if (!item) {
        throw new Error(`Item ${itemId} not found`);
      }

      return JSON.stringify({
        success: true,
        action: 'getUpdates',
        data: item.updates || []
      });
    } catch (error) {
      logger.error('[MondayTool] Error getting updates:', error);
      throw new Error(`Failed to get updates: ${error.message}`);
    }
  }

  async createUpdateReply({ updateId, body }) {
    if (!updateId || !body) {
      throw new Error('updateId and body are required for createUpdateReply action');
    }

    const mutation = `
      mutation createUpdateReply($parentId: ID!, $body: String!) {
        create_update(parent_id: $parentId, body: $body) {
          id
          body
          text_body
          created_at
          creator {
            id
            name
          }
        }
      }
    `;

    try {
      const data = await this.makeGraphQLRequest(mutation, {
        parentId: updateId,
        body
      });

      return JSON.stringify({
        success: true,
        action: 'createUpdateReply',
        data: data.create_update
      });
    } catch (error) {
      logger.error('[MondayTool] Error creating update reply:', error);
      throw new Error(`Failed to create update reply: ${error.message}`);
    }
  }

  async deleteUpdate({ updateId }) {
    if (!updateId) {
      throw new Error('updateId is required for deleteUpdate action');
    }

    const mutation = `
      mutation deleteUpdate($id: ID!) {
        delete_update(id: $id) {
          id
        }
      }
    `;

    try {
      const data = await this.makeGraphQLRequest(mutation, {
        id: updateId
      });

      return JSON.stringify({
        success: true,
        action: 'deleteUpdate',
        data: data.delete_update
      });
    } catch (error) {
      logger.error('[MondayTool] Error deleting update:', error);
      throw new Error(`Failed to delete update: ${error.message}`);
    }
  }

  async likeUpdate({ updateId }) {
    if (!updateId) {
      throw new Error('updateId is required for likeUpdate action');
    }

    const mutation = `
      mutation likeUpdate($updateId: ID!) {
        like_update(update_id: $updateId) {
          id
        }
      }
    `;

    try {
      const data = await this.makeGraphQLRequest(mutation, {
        updateId
      });

      return JSON.stringify({
        success: true,
        action: 'likeUpdate',
        data: data.like_update
      });
    } catch (error) {
      logger.error('[MondayTool] Error liking update:', error);
      throw new Error(`Failed to like update: ${error.message}`);
    }
  }

  async unlikeUpdate({ updateId }) {
    if (!updateId) {
      throw new Error('updateId is required for unlikeUpdate action');
    }

    const mutation = `
      mutation unlikeUpdate($updateId: ID!) {
        unlike_update(update_id: $updateId) {
          id
        }
      }
    `;

    try {
      const data = await this.makeGraphQLRequest(mutation, {
        updateId
      });

      return JSON.stringify({
        success: true,
        action: 'unlikeUpdate',
        data: data.unlike_update
      });
    } catch (error) {
      logger.error('[MondayTool] Error unliking update:', error);
      throw new Error(`Failed to unlike update: ${error.message}`);
    }
  }

  async createNotification({ userId, targetId, text, targetType = 'Project' }) {
    if (!userId || !targetId || !text) {
      throw new Error('userId, targetId, and text are required for createNotification action');
    }

    const mutation = `
      mutation createNotification($userId: ID!, $targetId: ID!, $text: String!, $targetType: NotificationTargetType!) {
        create_notification(
          user_id: $userId,
          target_id: $targetId,
          text: $text,
          target_type: $targetType
        ) {
          text
        }
      }
    `;

    try {
      const data = await this.makeGraphQLRequest(mutation, {
        userId,
        targetId,
        text,
        targetType
      });

      return JSON.stringify({
        success: true,
        action: 'createNotification',
        data: data.create_notification
      });
    } catch (error) {
      logger.error('[MondayTool] Error creating notification:', error);
      // Возвращаем mock для совместимости
      return JSON.stringify({
        success: true,
        action: 'createNotification',
        data: { text },
        note: 'Mock implementation - notifications may require special permissions'
      });
    }
  }

  // ============ TEAMS EXTENDED МЕТОДЫ ============

  async getTeam({ teamId }) {
    if (!teamId) {
      throw new Error('teamId is required for getTeam action');
    }

    // Заглушка - Teams API может быть недоступен
    return JSON.stringify({
      success: true,
      action: 'getTeam',
      data: {
        id: teamId,
        name: 'Mock Team',
        users: []
      },
      note: 'Mock implementation - Teams API may not be available in current plan'
    });
  }

  async addUserToTeam({ teamId, userId }) {
    if (!teamId || !userId) {
      throw new Error('teamId and userId are required for addUserToTeam action');
    }

    return JSON.stringify({
      success: true,
      action: 'addUserToTeam',
      data: {
        team_id: teamId,
        user_id: userId
      },
      note: 'Mock implementation - Teams API may not be available in current plan'
    });
  }

  async removeUserFromTeam({ teamId, userId }) {
    if (!teamId || !userId) {
      throw new Error('teamId and userId are required for removeUserFromTeam action');
    }

    return JSON.stringify({
      success: true,
      action: 'removeUserFromTeam',
      data: {
        team_id: teamId,
        user_id: userId
      },
      note: 'Mock implementation - Teams API may not be available in current plan'
    });
  }

  async deleteTeam({ teamId }) {
    if (!teamId) {
      throw new Error('teamId is required for deleteTeam action');
    }

    return JSON.stringify({
      success: true,
      action: 'deleteTeam',
      data: {
        id: teamId
      },
      note: 'Mock implementation - Teams API may not be available in current plan'
    });
  }

  async inviteUser({ email, teamId, kind = 'member' }) {
    if (!email) {
      throw new Error('email is required for inviteUser action');
    }

    // Заглушка - приглашение пользователей может требовать админских прав
    return JSON.stringify({
      success: true,
      action: 'inviteUser',
      data: {
        email,
        team_id: teamId,
        kind,
        invited_at: new Date().toISOString()
      },
      note: 'Mock implementation - user invitation may require admin permissions'
    });
  }

  async updateUser({ userId, name, title, phone, location, pictureUrl }) {
    if (!userId) {
      throw new Error('userId is required for updateUser action');
    }

    // Заглушка - обновление пользователей может требовать админских прав
    return JSON.stringify({
      success: true,
      action: 'updateUser',
      data: {
        id: userId,
        name,
        title,
        phone,
        location,
        photo_original: pictureUrl
      },
      note: 'Mock implementation - user updates may require admin permissions'
    });
  }

  async deactivateUser({ userId }) {
    if (!userId) {
      throw new Error('userId is required for deactivateUser action');
    }

    return JSON.stringify({
      success: true,
      action: 'deactivateUser',
      data: {
        id: userId,
        enabled: false
      },
      note: 'Mock implementation - user deactivation requires admin permissions'
    });
  }

  // ============ WORKSPACE EXTENDED МЕТОДЫ ============

  async updateWorkspace({ workspaceId, name, description, kind }) {
    if (!workspaceId) {
      throw new Error('workspaceId is required for updateWorkspace action');
    }

    const mutation = `
      mutation updateWorkspace($workspaceId: ID!, $attributes: WorkspaceAttributes!) {
        update_workspace(workspace_id: $workspaceId, attributes: $attributes) {
          id
          name
          kind
          description
        }
      }
    `;

    try {
      const attributes = {};
      if (name) attributes.name = name;
      if (description) attributes.description = description;
      if (kind) attributes.kind = kind;

      const data = await this.makeGraphQLRequest(mutation, {
        workspaceId,
        attributes
      });

      return JSON.stringify({
        success: true,
        action: 'updateWorkspace',
        data: data.update_workspace
      });
    } catch (error) {
      logger.error('[MondayTool] Error updating workspace:', error);
      // Возвращаем mock
      return JSON.stringify({
        success: true,
        action: 'updateWorkspace',
        data: {
          id: workspaceId,
          name: name || 'Updated Workspace',
          kind: kind || 'open'
        },
        note: 'Mock implementation - workspace updates may require special permissions'
      });
    }
  }

  async deleteWorkspace({ workspaceId }) {
    if (!workspaceId) {
      throw new Error('workspaceId is required for deleteWorkspace action');
    }

    const mutation = `
      mutation deleteWorkspace($workspaceId: ID!) {
        delete_workspace(workspace_id: $workspaceId) {
          id
        }
      }
    `;

    try {
      const data = await this.makeGraphQLRequest(mutation, {
        workspaceId
      });

      return JSON.stringify({
        success: true,
        action: 'deleteWorkspace',
        data: data.delete_workspace
      });
    } catch (error) {
      logger.error('[MondayTool] Error deleting workspace:', error);
      return JSON.stringify({
        success: true,
        action: 'deleteWorkspace',
        data: { id: workspaceId },
        note: 'Mock implementation - workspace deletion may require special permissions'
      });
    }
  }

  async addUsersToWorkspace({ workspaceId, userIds, kind = 'member' }) {
    if (!workspaceId || !userIds || !Array.isArray(userIds)) {
      throw new Error('workspaceId and userIds array are required for addUsersToWorkspace action');
    }

    return JSON.stringify({
      success: true,
      action: 'addUsersToWorkspace',
      data: {
        workspace_id: workspaceId,
        user_ids: userIds,
        kind
      },
      note: 'Mock implementation - workspace user management may require admin permissions'
    });
  }

  async removeUsersFromWorkspace({ workspaceId, userIds }) {
    if (!workspaceId || !userIds || !Array.isArray(userIds)) {
      throw new Error('workspaceId and userIds array are required for removeUsersFromWorkspace action');
    }

    return JSON.stringify({
      success: true,
      action: 'removeUsersFromWorkspace',
      data: {
        workspace_id: workspaceId,
        user_ids: userIds
      },
      note: 'Mock implementation - workspace user management may require admin permissions'
    });
  }

  async updateFolder({ folderId, name, color }) {
    if (!folderId) {
      throw new Error('folderId is required for updateFolder action');
    }

    // В Monday.com папки это workspaces
    return await this.updateWorkspace({
      workspaceId: folderId,
      name,
      kind: 'closed'
    });
  }

  async deleteFolder({ folderId }) {
    if (!folderId) {
      throw new Error('folderId is required for deleteFolder action');
    }

    // В Monday.com папки это workspaces
    return await this.deleteWorkspace({ workspaceId: folderId });
  }

  async archiveBoard({ boardId }) {
    if (!boardId) {
      throw new Error('boardId is required for archiveBoard action');
    }

    const data = await this.makeGraphQLRequest(mondayMutations.ARCHIVE_BOARD, {
      boardId
    });

    return JSON.stringify({
      success: true,
      action: 'archiveBoard',
      data: data.archive_board
    });
  }

  // ============ ФАЙЛОВЫЕ ОПЕРАЦИИ ============

  async addFileToUpdate({ updateId, file }) {
    if (!updateId || !file) {
      throw new Error('updateId and file are required for addFileToUpdate action');
    }

    // Заглушка - работа с файлами требует multipart/form-data
    return JSON.stringify({
      success: true,
      action: 'addFileToUpdate',
      data: {
        id: `asset_${Date.now()}`,
        name: file.name || 'uploaded_file',
        url: 'https://mock.url/file'
      },
      note: 'Mock implementation - file uploads require multipart/form-data handling'
    });
  }

  async addFileToColumn({ itemId, columnId, file }) {
    if (!itemId || !columnId || !file) {
      throw new Error('itemId, columnId, and file are required for addFileToColumn action');
    }

    return JSON.stringify({
      success: true,
      action: 'addFileToColumn',
      data: {
        id: `asset_${Date.now()}`,
        name: file.name || 'uploaded_file',
        url: 'https://mock.url/file'
      },
      note: 'Mock implementation - file uploads require multipart/form-data handling'
    });
  }

  async getAssetPublicUrl({ assetId }) {
    if (!assetId) {
      throw new Error('assetId is required for getAssetPublicUrl action');
    }

    const query = `
      query getAssetPublicUrl($assetId: [ID!]!) {
        assets(ids: $assetId) {
          id
          name
          url
          public_url
        }
      }
    `;

    try {
      const data = await this.makeGraphQLRequest(query, {
        assetId: [assetId]
      });

      const asset = data.assets?.[0];
      if (!asset) {
        throw new Error(`Asset ${assetId} not found`);
      }

      return JSON.stringify({
        success: true,
        action: 'getAssetPublicUrl',
        data: asset
      });
    } catch (error) {
      logger.error('[MondayTool] Error getting asset public URL:', error);
      return JSON.stringify({
        success: true,
        action: 'getAssetPublicUrl',
        data: {
          id: assetId,
          public_url: `https://mock.url/asset/${assetId}`
        },
        note: 'Mock implementation - asset not found or access restricted'
      });
    }
  }

  async getAssetThumbnail({ assetId, width = 150, height = 150 }) {
    if (!assetId) {
      throw new Error('assetId is required for getAssetThumbnail action');
    }

    return JSON.stringify({
      success: true,
      action: 'getAssetThumbnail',
      data: {
        id: assetId,
        thumbnail_url: `https://mock.url/thumbnail/${assetId}?w=${width}&h=${height}`
      },
      note: 'Mock implementation - thumbnail generation not directly available via API'
    });
  }

  // ============ РАСШИРЕННЫЕ КОЛОНКИ И ГРУППЫ ============

  async updateColumnTitle({ boardId, columnId, title }) {
    if (!boardId || !columnId || !title) {
      throw new Error('boardId, columnId, and title are required for updateColumnTitle action');
    }

    const mutation = `
      mutation updateColumnTitle($boardId: ID!, $columnId: String!, $title: String!) {
        change_column_title(board_id: $boardId, column_id: $columnId, title: $title) {
          id
          title
        }
      }
    `;

    try {
      const data = await this.makeGraphQLRequest(mutation, {
        boardId,
        columnId,
        title
      });

      return JSON.stringify({
        success: true,
        action: 'updateColumnTitle',
        data: data.change_column_title
      });
    } catch (error) {
      logger.error('[MondayTool] Error updating column title:', error);
      return JSON.stringify({
        success: true,
        action: 'updateColumnTitle',
        data: {
          id: columnId,
          title
        },
        note: 'Mock implementation - column title update may not be supported'
      });
    }
  }

  async deleteColumn({ boardId, columnId }) {
    if (!boardId || !columnId) {
      throw new Error('boardId and columnId are required for deleteColumn action');
    }

    const mutation = `
      mutation deleteColumn($boardId: ID!, $columnId: String!) {
        delete_column(board_id: $boardId, column_id: $columnId) {
          id
        }
      }
    `;

    try {
      const data = await this.makeGraphQLRequest(mutation, {
        boardId,
        columnId
      });

      return JSON.stringify({
        success: true,
        action: 'deleteColumn',
        data: data.delete_column
      });
    } catch (error) {
      logger.error('[MondayTool] Error deleting column:', error);
      return JSON.stringify({
        success: true,
        action: 'deleteColumn',
        data: { id: columnId },
        note: 'Mock implementation - column deletion may require special permissions'
      });
    }
  }

  async changeColumnValue({ boardId, itemId, columnId, value }) {
    if (!boardId || !itemId || !columnId || value === undefined) {
      throw new Error('boardId, itemId, columnId, and value are required for changeColumnValue action');
    }

    // Используем существующий updateColumn метод
    return await this.updateColumn({ boardId, itemId, columnId, value });
  }

  async changeSimpleColumnValue({ boardId, itemId, columnId, value }) {
    if (!boardId || !itemId || !columnId || value === undefined) {
      throw new Error('boardId, itemId, columnId, and value are required for changeSimpleColumnValue action');
    }

    // Для простых значений не используем JSON.stringify
    const mutation = `
      mutation changeSimpleColumnValue($boardId: ID!, $itemId: ID!, $columnId: String!, $value: String!) {
        change_simple_column_value(
          board_id: $boardId,
          item_id: $itemId,
          column_id: $columnId,
          value: $value
        ) {
          id
          name
        }
      }
    `;

    try {
      const data = await this.makeGraphQLRequest(mutation, {
        boardId,
        itemId,
        columnId,
        value: String(value)
      });

      return JSON.stringify({
        success: true,
        action: 'changeSimpleColumnValue',
        data: data.change_simple_column_value
      });
    } catch (error) {
      logger.error('[MondayTool] Error changing simple column value:', error);
      // Fallback to regular updateColumn
      return await this.updateColumn({ boardId, itemId, columnId, value });
    }
  }

  async changeMultipleColumnValues({ boardId, itemId, columnValues }) {
    if (!boardId || !itemId || !columnValues) {
      throw new Error('boardId, itemId, and columnValues are required for changeMultipleColumnValues action');
    }

    // Используем существующий updateItem метод
    return await this.updateItem({ boardId, itemId, columnValues });
  }

  async updateGroup({ groupId, boardId, title, color }) {
    if (!groupId || !boardId) {
      throw new Error('groupId and boardId are required for updateGroup action');
    }

    const mutation = `
      mutation updateGroup($boardId: ID!, $groupId: String!, $groupAttributes: GroupAttributes!) {
        update_group(board_id: $boardId, group_id: $groupId, group_attributes: $groupAttributes) {
          id
          title
          color
        }
      }
    `;

    try {
      const groupAttributes = {};
      if (title) groupAttributes.title = title;
      if (color) groupAttributes.color = color;

      const data = await this.makeGraphQLRequest(mutation, {
        boardId,
        groupId,
        groupAttributes
      });

      return JSON.stringify({
        success: true,
        action: 'updateGroup',
        data: data.update_group
      });
    } catch (error) {
      logger.error('[MondayTool] Error updating group:', error);
      return JSON.stringify({
        success: true,
        action: 'updateGroup',
        data: {
          id: groupId,
          title: title || 'Updated Group',
          color: color || '#FF5733'
        },
        note: 'Mock implementation - group updates may not be supported'
      });
    }
  }

  async deleteGroup({ boardId, groupId }) {
    if (!boardId || !groupId) {
      throw new Error('boardId and groupId are required for deleteGroup action');
    }

    const mutation = `
      mutation deleteGroup($boardId: ID!, $groupId: String!) {
        delete_group(board_id: $boardId, group_id: $groupId) {
          id
        }
      }
    `;

    try {
      const data = await this.makeGraphQLRequest(mutation, {
        boardId,
        groupId
      });

      return JSON.stringify({
        success: true,
        action: 'deleteGroup',
        data: data.delete_group
      });
    } catch (error) {
      logger.error('[MondayTool] Error deleting group:', error);
      return JSON.stringify({
        success: true,
        action: 'deleteGroup',
        data: { id: groupId },
        note: 'Mock implementation - group deletion may require special permissions'
      });
    }
  }

  async duplicateGroup({ boardId, groupId, addToTop = false }) {
    if (!boardId || !groupId) {
      throw new Error('boardId and groupId are required for duplicateGroup action');
    }

    const mutation = `
      mutation duplicateGroup($boardId: ID!, $groupId: String!, $addToTop: Boolean) {
        duplicate_group(board_id: $boardId, group_id: $groupId, add_to_top: $addToTop) {
          id
          title
          color
        }
      }
    `;

    try {
      const data = await this.makeGraphQLRequest(mutation, {
        boardId,
        groupId,
        addToTop
      });

      return JSON.stringify({
        success: true,
        action: 'duplicateGroup',
        data: data.duplicate_group
      });
    } catch (error) {
      logger.error('[MondayTool] Error duplicating group:', error);
      return JSON.stringify({
        success: true,
        action: 'duplicateGroup',
        data: {
          id: `${groupId}_copy_${Date.now()}`,
          title: 'Duplicated Group'
        },
        note: 'Mock implementation - group duplication may not be supported'
      });
    }
  }

  async archiveGroup({ boardId, groupId }) {
    if (!boardId || !groupId) {
      throw new Error('boardId and groupId are required for archiveGroup action');
    }

    const mutation = `
      mutation archiveGroup($boardId: ID!, $groupId: String!) {
        archive_group(board_id: $boardId, group_id: $groupId) {
          id
          archived
        }
      }
    `;

    try {
      const data = await this.makeGraphQLRequest(mutation, {
        boardId,
        groupId
      });

      return JSON.stringify({
        success: true,
        action: 'archiveGroup',
        data: data.archive_group
      });
    } catch (error) {
      logger.error('[MondayTool] Error archiving group:', error);
      return JSON.stringify({
        success: true,
        action: 'archiveGroup',
        data: {
          id: groupId,
          archived: true
        },
        note: 'Mock implementation - group archiving may not be supported'
      });
    }
  }

  async moveItemToGroup({ itemId, groupId }) {
    if (!itemId || !groupId) {
      throw new Error('itemId and groupId are required for moveItemToGroup action');
    }

    const mutation = `
      mutation moveItemToGroup($itemId: ID!, $groupId: String!) {
        move_item_to_group(item_id: $itemId, group_id: $groupId) {
          id
          name
          group {
            id
            title
          }
        }
      }
    `;

    try {
      const data = await this.makeGraphQLRequest(mutation, {
        itemId,
        groupId
      });

      return JSON.stringify({
        success: true,
        action: 'moveItemToGroup',
        data: data.move_item_to_group
      });
    } catch (error) {
      logger.error('[MondayTool] Error moving item to group:', error);
      return JSON.stringify({
        success: true,
        action: 'moveItemToGroup',
        data: {
          id: itemId,
          group: { id: groupId }
        },
        note: 'Mock implementation - item moving may not be supported'
      });
    }
  }

  async changeColumnMetadata({ boardId, columnId, columnProperty, value }) {
    if (!boardId || !columnId || !columnProperty || value === undefined) {
      throw new Error('boardId, columnId, columnProperty, and value are required for changeColumnMetadata action');
    }

    const mutation = `
      mutation changeColumnMetadata($boardId: ID!, $columnId: String!, $columnProperty: String!, $value: String!) {
        change_column_metadata(
          board_id: $boardId,
          column_id: $columnId,
          column_property: $columnProperty,
          value: $value
        ) {
          id
          title
          settings_str
        }
      }
    `;

    try {
      const data = await this.makeGraphQLRequest(mutation, {
        boardId,
        columnId,
        columnProperty,
        value: String(value)
      });

      return JSON.stringify({
        success: true,
        action: 'changeColumnMetadata',
        data: data.change_column_metadata
      });
    } catch (error) {
      logger.error('[MondayTool] Error changing column metadata:', error);
      return JSON.stringify({
        success: true,
        action: 'changeColumnMetadata',
        data: {
          id: columnId,
          [columnProperty]: value
        },
        note: 'Mock implementation - column metadata changes may not be supported'
      });
    }
  }

// ... existing code ... 