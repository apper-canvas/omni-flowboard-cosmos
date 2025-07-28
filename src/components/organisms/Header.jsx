import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import ProjectSwitcher from "@/components/molecules/ProjectSwitcher";

const Header = ({ 
  currentProject, 
  projects, 
  onProjectChange, 
  searchQuery, 
  onSearchChange 
}) => {
  return (
<header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <nav className="flex items-center text-sm text-gray-500">
            <span className="hover:text-gray-700 transition-colors">Projects</span>
            {currentProject && (
              <>
                <ApperIcon name="ChevronRight" size={16} className="mx-2" />
                <span className="font-medium text-gray-900">{currentProject.name}</span>
              </>
            )}
          </nav>
        </div>
        
        <div className="h-6 w-px bg-gray-200" />
        
        <ProjectSwitcher
          currentProject={currentProject}
          projects={projects}
          onProjectChange={onProjectChange}
        />
      </div>

      <div className="flex items-center gap-4">
        <SearchBar
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search tasks..."
        />
        
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 relative">
          <ApperIcon name="Bell" size={20} className="text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;