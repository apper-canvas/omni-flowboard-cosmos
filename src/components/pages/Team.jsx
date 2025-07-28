import { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Avatar from "@/components/atoms/Avatar";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { userService } from "@/services/api/userService";
import { taskService } from "@/services/api/taskService";

const Team = () => {
  const [users, setUsers] = useState([]);
  const [userStats, setUserStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTeamData();
  }, []);

  const loadTeamData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [usersData, allTasks] = await Promise.all([
        userService.getAll(),
        taskService.getAll()
      ]);

      setUsers(usersData);

      // Calculate user statistics
      const stats = {};
      usersData.forEach(user => {
        const userTasks = allTasks.filter(task => task.assigneeId === user.Id);
        stats[user.Id] = {
          total: userTasks.length,
          todo: userTasks.filter(task => task.status === "todo").length,
          inprogress: userTasks.filter(task => task.status === "inprogress").length,
          done: userTasks.filter(task => task.status === "done").length,
          completionRate: userTasks.length > 0 
            ? Math.round((userTasks.filter(task => task.status === "done").length / userTasks.length) * 100)
            : 0
        };
      });
      
      setUserStats(stats);
    } catch (err) {
      setError("Failed to load team data. Please try again.");
      console.error("Error loading team data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadTeamData} />;
  if (users.length === 0) return <Empty message="No team members found" />;

  return (
    <div className="h-full p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Team</h1>
          <p className="text-gray-600">Manage team members and view workload distribution</p>
        </div>

        {/* Team Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Users" size={24} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Members</p>
                <p className="text-2xl font-bold text-blue-900">{users.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="CheckCircle" size={24} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-green-600 font-medium">Active Projects</p>
                <p className="text-2xl font-bold text-green-900">3</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="TrendingUp" size={24} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-purple-600 font-medium">Avg Completion</p>
                <p className="text-2xl font-bold text-purple-900">
                  {Math.round(Object.values(userStats).reduce((acc, stat) => acc + stat.completionRate, 0) / users.length)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map(user => {
            const stats = userStats[user.Id] || { total: 0, todo: 0, inprogress: 0, done: 0, completionRate: 0 };
            
            return (
              <div
                key={user.Id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                <div className="flex items-center gap-4 mb-4">
                  <Avatar
                    src={user.avatar}
                    alt={user.name}
                    size="lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">{user.name}</h3>
                    <p className="text-gray-600 text-sm">{user.email}</p>
                  </div>
                </div>

                {/* Task Statistics */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Tasks</span>
                    <Badge variant="default">{stats.total}</Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-blue-600">{stats.todo}</div>
                      <div className="text-xs text-gray-500">To Do</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-yellow-600">{stats.inprogress}</div>
                      <div className="text-xs text-gray-500">In Progress</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-600">{stats.done}</div>
                      <div className="text-xs text-gray-500">Done</div>
                    </div>
                  </div>

                  {/* Completion Rate */}
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Completion Rate</span>
                      <span className="text-sm font-semibold text-gray-900">{stats.completionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${stats.completionRate}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors">
                    <ApperIcon name="Mail" size={14} />
                    Message
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary hover:bg-accent text-white rounded-lg text-sm font-medium transition-colors">
                    <ApperIcon name="User" size={14} />
                    Profile
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Team;