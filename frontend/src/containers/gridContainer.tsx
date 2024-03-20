import React from "react";

interface GridContainerProps {
  children?: React.ReactNode;
}
// Div which will contain all the page contents, default margins/ spacing will all be defined here
const GridContainer: React.FC<GridContainerProps> = ({ children }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-center w-full my-3 gap-y-3">
      {children}
    </div>
  );
};

export default GridContainer;
