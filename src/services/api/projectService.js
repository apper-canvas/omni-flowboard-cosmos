import { toast } from 'react-toastify';

class ProjectService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'project_c';
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
              Name: "description_c"
            }
          },
          {
            field: {
              Name: "progress_c"
            }
          },
          {
            field: {
              Name: "status_c"
            }
          },
          {
            field: {
              Name: "teamMembers_c"
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
          }
        ],
        orderBy: [
          {
            fieldName: "Name",
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
      return response.data.map(project => ({
        Id: project.Id,
        name: project.Name,
        description: project.description_c,
        progress: project.progress_c,
        status: project.status_c,
        teamMembers: project.teamMembers_c ? 
          (typeof project.teamMembers_c === 'string' ? 
            project.teamMembers_c.split(',').map(id => parseInt(id.trim())) : 
            project.teamMembers_c) : [],
        createdAt: project.createdAt_c,
        updatedAt: project.updatedAt_c,
        tags: project.Tags,
        owner: project.Owner
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching projects:", error?.response?.data?.message);
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
              Name: "description_c"
            }
          },
          {
            field: {
              Name: "progress_c"
            }
          },
          {
            field: {
              Name: "status_c"
            }
          },
          {
            field: {
              Name: "teamMembers_c"
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
          }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response || !response.data) {
        return null;
      }

      // Map database fields to UI expected format
      const project = response.data;
      return {
        Id: project.Id,
        name: project.Name,
        description: project.description_c,
        progress: project.progress_c,
        status: project.status_c,
        teamMembers: project.teamMembers_c ? 
          (typeof project.teamMembers_c === 'string' ? 
            project.teamMembers_c.split(',').map(id => parseInt(id.trim())) : 
            project.teamMembers_c) : [],
        createdAt: project.createdAt_c,
        updatedAt: project.updatedAt_c,
        tags: project.Tags,
        owner: project.Owner
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching project with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async create(projectData) {
    try {
      // Map UI fields to database fields and include only Updateable fields
      const params = {
        records: [
          {
            Name: projectData.name,
            Tags: projectData.tags || "",
            Owner: projectData.owner || null,
            description_c: projectData.description || "",
            progress_c: projectData.progress || 0,
            status_c: projectData.status || "Active",
            teamMembers_c: Array.isArray(projectData.teamMembers) ? 
              projectData.teamMembers.join(',') : 
              (projectData.teamMembers || ""),
            createdAt_c: new Date().toISOString(),
            updatedAt_c: new Date().toISOString()
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
          console.error(`Failed to create project ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const project = successfulRecords[0].data;
          return {
            Id: project.Id,
            name: project.Name,
            description: project.description_c,
            progress: project.progress_c,
            status: project.status_c,
            teamMembers: project.teamMembers_c ? 
              (typeof project.teamMembers_c === 'string' ? 
                project.teamMembers_c.split(',').map(id => parseInt(id.trim())) : 
                project.teamMembers_c) : [],
            createdAt: project.createdAt_c,
            updatedAt: project.updatedAt_c,
            tags: project.Tags,
            owner: project.Owner
          };
        }
      }
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating project:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async update(id, projectData) {
    try {
      // Map UI fields to database fields and include only Updateable fields
      const updateData = {
        Id: parseInt(id),
        updatedAt_c: new Date().toISOString()
      };

      // Only include fields that are being updated
      if (projectData.name !== undefined) updateData.Name = projectData.name;
      if (projectData.description !== undefined) updateData.description_c = projectData.description;
      if (projectData.progress !== undefined) updateData.progress_c = projectData.progress;
      if (projectData.status !== undefined) updateData.status_c = projectData.status;
      if (projectData.teamMembers !== undefined) {
        updateData.teamMembers_c = Array.isArray(projectData.teamMembers) ? 
          projectData.teamMembers.join(',') : 
          projectData.teamMembers;
      }
      if (projectData.tags !== undefined) updateData.Tags = projectData.tags;
      if (projectData.owner !== undefined) updateData.Owner = projectData.owner;

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
          console.error(`Failed to update project ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const project = successfulUpdates[0].data;
          return {
            Id: project.Id,
            name: project.Name,
            description: project.description_c,
            progress: project.progress_c,
            status: project.status_c,
            teamMembers: project.teamMembers_c ? 
              (typeof project.teamMembers_c === 'string' ? 
                project.teamMembers_c.split(',').map(id => parseInt(id.trim())) : 
                project.teamMembers_c) : [],
            createdAt: project.createdAt_c,
            updatedAt: project.updatedAt_c,
            tags: project.Tags,
            owner: project.Owner
          };
        }
      }
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating project:", error?.response?.data?.message);
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
          console.error(`Failed to delete project ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting project:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
}

export const projectService = new ProjectService();