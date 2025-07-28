import { useOutletContext } from "react-router-dom";
import KanbanBoard from "@/components/organisms/KanbanBoard";

const ProjectBoard = () => {
  const { currentProject, searchQuery } = useOutletContext();

  return (
    <div className="h-full flex flex-col">
      {currentProject && (
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">{currentProject.name}</h1>
          <p className="text-gray-600 mt-1">{currentProject.description}</p>
        </div>
      )}
      
      <div className="flex-1 min-h-0">
        <KanbanBoard 
          projectId={currentProject?.Id} 
          searchQuery={searchQuery}
        />
      </div>
    </div>
  );
};

export default ProjectBoard;