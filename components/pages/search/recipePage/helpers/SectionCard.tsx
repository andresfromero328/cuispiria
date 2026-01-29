import React from "react";

interface Props {
  title: string;
  children: React.ReactNode;
  right?: React.ReactNode;
}

const SectionCard = ({ title, children, right }: Props) => {
  return (
    <section className="rounded-lg border bg-background shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
        <h3>{title}</h3>
        {right}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
};

export default SectionCard;
