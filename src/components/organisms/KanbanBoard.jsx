import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import TaskCard from "@/components/molecules/TaskCard";
import AddTaskButton from "@/components/molecules/AddTaskButton";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { taskService } from "@/services/api/taskService";
import { userService } from "@/services/api/userService";
import { cn } from "@/utils/cn";

const KanbanBoard = ({ projectId, searchQuery }) => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [draggedTask, setDraggedTask] = useState(null);
  const [dropTargetTask, setDropTargetTask] = useState(null);

  const columns = [
    { id: "todo", title: "To Do", bgColor: "bg-blue-50", borderColor: "border-blue-200" },
    { id: "inprogress", title: "In Progress", bgColor: "bg-yellow-50", borderColor: "border-yellow-200" },
    { id: "done", title: "Done", bgColor: "bg-green-50", borderColor: "border-green-200" }
  ];

  useEffect(() => {
    loadData();
  }, [projectId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [tasksData, usersData] = await Promise.all([
        taskService.getByProject(projectId),
        userService.getAll()
      ]);
      setTasks(tasksData);
      setUsers(usersData);
    } catch (err) {
      setError("Failed to load board data. Please try again.");
      console.error("Error loading board data:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = tasks.filter(task =>
    !searchQuery || 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.assigneeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTasksByStatus = (status) => {
    return filteredTasks
      .filter(task => task.status === status)
      .sort((a, b) => a.position - b.position);
  };

  const handleAddTask = async (taskData) => {
    try {
      const newTask = await taskService.create({
        ...taskData,
        projectId: projectId
      });
      setTasks(prev => [...prev, newTask]);
      toast.success("Task created successfully!");
    } catch (error) {
      toast.error("Failed to create task");
      console.error("Error creating task:", error);
    }
  };

  const handleDragStart = (task) => {
    setDraggedTask(task);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDropTargetTask(null);
  };

  const handleDrop = async (draggedTaskId, targetTaskId) => {
    if (draggedTaskId === targetTaskId) return;

    const draggedTask = tasks.find(t => t.Id === draggedTaskId);
    const targetTask = tasks.find(t => t.Id === targetTaskId);

    if (!draggedTask || !targetTask) return;

    try {
      // Update task status to match target task
      const updatedTask = await taskService.update(draggedTaskId, {
        ...draggedTask,
        status: targetTask.status,
        position: targetTask.position
      });

      setTasks(prev => prev.map(task => 
        task.Id === draggedTaskId ? updatedTask : task
      ));

      toast.success("Task moved successfully!");
    } catch (error) {
      toast.error("Failed to move task");
      console.error("Error moving task:", error);
    }
  };

  const handleColumnDrop = async (e, status) => {
    e.preventDefault();
    const draggedTaskId = parseInt(e.dataTransfer.getData("text/plain"));
    const draggedTask = tasks.find(t => t.Id === draggedTaskId);

    if (!draggedTask || draggedTask.status === status) return;

    try {
      const updatedTask = await taskService.update(draggedTaskId, {
        ...draggedTask,
        status: status
      });

      setTasks(prev => prev.map(task => 
        task.Id === draggedTaskId ? updatedTask : task
      ));

      toast.success(`Task moved to ${columns.find(c => c.id === status)?.title}!`);
    } catch (error) {
      toast.error("Failed to move task");
      console.error("Error moving task:", error);
    }
  };

  const handleEditTask = async (task) => {
    // For demo purposes, we'll just show a simple prompt
    const newTitle = prompt("Edit task title:", task.title);
    if (newTitle && newTitle !== task.title) {
      try {
        const updatedTask = await taskService.update(task.Id, {
          ...task,
          title: newTitle
        });
        setTasks(prev => prev.map(t => t.Id === task.Id ? updatedTask : t));
        toast.success("Task updated successfully!");
      } catch (error) {
        toast.error("Failed to update task");
      }
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await taskService.delete(taskId);
        setTasks(prev => prev.filter(task => task.Id !== taskId));
        toast.success("Task deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete task");
      }
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (!projectId) return <Empty message="Please select a project to view tasks" />;

  return (
    <div className="h-full p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.id);
          
          return (
            <div
              key={column.id}
              className={cn(
                "flex flex-col rounded-lg border-2 transition-all duration-200",
                column.bgColor,
                column.borderColor,
                draggedTask && draggedTask.status !== column.id && "drop-zone-active"
              )}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleColumnDrop(e, column.id)}
            >
              <div className="p-4 border-b border-gray-200 bg-white/50 backdrop-blur-sm rounded-t-lg">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{column.title}</h3>
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                    {columnTasks.length}
                  </span>
                </div>
              </div>

              <div className="flex-1 p-4 space-y-3 overflow-y-auto scrollbar-thin">
                {columnTasks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">No tasks yet</p>
                  </div>
                ) : (
                  columnTasks.map((task) => (
                    <TaskCard
                      key={task.Id}
                      task={task}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                      onDrop={handleDrop}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                      isDragging={draggedTask?.Id === task.Id}
                      isDropTarget={dropTargetTask?.Id === task.Id}
                    />
                  ))
                )}

                <AddTaskButton
                  onAddTask={handleAddTask}
                  status={column.id}
                  users={users}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KanbanBoard;