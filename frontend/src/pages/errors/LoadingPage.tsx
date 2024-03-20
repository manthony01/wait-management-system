import React from "react";
import LoadingDots from "../../components/LoadingIcons/LoadingDots";
import PageContainer from "../../containers/pageContainer";

const LoadingPage: React.FC = () => (
  <PageContainer>
    <div className="flex w-full h-full place-content-center">
      <LoadingDots />
    </div>
  </PageContainer>
);

export default LoadingPage;
