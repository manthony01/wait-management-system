import React from "react";

interface BadgeProps {
  text: string;
}
const Badge: React.FC<BadgeProps> = ({ text }) => (
  <span className="bg-accent text-white text-md font-medium mr-2 px-5 py-2 rounded-full">
    {text.charAt(0).toUpperCase() + text.slice(1)}
  </span>
);

export default Badge;
