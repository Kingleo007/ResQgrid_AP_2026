import { ArrowUpRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const links = [
  { label: "Platform", to: "/about#platform" },
  { label: "How it works", to: "/about#how-it-works" },
  { label: "Response network", to: "/about#response-network" },
  { label: "About", to: "/about" },
];

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="relative z-20 bg-[#030817] text-white">
      <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
        <Link to="/" aria-label="ResQGrid home" className="flex shrink-0 items-center">
          <img
            src="/resqgrid-logo.png"
            alt="ResQGrid"
            className="h-16 w-24 rounded-md object-contain"
          />
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className="text-sm font-medium text-slate-300 transition hover:text-white"
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <Link
          to="/about"
          className="hidden items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 sm:inline-flex"
        >
          Explore ResQGrid <ArrowUpRight aria-hidden="true" size={16} />
        </Link>

        <button
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="rounded-lg p-2 text-slate-200 hover:bg-white/10 lg:hidden"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <nav aria-label="Mobile navigation" className="border-t border-white/10 px-5 py-3 lg:hidden">
          <div className="mx-auto grid max-w-7xl gap-1">
            {links.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-slate-200 hover:bg-white/10"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/about"
              onClick={() => setMenuOpen(false)}
              className="mt-2 rounded-lg bg-blue-600 px-3 py-3 text-center text-sm font-semibold"
            >
              Explore ResQGrid
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
