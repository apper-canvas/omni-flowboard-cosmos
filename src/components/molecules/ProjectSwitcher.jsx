import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const ProjectSwitcher = ({ currentProject, projects, onProjectChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleProjectSelect = (project) => {
    onProjectChange(project);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
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
          <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
            {projects.map((project) => (
              <button
                key={project.Id}
                onClick={() => handleProjectSelect(project)}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between"
              >
                <div>
                  <div className="font-medium text-gray-900">{project.name}</div>
                  <div className="text-sm text-gray-500 truncate">{project.description}</div>
                </div>
                {currentProject?.Id === project.Id && (
                  <ApperIcon name="Check" size={16} className="text-primary flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectSwitcher;