import projectsData from "@/services/mockData/projects.json";

class ProjectService {
  constructor() {
    this.projects = [...projectsData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.projects];
  }

  async getById(id) {
    await this.delay(200);
    return this.projects.find(project => project.Id === parseInt(id));
  }

  async create(projectData) {
    await this.delay(400);
    const newProject = {
      Id: Math.max(...this.projects.map(p => p.Id)) + 1,
      ...projectData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.projects.push(newProject);
    return { ...newProject };
  }

  async update(id, projectData) {
    await this.delay(300);
    const index = this.projects.findIndex(project => project.Id === parseInt(id));
    if (index !== -1) {
      this.projects[index] = {
        ...this.projects[index],
        ...projectData,
        updatedAt: new Date().toISOString()
      };
      return { ...this.projects[index] };
    }
    throw new Error("Project not found");
  }

  async delete(id) {
    await this.delay(250);
    const index = this.projects.findIndex(project => project.Id === parseInt(id));
    if (index !== -1) {
      this.projects.splice(index, 1);
      return true;
    }
    throw new Error("Project not found");
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const projectService = new ProjectService();