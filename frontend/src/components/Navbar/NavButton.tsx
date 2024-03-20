import React from "react";

type NavButtonProps = {
  isDrawerButton?: boolean;
  drawerId?: string;
  triggerUpdateOrder?: () => void;
};

const NavButton: React.FC<React.PropsWithChildren<NavButtonProps>> = ({
  isDrawerButton,
  drawerId,
  triggerUpdateOrder,
  children,
}) => {
  if (isDrawerButton) {
    return (
      <label
        htmlFor={drawerId}
        className="drawer-button btn btn-square swap w-12 h-12 place-items-center bg-base-100 hover:bg-base-300 border-none"
        onClick={triggerUpdateOrder ? () => triggerUpdateOrder() : undefined}
      >
        {children}
      </label>
    );
  }
  return (
    <button
      className={`btn btn-square swap w-12 h-12 place-items-center bg-base-100 hover:bg-base-300 border-none ${
        isDrawerButton ? "drawer-button" : ""
      }`}
    >
      {children}
    </button>
  );
};

export default NavButton;
