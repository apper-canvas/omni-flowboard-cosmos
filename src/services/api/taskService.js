import { toast } from 'react-toastify';

class TaskService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'task_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {
            field: {
              Name: "Name"
            }
          },
          {
            field: {
              Name: "Tags"
            }
          },
          {
            field: {
              Name: "Owner"
            }
          },
          {
            field: {
              Name: "title_c"
            }
          },
          {
            field: {
              Name: "description_c"
            }
          },
          {
            field: {
              Name: "status_c"
            }
          },
          {
            field: {
              Name: "assigneeId_c"
            }
          },
          {
            field: {
              Name: "assigneeName_c"
            }
          },
          {
            field: {
              Name: "assigneeAvatar_c"
            }
          },
          {
            field: {
              Name: "dueDate_c"
            }
          },
          {
            field: {
              Name: "createdAt_c"
            }
          },
          {
            field: {
              Name: "updatedAt_c"
            }
          },
          {
            field: {
              Name: "position_c"
            }
          },
          {
            field: {
              Name: "projectId_c"
            }
          }
        ],
        orderBy: [
          {
            fieldName: "position_c",
            sorttype: "ASC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      // Map database fields to UI expected format
      return response.data.map(task => ({
        Id: task.Id,
        projectId: task.projectId_c?.Id || task.projectId_c,
        title: task.title_c,
        description: task.description_c,
        status: task.status_c,
        assigneeId: task.assigneeId_c?.Id || task.assigneeId_c,
        assigneeName: task.assigneeName_c,
        assigneeAvatar: task.assigneeAvatar_c,
        dueDate: task.dueDate_c,
        createdAt: task.createdAt_c,
        updatedAt: task.updatedAt_c,
        position: task.position_c,
        tags: task.Tags,
        owner: task.Owner
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching tasks:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {
            field: {
              Name: "Name"
            }
          },
          {
            field: {
              Name: "Tags"
            }
          },
          {
            field: {
              Name: "Owner"
            }
          },
          {
            field: {
              Name: "title_c"
            }
          },
          {
            field: {
              Name: "description_c"
            }
          },
          {
            field: {
              Name: "status_c"
            }
          },
          {
            field: {
              Name: "assigneeId_c"
            }
          },
          {
            field: {
              Name: "assigneeName_c"
            }
          },
          {
            field: {
              Name: "assigneeAvatar_c"
            }
          },
          {
            field: {
              Name: "dueDate_c"
            }
          },
          {
            field: {
              Name: "createdAt_c"
            }
          },
          {
            field: {
              Name: "updatedAt_c"
            }
          },
          {
            field: {
              Name: "position_c"
            }
          },
          {
            field: {
              Name: "projectId_c"
            }
          }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response || !response.data) {
        return null;
      }

      // Map database fields to UI expected format
      const task = response.data;
      return {
        Id: task.Id,
        projectId: task.projectId_c?.Id || task.projectId_c,
        title: task.title_c,
        description: task.description_c,
        status: task.status_c,
        assigneeId: task.assigneeId_c?.Id || task.assigneeId_c,
        assigneeName: task.assigneeName_c,
        assigneeAvatar: task.assigneeAvatar_c,
        dueDate: task.dueDate_c,
        createdAt: task.createdAt_c,
        updatedAt: task.updatedAt_c,
        position: task.position_c,
        tags: task.Tags,
        owner: task.Owner
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching task with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async getByProject(projectId) {
    try {
      const params = {
        fields: [
          {
            field: {
              Name: "Name"
            }
          },
          {
            field: {
              Name: "Tags"
            }
          },
          {
            field: {
              Name: "Owner"
            }
          },
          {
            field: {
              Name: "title_c"
            }
          },
          {
            field: {
              Name: "description_c"
            }
          },
          {
            field: {
              Name: "status_c"
            }
          },
          {
            field: {
              Name: "assigneeId_c"
            }
          },
          {
            field: {
              Name: "assigneeName_c"
            }
          },
          {
            field: {
              Name: "assigneeAvatar_c"
            }
          },
          {
            field: {
              Name: "dueDate_c"
            }
          },
          {
            field: {
              Name: "createdAt_c"
            }
          },
          {
            field: {
              Name: "updatedAt_c"
            }
          },
          {
            field: {
              Name: "position_c"
            }
          },
          {
            field: {
              Name: "projectId_c"
            }
          }
        ],
        where: [
          {
            FieldName: "projectId_c",
            Operator: "EqualTo",
            Values: [parseInt(projectId)]
          }
        ],
        orderBy: [
          {
            fieldName: "position_c",
            sorttype: "ASC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      // Map database fields to UI expected format
      return response.data.map(task => ({
        Id: task.Id,
        projectId: task.projectId_c?.Id || task.projectId_c,
        title: task.title_c,
        description: task.description_c,
        status: task.status_c,
        assigneeId: task.assigneeId_c?.Id || task.assigneeId_c,
        assigneeName: task.assigneeName_c,
        assigneeAvatar: task.assigneeAvatar_c,
        dueDate: task.dueDate_c,
        createdAt: task.createdAt_c,
        updatedAt: task.updatedAt_c,
        position: task.position_c,
        tags: task.Tags,
        owner: task.Owner
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching tasks by project:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getMyTasks(userId) {
    try {
      const params = {
        fields: [
          {
            field: {
              Name: "Name"
            }
          },
          {
            field: {
              Name: "Tags"
            }
          },
          {
            field: {
              Name: "Owner"
            }
          },
          {
            field: {
              Name: "title_c"
            }
          },
          {
            field: {
              Name: "description_c"
            }
          },
          {
            field: {
              Name: "status_c"
            }
          },
          {
            field: {
              Name: "assigneeId_c"
            }
          },
          {
            field: {
              Name: "assigneeName_c"
            }
          },
          {
            field: {
              Name: "assigneeAvatar_c"
            }
          },
          {
            field: {
              Name: "dueDate_c"
            }
          },
          {
            field: {
              Name: "createdAt_c"
            }
          },
          {
            field: {
              Name: "updatedAt_c"
            }
          },
          {
            field: {
              Name: "position_c"
            }
          },
          {
            field: {
              Name: "projectId_c"
            }
          }
        ],
        where: [
          {
            FieldName: "assigneeId_c",
            Operator: "EqualTo",
            Values: [parseInt(userId)]
          }
        ],
        orderBy: [
          {
            fieldName: "dueDate_c",
            sorttype: "ASC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      // Map database fields to UI expected format
      return response.data.map(task => ({
        Id: task.Id,
        projectId: task.projectId_c?.Id || task.projectId_c,
        title: task.title_c,
        description: task.description_c,
        status: task.status_c,
        assigneeId: task.assigneeId_c?.Id || task.assigneeId_c,
        assigneeName: task.assigneeName_c,
        assigneeAvatar: task.assigneeAvatar_c,
        dueDate: task.dueDate_c,
        createdAt: task.createdAt_c,
        updatedAt: task.updatedAt_c,
        position: task.position_c,
        tags: task.Tags,
        owner: task.Owner
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching my tasks:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async create(taskData) {
    try {
      // Map UI fields to database fields and include only Updateable fields
      const params = {
        records: [
          {
            Name: taskData.title,
            Tags: taskData.tags || "",
            Owner: taskData.owner || null,
            title_c: taskData.title,
            description_c: taskData.description || "",
            status_c: taskData.status,
            assigneeId_c: parseInt(taskData.assigneeId),
            assigneeName_c: taskData.assigneeName || "",
            assigneeAvatar_c: taskData.assigneeAvatar || "",
            dueDate_c: taskData.dueDate || null,
            createdAt_c: new Date().toISOString(),
            updatedAt_c: new Date().toISOString(),
            position_c: taskData.position || 1,
            projectId_c: parseInt(taskData.projectId)
          }
        ]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create task ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const task = successfulRecords[0].data;
          return {
            Id: task.Id,
            projectId: task.projectId_c?.Id || task.projectId_c,
            title: task.title_c,
            description: task.description_c,
            status: task.status_c,
            assigneeId: task.assigneeId_c?.Id || task.assigneeId_c,
            assigneeName: task.assigneeName_c,
            assigneeAvatar: task.assigneeAvatar_c,
            dueDate: task.dueDate_c,
            createdAt: task.createdAt_c,
            updatedAt: task.updatedAt_c,
            position: task.position_c,
            tags: task.Tags,
            owner: task.Owner
          };
        }
      }
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating task:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async update(id, taskData) {
    try {
      // Map UI fields to database fields and include only Updateable fields
      const updateData = {
        Id: parseInt(id),
        updatedAt_c: new Date().toISOString()
      };

      // Only include fields that are being updated
      if (taskData.title !== undefined) {
        updateData.Name = taskData.title;
        updateData.title_c = taskData.title;
      }
      if (taskData.description !== undefined) updateData.description_c = taskData.description;
      if (taskData.status !== undefined) updateData.status_c = taskData.status;
      if (taskData.assigneeId !== undefined) updateData.assigneeId_c = parseInt(taskData.assigneeId);
      if (taskData.assigneeName !== undefined) updateData.assigneeName_c = taskData.assigneeName;
      if (taskData.assigneeAvatar !== undefined) updateData.assigneeAvatar_c = taskData.assigneeAvatar;
      if (taskData.dueDate !== undefined) updateData.dueDate_c = taskData.dueDate;
      if (taskData.position !== undefined) updateData.position_c = taskData.position;
      if (taskData.projectId !== undefined) updateData.projectId_c = parseInt(taskData.projectId);
      if (taskData.tags !== undefined) updateData.Tags = taskData.tags;
      if (taskData.owner !== undefined) updateData.Owner = taskData.owner;

      const params = {
        records: [updateData]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update task ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const task = successfulUpdates[0].data;
          return {
            Id: task.Id,
            projectId: task.projectId_c?.Id || task.projectId_c,
            title: task.title_c,
            description: task.description_c,
            status: task.status_c,
            assigneeId: task.assigneeId_c?.Id || task.assigneeId_c,
            assigneeName: task.assigneeName_c,
            assigneeAvatar: task.assigneeAvatar_c,
            dueDate: task.dueDate_c,
            createdAt: task.createdAt_c,
            updatedAt: task.updatedAt_c,
            position: task.position_c,
            tags: task.Tags,
            owner: task.Owner
          };
        }
      }
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating task:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete task ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting task:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }

  getNextPosition(status, projectId) {
    // This method is now handled by the database with proper ordering
    return 1;
  }
}

export const taskService = new TaskService();