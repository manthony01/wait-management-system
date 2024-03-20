import React from "react";

interface SidebarButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
  tooltip: string;
}

const SidebarButton: React.FC<SidebarButtonProps> = ({
  icon,
  onClick,
  className,
  tooltip,
}) => (
  <div
    className={`tooltip tooltip-right border border-b-black flex-grow flex w-full ${className}`}
    data-tip={tooltip}
  >
    <button
      className="flex h-full w-full justify-center items-center"
      onClick={onClick}
    >
      {icon}
    </button>
  </div>
);

export default SidebarButton;
