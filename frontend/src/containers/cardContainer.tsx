import React from "react";

interface CardContainerProps {
  children?: React.ReactNode;
}
// Div which will contain all the page contents, default margins/ spacing will all be defined here
const CardContainer: React.FC<CardContainerProps> = ({ children }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-3 place-items-center border border-white w-full">
      {children}
    </div>
  );
};

export default CardContainer;
