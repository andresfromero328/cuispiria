import React from "react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Link from "next/link";
import { navLinks } from "../navLinks";
import { Session } from "next-auth";
import { Button } from "@/components/ui/button";
import { signIn, signOut } from "next-auth/react";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  session: Session | null;
}

const SideNavbar = ({ open, setOpen, session }: Props) => {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Hello user</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 px-4 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.name}
            </Link>
          ))}
        </div>
        <SheetFooter>
          {session ? (
            <Button onClick={() => signOut()} className="btn btn-primary">
              Sign out
            </Button>
          ) : (
            <Button
              onClick={() =>
                signIn("google", {
                  callbackUrl: "/",
                  redirect: true,
                })
              }
              className="btn btn-primary"
            >
              Sign in
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default SideNavbar;
