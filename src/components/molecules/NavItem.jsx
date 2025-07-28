import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const NavItem = ({ to, icon, label, badge }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-100 group",
          isActive
            ? "bg-gradient-to-r from-primary/10 to-accent/10 text-primary border-l-3 border-primary"
            : "text-gray-600 hover:text-gray-900"
        )
      }
    >
      {({ isActive }) => (
        <>
          <ApperIcon
            name={icon}
            size={18}
            className={cn(
              "transition-colors duration-200",
              isActive ? "text-primary" : "text-gray-400 group-hover:text-gray-600"
            )}
          />
          <span className="flex-1">{label}</span>
          {badge && (
            <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
              {badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
};

export default NavItem;