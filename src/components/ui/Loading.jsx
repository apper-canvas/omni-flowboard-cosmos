import ApperIcon from "@/components/ApperIcon";

const Loading = () => {
  return (
    <div className="h-full flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <ApperIcon 
            name="Kanban" 
            size={24} 
            className="absolute inset-0 m-auto text-primary animate-pulse" 
          />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading FlowBoard</h3>
        <p className="text-gray-600">Preparing your project workspace...</p>
      </div>
    </div>
  );
};

export default Loading;