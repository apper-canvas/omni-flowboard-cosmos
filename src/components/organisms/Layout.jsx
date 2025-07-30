import { useState, useEffect, useContext } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from 'react-redux';
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";
import { projectService } from "@/services/api/projectService";
import { AuthContext } from "../../App";
import ApperIcon from "@/components/ApperIcon";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Get authentication state
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await projectService.getAll();
        setProjects(data);
        if (data.length > 0) {
          setCurrentProject(data[0]);
        }
      } catch (error) {
        console.error("Failed to load projects:", error);
      }
    };
    
    if (isAuthenticated) {
      loadProjects();
    }
  }, [isAuthenticated]);

  const handleProjectChange = (project) => {
    setCurrentProject(project);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          currentProject={currentProject}
          projects={projects}
          onProjectChange={handleProjectChange}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        
        {/* User info and logout section */}
        {isAuthenticated && user && (
          <div className="bg-surface border-b border-gray-200 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                {user.firstName?.[0] || user.emailAddress?.[0] || 'U'}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-xs text-gray-500">{user.emailAddress}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ApperIcon name="LogOut" size={16} />
              <span>Logout</span>
            </button>
          </div>
        )}
        
        <main className="flex-1 overflow-hidden">
          <Outlet context={{ currentProject, searchQuery }} />
        </main>
      </div>

      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed bottom-6 right-6 w-12 h-12 bg-gradient-to-r from-primary to-accent text-white rounded-full shadow-lg flex items-center justify-center lg:hidden z-30"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  );
};

export default Layout;