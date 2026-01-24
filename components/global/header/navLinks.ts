interface NavLink {
  name: string;
  href: string;
}

export const navLinks: NavLink[] = [
  { name: "Home", href: "/" },
  { name: "Search", href: "/recipe-search" },
  { name: "Plan", href: "/meal-planning" },
  { name: "Library", href: "/library" },
];
