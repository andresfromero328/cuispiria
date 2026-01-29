import React from "react";

interface Props {
  children: React.ReactNode;
}

const Chip = ({ children }: Props) => {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border bg-background px-2.5 py-1 text-xs text-muted-foreground shadow-sm">
      {children}
    </span>
  );
};

export default Chip;
