import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { projectService } from '@/services/api/projectService';
import { userService } from '@/services/api/userService';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import Badge from '@/components/atoms/Badge';
import Avatar from '@/components/atoms/Avatar';
import ApperIcon from '@/components/ApperIcon';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [projectsData, usersData] = await Promise.all([
        projectService.getAll(),
        userService.getAll()
      ]);
      setProjects(projectsData);
      setUsers(usersData);
    } catch (err) {
      setError('Failed to load projects');
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'On Hold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTeamMembers = (memberIds) => {
    return memberIds.map(id => users.find(user => user.Id === id)).filter(Boolean);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return <Loading message="Loading projects..." />;
  }

  if (error) {
    return (
      <Error 
        message={error}
        onRetry={loadData}
      />
    );
  }

  if (projects.length === 0) {
    return (
      <Empty 
        icon="FolderOpen"
        title="No Projects Found"
        description="Create your first project to get started"
      />
    );
  }

  return (
    <div className="p-6 h-full overflow-auto scrollbar-thin">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Projects</h1>
        <p className="text-gray-600">
          Manage and track all your projects in one place
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {projects.map((project) => {
          const teamMembers = getTeamMembers(project.teamMembers);
          const visibleMembers = teamMembers.slice(0, 4);
          const remainingCount = teamMembers.length - visibleMembers.length;

          return (
            <div
              key={project.Id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-200 group"
            >
              {/* Project Header */}
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {project.name}
                </h3>
                <Badge className={`ml-2 shrink-0 ${getStatusColor(project.status)}`}>
                  {project.status}
                </Badge>
              </div>

              {/* Project Description */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                {project.description}
              </p>

              {/* Progress Section */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {project.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(project.progress)}`}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              {/* Team Members */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Team</span>
                  <span className="text-sm text-gray-500">
                    {teamMembers.length} member{teamMembers.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex items-center -space-x-2">
                  {visibleMembers.map((member, index) => (
                    <Avatar
                      key={member.Id}
                      src={member.avatar}
                      alt={member.name}
                      className="w-8 h-8 border-2 border-white hover:z-10 transition-transform hover:scale-110"
                      title={member.name}
                    />
                  ))}
                  {remainingCount > 0 && (
                    <div className="w-8 h-8 bg-gray-100 border-2 border-white rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                      +{remainingCount}
                    </div>
                  )}
                  {teamMembers.length === 0 && (
                    <div className="w-8 h-8 bg-gray-100 border-2 border-white rounded-full flex items-center justify-center">
                      <ApperIcon name="User" size={14} className="text-gray-400" />
                    </div>
                  )}
                </div>
              </div>

              {/* Project Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center text-sm text-gray-500">
                  <ApperIcon name="Calendar" size={14} className="mr-1" />
                  {formatDate(project.updatedAt)}
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats Summary */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="CheckCircle" size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">
                {projects.filter(p => p.status === 'Completed').length}
              </p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="Clock" size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">
                {projects.filter(p => p.status === 'Active').length}
              </p>
              <p className="text-sm text-gray-600">Active</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="Pause" size={20} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">
                {projects.filter(p => p.status === 'On Hold').length}
              </p>
              <p className="text-sm text-gray-600">On Hold</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Projects;