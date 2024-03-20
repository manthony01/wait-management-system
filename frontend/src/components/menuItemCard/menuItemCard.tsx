import React from "react";
import { getObjectPath } from "../../utils/utilFunctions";
import styles from "./menuItemCard.module.css";

interface MenuItemCardProps {
  title: string;
  price: number;
  imageUrl: string;
  description: string;
  onClick?: () => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  title,
  price,
  description,
  imageUrl,
  onClick,
}) => {
  return (
    <div className={styles.Card} onClick={onClick}>
      <div className="flex flex-col px-4 py-6 justify-center gap-y-1">
        <div className="text-lg font-bold line-clamp-1">{title}</div>
        <div className="text-md line-clamp-2">{description}</div>
        <div className="font-semibold text-sm font-['Verdana'] tracking-wide text-slate-600">
          ${price}
        </div>
      </div>
      <img
        className="rounded-lg w-1/3 object-cover"
        src={getObjectPath(imageUrl)}
        alt={title}
      />
    </div>
  );
};

export default MenuItemCard;
