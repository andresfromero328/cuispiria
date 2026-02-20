"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error boundary caught:", error);
  }, [error]);

  const message =
    (error?.message && error.message.trim()) ||
    "Something went wrong while loading this page.";

  return (
    <main className="w-full max-w-7xl mx-auto flex-1 flex flex-col gap-5 items-center justify-center h-screen">
      <header className="page-header">
        <h2>Something went wrong</h2>
        <small>Don’t worry — try again, or head back home.</small>
      </header>

      <section className="card card-pad space-y-3">
        <p className="text-sm text-muted-foreground">{message}</p>

        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={reset}>Try again</Button>
          <Button variant="outline" asChild>
            <Link href="/">Go home</Link>
          </Button>
        </div>

        {error?.digest ? (
          <p className="text-xs text-muted-foreground">
            Error id: {error.digest}
          </p>
        ) : null}
      </section>
    </main>
  );
}
