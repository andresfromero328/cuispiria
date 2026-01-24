"use client";

import { useState } from "react";

import Logo from "./header_components/Logo";
import Navbar from "./header_components/Navbar";
import SideNavbar from "./header_components/SideNavbar";

import { HiMenuAlt1 } from "react-icons/hi";
import { Session } from "next-auth";

interface Props {
  session: Session | null;
}

const Header = ({ session }: Props) => {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-10 w-full ">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Logo />

        <Navbar session={session} />

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden btn btn-primary"
          aria-label="Toggle menu"
        >
          <HiMenuAlt1 />
        </button>
      </nav>
      <SideNavbar open={open} setOpen={setOpen} session={session} />
    </header>
  );
};

export default Header;
