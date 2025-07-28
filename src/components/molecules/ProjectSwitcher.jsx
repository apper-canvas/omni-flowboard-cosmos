import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Projects from "@/components/pages/Projects";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";

const ProjectSwitcher = ({ currentProject, projects, onProjectChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProjectSelect = (project) => {
    onProjectChange(project);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchQuery("");
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        onClick={handleToggleDropdown}
        className="flex items-center gap-2 px-3 h-9 text-left justify-start max-w-[200px]"
      >
        <span className="font-semibold text-gray-900 truncate">
          {currentProject?.name || "Select Project"}
        </span>
        <ApperIcon
          name={isOpen ? "ChevronUp" : "ChevronDown"}
          size={16}
          className="text-gray-500 flex-shrink-0"
        />
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-1 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
            <div className="px-3 py-2 border-b border-gray-100">
              <div className="relative">
                <ApperIcon
                  name="Search"
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <Input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 h-8 bg-gray-50 border-gray-200 focus:ring-primary focus:border-primary text-sm"
                  autoFocus
                />
              </div>
            </div>
            
            <div className="max-h-64 overflow-y-auto scrollbar-thin">
              {filteredProjects.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-500">
                  <ApperIcon name="Search" size={24} className="mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No projects found</p>
                </div>
              ) : (
                <>
                  {searchQuery === "" && (
                    <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Recent Projects
                    </div>
                  )}
                  {filteredProjects.map((project) => (
                    <button
                      key={project.Id}
                      onClick={() => handleProjectSelect(project)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">{project.name}</div>
                        <div className="text-sm text-gray-500 truncate mt-1">{project.description}</div>
                      </div>
                      {currentProject?.Id === project.Id && (
                        <ApperIcon name="Check" size={16} className="text-primary flex-shrink-0 ml-2" />
                      )}
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectSwitcher;