import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const AddTaskButton = ({ onAddTask, status, users }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assigneeId: "",
    dueDate: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const selectedUser = users.find(user => user.Id.toString() === formData.assigneeId);
    
    const newTask = {
      title: formData.title,
      description: formData.description,
      status: status,
      assigneeId: formData.assigneeId || users[0]?.Id,
      assigneeName: selectedUser?.name || users[0]?.name,
      assigneeAvatar: selectedUser?.avatar || users[0]?.avatar,
      dueDate: formData.dueDate || null
    };

    onAddTask(newTask);
    setFormData({ title: "", description: "", assigneeId: "", dueDate: "" });
    setIsAdding(false);
  };

  const handleCancel = () => {
    setFormData({ title: "", description: "", assigneeId: "", dueDate: "" });
    setIsAdding(false);
  };

  if (isAdding) {
    return (
      <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              type="text"
              placeholder="Task title..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              autoFocus
            />
          </div>
          
          <div>
            <textarea
              placeholder="Description (optional)..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={2}
            />
          </div>

          <div className="flex gap-2">
            <select
              value={formData.assigneeId}
              onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {users.map(user => (
                <option key={user.Id} value={user.Id}>
                  {user.name}
                </option>
              ))}
            </select>
            
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" size="sm" className="flex-1">
              Add Task
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      onClick={() => setIsAdding(true)}
      className="w-full border-2 border-dashed border-gray-300 hover:border-primary hover:bg-primary/5 text-gray-500 hover:text-primary transition-all duration-200"
    >
      <ApperIcon name="Plus" size={16} className="mr-2" />
      Add Task
    </Button>
  );
};

export default AddTaskButton;