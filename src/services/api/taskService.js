import tasksData from "@/services/mockData/tasks.json";

class TaskService {
  constructor() {
    this.tasks = [...tasksData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.tasks];
  }

  async getById(id) {
    await this.delay(200);
    return this.tasks.find(task => task.Id === parseInt(id));
  }

  async getByProject(projectId) {
    await this.delay(350);
    return this.tasks.filter(task => task.projectId === parseInt(projectId));
  }

  async getMyTasks(userId) {
    await this.delay(300);
    return this.tasks.filter(task => task.assigneeId === parseInt(userId));
  }

  async create(taskData) {
    await this.delay(400);
    const newTask = {
      Id: Math.max(...this.tasks.map(t => t.Id)) + 1,
      ...taskData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      position: this.getNextPosition(taskData.status, taskData.projectId)
    };
    this.tasks.push(newTask);
    return { ...newTask };
  }

  async update(id, taskData) {
    await this.delay(300);
    const index = this.tasks.findIndex(task => task.Id === parseInt(id));
    if (index !== -1) {
      this.tasks[index] = {
        ...this.tasks[index],
        ...taskData,
        updatedAt: new Date().toISOString()
      };
      return { ...this.tasks[index] };
    }
    throw new Error("Task not found");
  }

  async delete(id) {
    await this.delay(250);
    const index = this.tasks.findIndex(task => task.Id === parseInt(id));
    if (index !== -1) {
      this.tasks.splice(index, 1);
      return true;
    }
    throw new Error("Task not found");
  }

  getNextPosition(status, projectId) {
    const statusTasks = this.tasks.filter(
      task => task.status === status && task.projectId === parseInt(projectId)
    );
    return statusTasks.length > 0 
      ? Math.max(...statusTasks.map(task => task.position)) + 1 
      : 1;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const taskService = new TaskService();