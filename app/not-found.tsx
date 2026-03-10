import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const NotFound = () => {
  return (
    <main className="h-screen w-full max-w-7xl mx-auto flex-1 flex flex-col items-center justify-center gap-5 px-4 py-10">
      <div className="w-full max-w-xl border bg-background shadow-sm rounded-lg p-6 flex flex-col gap-3 text-center">
        <div className="flex items-center justify-center">
          <span className="text-7xl font-bold tracking-tight">404</span>
        </div>

        <h2 className="text-xl md:text-2xl font-bold">Page not found</h2>

        <p className="text-sm md:text-base text-muted-foreground">
          The page you’re trying to visit doesn’t exist or was moved.
        </p>

        <div className="mt-2 flex flex-col sm:flex-row gap-2 justify-center">
          <Button asChild className="btn btn-primary">
            <Link href="/">Go home</Link>
          </Button>
        </div>

        <div className="mt-4 border-t pt-4">
          <small className="text-muted-foreground">
            If you believe this is a mistake, try refreshing.
          </small>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
