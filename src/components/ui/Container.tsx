import type { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
}

function Container({ children }: ContainerProps) {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      {children}
    </div>
  );
}

export default Container;