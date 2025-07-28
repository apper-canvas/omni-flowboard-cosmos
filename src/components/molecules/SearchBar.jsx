import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";

const SearchBar = ({ value, onChange, placeholder = "Search tasks..." }) => {
  return (
    <div className="relative flex-1 max-w-md">
      <ApperIcon
        name="Search"
        size={16}
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
      />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 pr-4 h-9 bg-white border-gray-200 focus:ring-primary focus:border-primary"
      />
    </div>
  );
};

export default SearchBar;