import React, { useState } from "react";
import OrderIcon from "../Icons/OrderIcon";
import BellIcon from "../Icons/BellIcon";
import SidebarButton from "./SidebarButton";
import TurkeyIcon from "../Icons/TurkeyIcon";

type WaitStaffSidebarProps = {
  onButtonClick: (buttonName: string) => void;
};

const StaffSideBar: React.FC<WaitStaffSidebarProps> = ({ onButtonClick }) => {
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
    onButtonClick(buttonName);
  };

  return (
    <div className="flex flex-col flex-grow fixed w-1/12 h-[calc(100vh-3rem)] mt-12">
      <div className="flex flex-col flex-grow w-full border border-r-black border-b-black">
        <SidebarButton
          icon={<OrderIcon />}
          onClick={() => handleButtonClick("receipt")}
          tooltip="Kitchen staff orders"
          className={`${
            activeButton === "receipt"
              ? "border-l-8 border-l-accent"
              : "border-l-8 border-l-transparent"
          }`}
        />
        <SidebarButton
          icon={<TurkeyIcon />}
          onClick={() => handleButtonClick("turkey")}
          tooltip="Wait staff orders"
          className={`${
            activeButton === "turkey"
              ? "border-l-8 border-l-accent"
              : "border-l-8 border-l-transparent"
          }`}
        />
        <SidebarButton
          icon={<BellIcon />}
          onClick={() => handleButtonClick("bell")}
          tooltip="Table assistance requests"
          className={`${
            activeButton === "bell"
              ? "border-l-8 border-l-accent"
              : "border-l-8 border-l-transparent"
          }`}
        />
      </div>
    </div>
  );
};

export default StaffSideBar;
