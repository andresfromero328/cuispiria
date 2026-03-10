import Link from "next/link";
import React from "react";
import { navLinks } from "../navLinks";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

interface Props {
  session: Session | null;
}

const Navbar = ({ session }: Props) => {
  const pathname = usePathname();
  return (
    <div className="hidden items-center gap-8 md:flex">
      {navLinks.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {link.name}
        </Link>
      ))}

      {session ? (
        <Button
          onClick={() => signOut()}
          className="btn btn-primary"
        >
          Sign out
        </Button>
      ) : (
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
      )}
    </div>
  );
};

export default Navbar;
