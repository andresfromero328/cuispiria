import React from "react";

interface Props {
  title: string;
  count: number;
  right?: React.ReactNode;
}

const SectionHeader = ({ title, count, right }: Props) => {
  return (
    <div className="flex items-center justify-between">
      <div className="min-w-0">
        <h3 className="truncate font-medium">{title}</h3>
        <p className="text-xs text-muted-foreground">
          {count} {count === 1 ? "recipe" : "recipes"}
        </p>
      </div>
      {right ? <div className="flex items-center gap-2">{right}</div> : null}
    </div>
  );
};

export default SectionHeader;
