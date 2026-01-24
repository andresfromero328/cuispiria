"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import Image from "next/image";
import React from "react";

const LockedContent = () => {
  return (
    <section className="flex flex-col items-center gap-5 px-4 py-6">
      <Image
        src="/locked_content.svg"
        alt="Locked Content"
        width={200}
        height={200}
        className=""
      />
      <h2>Weekly Overview is a members-only feature</h2>
      <small>
        You must be logged in to plan meals, track nutrition, and manage your
        monthly, weekly, and daily schedule.
      </small>

      <Button
        onClick={() =>
          signIn("google", {
            callbackUrl: "/",
            redirect: true,
          })
        }
        className="btn btn-primary w-1/3 mx-auto"
      >
        Sign in to continue
      </Button>
    </section>
  );
};

export default LockedContent;
