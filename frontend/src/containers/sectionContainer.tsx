import React from "react";

interface SectionContainerProps {
  children?: React.ReactNode;
  sectionId?: string;
  backgroundColor?: string;
}

const SectionContainer: React.FC<SectionContainerProps> = ({
  children,
  sectionId,
  backgroundColor,
}: SectionContainerProps) => (
  <section className={`my-10 ${backgroundColor}`} id={sectionId}>
    {children}
  </section>
);

export default SectionContainer;
