import Image from "next/image";
import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <Image
        src="/logo.svg"
        alt="Cuispiria Logo"
        width={40}
        height={40}
        className=""
      />
      <Link
        href="/"
        className="text-xl font-semibold tracking-tight text-foreground"
      >
        Cuispiria
      </Link>
    </div>
  );
};

export default Logo;
