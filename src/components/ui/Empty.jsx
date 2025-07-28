import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  message = "No data available", 
  action = "Get started by creating your first item",
  onAction,
  actionLabel = "Get Started",
  icon = "FileText"
}) => {
  return (
    <div className="h-full flex items-center justify-center bg-background p-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name={icon} size={32} className="text-gray-400" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{message}</h3>
        <p className="text-gray-600 mb-6 leading-relaxed">{action}</p>
        
        {onAction && (
          <Button onClick={onAction} className="gap-2">
            <ApperIcon name="Plus" size={16} />
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Empty;