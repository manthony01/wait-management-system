import React from "react";

interface PageContainerProps {
  children?: React.ReactNode;
}

// Div which will contain all the page contents, default margins/ spacing will all be defined here
const PageContainer: React.FC<PageContainerProps> = ({ children }) => {
  return (
    <div className="w-11/12 md:w-4/5 lg:w-3/5 mx-auto pt-12">{children}</div>
  );
};

export default PageContainer;
