import React from "react";

interface ButtonComponentProps {
  onClick: () => void;
}

const ButtonComponent: React.FC<ButtonComponentProps> = ({ onClick }) => (
  <button
    className="h-12 w-12 py-2 px-2 right-1 bottom-1 rounded-full text-white bg-light-buttonSecondary hover:bg-light-primary float-right justify-center"
    onClick={(e) => {
      e.preventDefault();
      onClick();
    }}
  >
    <svg
      className="fill-current w-6 h-6 mx-1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
    >
      <path
        xmlns="http://www.w3.org/2000/svg"
        d="M16 9h-5V4H9v5H4v2h5v5h2v-5h5V9z"
      />
    </svg>
  </button>
);

export default ButtonComponent;
