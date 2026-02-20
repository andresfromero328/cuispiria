"use client";

import React from "react";

type Props = {
  message?: string | null;
  className?: string;
};

export default function InlineError({ message, className }: Props) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className={
        "rounded-xl border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive " +
        (className ?? "")
      }
    >
      {message}
    </div>
  );
}
