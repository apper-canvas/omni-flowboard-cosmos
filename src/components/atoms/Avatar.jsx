import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Avatar = forwardRef(({ className, src, alt, size = "default", ...props }, ref) => {
  const sizes = {
    sm: "h-6 w-6",
    default: "h-8 w-8",
    lg: "h-10 w-10",
    xl: "h-12 w-12"
  };

  const initials = alt ? alt.split(" ").map(n => n[0]).join("").toUpperCase() : "U";

  return (
    <div
      ref={ref}
      className={cn(
        "relative inline-flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white font-medium overflow-hidden",
        sizes[size],
        className
      )}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      ) : null}
      <span
        className={cn(
          "flex items-center justify-center h-full w-full text-xs font-semibold",
          src ? "hidden" : "flex"
        )}
      >
        {initials}
      </span>
    </div>
  );
});

Avatar.displayName = "Avatar";

export default Avatar;