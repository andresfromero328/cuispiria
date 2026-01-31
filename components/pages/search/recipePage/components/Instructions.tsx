import React from "react";
import SectionCard from "../helpers/SectionCard";

interface Props {
  instructions: string | undefined;
}

const Instructions = ({ instructions }: Props) => {
  const steps =
    instructions
      ?.replace(/<\/?[^>]+(>|$)/g, "")
      .split(".")
      .map((s) => s.trim())
      .filter(Boolean) || undefined;

  return (
    <SectionCard title="Instructions">
      {instructions ? (
        <ul className="list-disc space-y-2 pl-5">
          {steps!.map((step, i) => (
            <li key={i} className="text-sm leading-relaxed">
              {step.endsWith(".") ? step : `${step}.`}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">
          No instructions available.
        </p>
      )}
    </SectionCard>
  );
};

export default Instructions;
