import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { userService } from "@/services/api/userService";
import { projectService } from "@/services/api/projectService";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Team from "@/components/pages/Team";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Avatar from "@/components/atoms/Avatar";
import Label from "@/components/atoms/Label";

// New Project Modal Component
function NewProjectModal({ isOpen, onClose, onProjectCreated, users }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    teamMembers: [],
    template: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const projectTemplates = [
    { value: 'web', label: 'Web Development', description: 'Standard web application project' },
    { value: 'mobile', label: 'Mobile App', description: 'iOS and Android mobile application' },
    { value: 'ecommerce', label: 'E-commerce', description: 'Online shopping platform' },
    { value: 'migration', label: 'Data Migration', description: 'Database and system migration' }
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTeamMemberToggle = (userId) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.includes(userId)
        ? prev.teamMembers.filter(id => id !== userId)
        : [...prev.teamMembers, userId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Project name is required');
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error('Project description is required');
      return;
    }

    if (formData.teamMembers.length === 0) {
      toast.error('Please select at least one team member');
      return;
    }

    setIsSubmitting(true);
    try {
      const projectData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        teamMembers: formData.teamMembers,
        status: 'Active',
        progress: 0,
        template: formData.template
      };

      await projectService.create(projectData);
      toast.success('Project created successfully!');
      onProjectCreated();
      onClose();
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        teamMembers: [],
        template: ''
      });
      setSearchTerm('');
    } catch (error) {
      toast.error('Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setFormData({
      name: '',
      description: '',
      teamMembers: [],
      template: ''
    });
    setSearchTerm('');
    setShowDropdown(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Create New Project</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ApperIcon name="X" size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Project Name */}
          <div>
            <Label htmlFor="name">Project Name *</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter project name"
              className="w-full"
            />
          </div>

          {/* Project Description */}
          <div>
            <Label htmlFor="description">Description *</Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your project..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary focus:outline-none"
            />
          </div>

          {/* Project Template */}
          <div>
            <Label htmlFor="template">Project Template</Label>
            <select
              id="template"
              name="template"
              value={formData.template}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary focus:outline-none"
            >
              <option value="">Select a template (optional)</option>
              {projectTemplates.map(template => (
                <option key={template.value} value={template.value}>
                  {template.label} - {template.description}
                </option>
              ))}
            </select>
          </div>

          {/* Team Members Selection */}
          <div>
            <Label>Team Members *</Label>
            <div className="relative">
              <div className="flex items-center border border-gray-300 rounded-md shadow-sm">
                <ApperIcon name="Search" size={16} className="ml-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search team members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setShowDropdown(true)}
                  className="flex-1 px-3 py-2 border-0 focus:ring-0 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="px-3 py-2 text-gray-400 hover:text-gray-600"
                >
                  <ApperIcon name="ChevronDown" size={16} />
                </button>
              </div>

              {showDropdown && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                  {filteredUsers.map(user => (
                    <div
                      key={user.Id}
                      onClick={() => handleTeamMemberToggle(user.Id)}
                      className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.teamMembers.includes(user.Id)}
                        onChange={() => {}}
                        className="mr-3 text-primary focus:ring-primary"
                      />
                      <Avatar src={user.avatar} alt={user.name} size="sm" className="mr-3" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  ))}
                  {filteredUsers.length === 0 && (
                    <div className="px-3 py-2 text-sm text-gray-500">No users found</div>
                  )}
                </div>
              )}
            </div>

            {/* Selected Team Members */}
            {formData.teamMembers.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {formData.teamMembers.map(userId => {
                  const user = users.find(u => u.Id === userId);
                  return user ? (
                    <div
                      key={userId}
                      className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                    >
                      <Avatar src={user.avatar} alt={user.name} size="xs" className="mr-2" />
                      <span>{user.name}</span>
                      <button
                        type="button"
                        onClick={() => handleTeamMemberToggle(userId)}
                        className="ml-2 text-blue-500 hover:text-blue-700"
                      >
                        <ApperIcon name="X" size={14} />
                      </button>
                    </div>
                  ) : null;
                })}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <ApperIcon name="Plus" size={16} className="mr-2" />
                  Create Project
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Projects() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

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

  const handleProjectCreated = () => {
    loadData(); // Refresh the projects list
    setShowNewProjectModal(false);
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
    <>
      <div className="p-6 h-full overflow-auto scrollbar-thin">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">Projects</h1>
              <p className="text-gray-600">
                Manage and track all your projects in one place
              </p>
            </div>
            <Button
              onClick={() => setShowNewProjectModal(true)}
              className="flex items-center"
            >
              <ApperIcon name="Plus" size={16} className="mr-2" />
              New Project
            </Button>
          </div>
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

      <NewProjectModal
        isOpen={showNewProjectModal}
        onClose={() => setShowNewProjectModal(false)}
        onProjectCreated={handleProjectCreated}
        users={users}
      />
    </>
  );
}

export default Projects;