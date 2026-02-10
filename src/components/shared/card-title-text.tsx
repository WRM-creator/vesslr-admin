import type { ReactNode } from "react";

interface CardTitleTextProps {
  children: ReactNode;
}

export const CardTitleText = ({ children }: CardTitleTextProps) => {
  return <span className="text-xs font-medium uppercase">{children}</span>;
};
