"use client";

import React from "react";

interface FooterProps {
  onNavigateSection: (sectionId: string) => void;
}

export default function Footer({ onNavigateSection }: FooterProps) {
  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) => {
    e.preventDefault();
    onNavigateSection(sectionId);
  };

  return (
    <footer className="border-t border-white/[0.08] bg-black/90 lg:bg-transparent py-6">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-3 lg:max-w-[445px]">
          <div>
            <p className="text-base font-semibold tracking-tight text-white">
              Réalité Virtuelle
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Projet académique · Importance, utilisations et anatomie du casque
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-slate-400">
            <a
              href="#introduction"
              onClick={(e) => handleLinkClick(e, "introduction")}
              className="hover:text-white transition-colors"
            >
              Introduction
            </a>
            <a
              href="#importance"
              onClick={(e) => handleLinkClick(e, "importance")}
              className="hover:text-white transition-colors"
            >
              Importance
            </a>
            <a
              href="#utilisations"
              onClick={(e) => handleLinkClick(e, "utilisations")}
              className="hover:text-white transition-colors"
            >
              Utilisations
            </a>
            <a
              href="#composants"
              onClick={(e) => handleLinkClick(e, "composants")}
              className="hover:text-white transition-colors"
            >
              Composants
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
