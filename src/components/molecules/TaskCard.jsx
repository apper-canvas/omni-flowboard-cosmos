import { useState } from "react";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Avatar from "@/components/atoms/Avatar";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";

const TaskCard = ({ 
  task, 
  onDragStart, 
  onDragEnd, 
  onDrop, 
  isDragging, 
  isDropTarget,
  onEdit,
  onDelete 
}) => {
  const [showActions, setShowActions] = useState(false);

  const handleDragStart = (e) => {
    e.dataTransfer.setData("text/plain", task.Id.toString());
    onDragStart(task);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const draggedTaskId = parseInt(e.dataTransfer.getData("text/plain"));
    if (draggedTaskId !== task.Id) {
      onDrop(draggedTaskId, task.Id);
    }
  };

  const getDueDateBadge = () => {
    if (!task.dueDate) return null;
    
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
    
    let variant = "default";
    let text = format(dueDate, "MMM dd");
    
    if (diffDays < 0) {
      variant = "error";
      text = "Overdue";
    } else if (diffDays === 0) {
      variant = "warning";
      text = "Today";
    } else if (diffDays === 1) {
      variant = "due";
      text = "Tomorrow";
    } else if (diffDays <= 3) {
      variant = "due";
    }
    
    return { variant, text };
  };

  const dueBadge = getDueDateBadge();

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      className={cn(
        "bg-white rounded-lg border border-gray-200 p-4 cursor-move transition-all duration-200 hover:shadow-md hover:-translate-y-1",
        isDragging && "task-card-dragging",
        isDropTarget && "ring-2 ring-primary ring-offset-2"
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-gray-900 text-sm leading-tight">{task.title}</h4>
        {showActions && (
          <div className="flex gap-1 ml-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
              className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ApperIcon name="Edit" size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.Id);
              }}
              className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-red-600 transition-colors"
            >
              <ApperIcon name="Trash2" size={14} />
            </button>
          </div>
        )}
      </div>
      
      {task.description && (
        <p className="text-gray-600 text-xs leading-relaxed mb-3 line-clamp-2">
          {task.description}
        </p>
      )}
      
      <div className="flex items-center justify-between">
        <Avatar
          src={task.assigneeAvatar}
          alt={task.assigneeName}
          size="sm"
        />
        {dueBadge && (
          <Badge variant={dueBadge.variant} className="text-xs">
            {dueBadge.text}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default TaskCard;