import React from "react";

interface ButtonComponentProps {
  buttonText: string;
  onClick: () => void;
}

const ButtonComponent: React.FC<ButtonComponentProps> = ({
  buttonText,
  onClick,
}) => (
  <button
    className="w-1/4 p-4 sm:w-1/5 py-2 sm:px-4 text-white bg-light-buttonPrimary rounded hover:bg-light-primary justify-center"
    onClick={(e) => {
      e.preventDefault();
      onClick();
    }}
  >
    {buttonText}
  </button>
);

export default ButtonComponent;
