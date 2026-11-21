"use client";

import React, { useState } from "react";
import { Menu, X } from "lucide-react";

interface TopNavProps {
  onNavigateSection: (sectionId: string) => void;
}

const NAV_LINKS = [
  { id: "introduction", label: "Introduction" },
  { id: "importance", label: "Importance" },
  { id: "utilisations", label: "Utilisations" },
  { id: "composants", label: "Composants" },
];

export default function TopNav({ onNavigateSection }: TopNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) => {
    e.preventDefault();
    setMenuOpen(false);
    onNavigateSection(sectionId);
  };

  return (
    <header className="sticky top-0 z-40 shrink-0 pointer-events-auto border-b border-white/[0.08] bg-black">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6">
        <a
          href="#introduction"
          onClick={(e) => handleLinkClick(e, "introduction")}
          className="text-base font-semibold tracking-tight text-white whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm"
        >
          Réalité Virtuelle
        </a>

        <nav
          aria-label="Navigation principale"
          className="hidden lg:flex items-center gap-8 text-sm font-medium text-[#9BA6B8]"
        >
          {NAV_LINKS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleLinkClick(e, item.id)}
              className="hover:text-white hover:underline transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded-sm"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href="#composants"
            onClick={(e) => handleLinkClick(e, "composants")}
            className="inline-flex items-center justify-center rounded-lg bg-sky-400 px-3.5 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-300 transition-colors duration-150 whitespace-nowrap shrink-0 min-h-[38px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Vue éclatée
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-menu"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            className="inline-flex lg:hidden items-center justify-center rounded-lg border border-white/[0.14] bg-black p-2 text-[#D4DAE4] hover:border-white/[0.28] hover:text-white transition-colors min-h-[38px] min-w-[38px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            {menuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav
          id="mobile-nav-menu"
          aria-label="Navigation mobile"
          className="lg:hidden border-t border-white/[0.08] bg-black px-6 py-3"
        >
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => handleLinkClick(e, item.id)}
                  className="block rounded-md px-2 py-2 text-sm font-medium text-[#D4DAE4] hover:bg-white/[0.05] hover:text-white transition-colors"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
