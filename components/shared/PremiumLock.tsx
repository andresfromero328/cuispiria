"use client";

import React from "react";
import { signIn } from "next-auth/react";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";

interface Props {
  label: string;
}

const PremiumLock = ({ label }: Props) => {
  const pathname = usePathname();

  return (
    <div className="rounded-lg border bg-muted/40 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium">{label}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Unlock advanced nutrition insights (micros, glycemic load,
            ingredient contribution).
          </p>
        </div>
        <Button
          onClick={() =>
            signIn("google", {
              callbackUrl: pathname,
              redirect: true,
            })
          }
          className="btn btn-primary"
        >
          Sign in
        </Button>
      </div>
    </div>
  );
};

export default PremiumLock;
