import { useState, useEffect } from "react";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Avatar from "@/components/atoms/Avatar";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { taskService } from "@/services/api/taskService";

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await taskService.getMyTasks(1); // Current user ID
      setTasks(data);
    } catch (err) {
      setError("Failed to load tasks. Please try again.");
      console.error("Error loading tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = tasks.filter(task => {
    switch (filter) {
      case "todo":
        return task.status === "todo";
      case "inprogress":
        return task.status === "inprogress";
      case "done":
        return task.status === "done";
      default:
        return true;
    }
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      todo: { variant: "default", label: "To Do" },
      inprogress: { variant: "warning", label: "In Progress" },
      done: { variant: "success", label: "Done" }
    };
    return statusConfig[status] || statusConfig.todo;
  };

  const getDueDateBadge = (dueDate) => {
    if (!dueDate) return null;
    
    const today = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { variant: "error", text: "Overdue" };
    if (diffDays === 0) return { variant: "warning", text: "Due Today" };
    if (diffDays <= 3) return { variant: "due", text: `Due in ${diffDays} days` };
    return { variant: "default", text: format(due, "MMM dd") };
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadTasks} />;

  return (
    <div className="h-full p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Tasks</h1>
          <p className="text-gray-600">Track and manage your assigned tasks</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {[
            { key: "all", label: "All Tasks", count: tasks.length },
            { key: "todo", label: "To Do", count: tasks.filter(t => t.status === "todo").length },
            { key: "inprogress", label: "In Progress", count: tasks.filter(t => t.status === "inprogress").length },
            { key: "done", label: "Done", count: tasks.filter(t => t.status === "done").length }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                filter === tab.key
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Task List */}
        {filteredTasks.length === 0 ? (
          <Empty 
            message={filter === "all" ? "No tasks assigned to you yet" : `No ${filter} tasks`}
            action="Check back later or ask your team lead to assign tasks"
          />
        ) : (
          <div className="space-y-4">
            {filteredTasks.map(task => {
              const statusBadge = getStatusBadge(task.status);
              const dueBadge = getDueDateBadge(task.dueDate);
              
              return (
                <div
                  key={task.Id}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {task.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Badge variant={statusBadge.variant}>
                        {statusBadge.label}
                      </Badge>
                      {dueBadge && (
                        <Badge variant={dueBadge.variant}>
                          {dueBadge.text}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={task.assigneeAvatar}
                        alt={task.assigneeName}
                        size="sm"
                      />
                      <span className="text-sm text-gray-600">
                        Assigned to {task.assigneeName}
                      </span>
                    </div>
                    
                    {task.dueDate && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <ApperIcon name="Calendar" size={16} />
                        <span>Due {format(new Date(task.dueDate), "MMM dd, yyyy")}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTasks;