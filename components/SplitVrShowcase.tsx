"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDownRight, Check } from "lucide-react";
import AppleVrBackgroundStage from "@/components/AppleVrBackgroundStage";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import {
  HEADSET_ANNOTATIONS,
  IMPORTANCE_PILLARS,
  LIMITS_LIST,
  STRENGTHS_LIST,
  TOTAL_BG_FRAMES,
  USE_DOMAINS,
  calculateScrollFrame,
  calculateScrollProgress,
  getUseDomainById,
} from "@/lib/vrContent";

export default function SplitVrShowcase() {
  const componentsSectionRef = useRef<HTMLElement | null>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const [currentFrame, setCurrentFrame] = useState<number>(1);
  const [selectedDomainId, setSelectedDomainId] = useState<string>(
    USE_DOMAINS[0].id
  );
  const [activeAnnotationId, setActiveAnnotationId] = useState<string | null>(
    null
  );

  const activeDomain = getUseDomainById(selectedDomainId);

  // Sync the VR headset frame 1:1 with window.scrollY from top (frame 1) to bottom (frame 193)
  useEffect(() => {
    let rafId = 0;

    const updateFromScroll = () => {
      rafId = 0;
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const progress = calculateScrollProgress(window.scrollY, maxScroll);
      setCurrentFrame(calculateScrollFrame(progress, TOTAL_BG_FRAMES));
    };

    const onScroll = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(updateFromScroll);
      }
    };

    updateFromScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  const handleNavigateSection = useCallback((sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (!target) return;

    const isMobileOrTablet = window.innerWidth < 1024;
    const maxTop = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight
    );

    if (sectionId === "composants") {
      window.scrollTo({ top: maxTop, behavior: "smooth" });
      return;
    }

    const headerOffset = isMobileOrTablet ? 320 : 88;
    const top = Math.max(
      0,
      target.getBoundingClientRect().top + window.scrollY - headerOffset
    );
    window.scrollTo({ top, behavior: "smooth" });
  }, []);

  const handleResetTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleTabKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    const lastIndex = USE_DOMAINS.length - 1;
    let nextIndex: number | null = null;

    if (e.key === "ArrowRight") {
      nextIndex = index === lastIndex ? 0 : index + 1;
    } else if (e.key === "ArrowLeft") {
      nextIndex = index === 0 ? lastIndex : index - 1;
    } else if (e.key === "Home") {
      nextIndex = 0;
    } else if (e.key === "End") {
      nextIndex = lastIndex;
    }

    if (nextIndex !== null) {
      e.preventDefault();
      const nextDomain = USE_DOMAINS[nextIndex];
      setSelectedDomainId(nextDomain.id);
      tabRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-[#F4F6FA]">
      {/* Static radial halo background */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-black bg-[radial-gradient(circle_at_50%_24%,rgba(56,189,248,0.13),rgba(15,38,86,0.06)_45%,transparent_70%)] lg:bg-[radial-gradient(circle_at_72%_52%,rgba(56,189,248,0.13),rgba(15,38,86,0.06)_45%,transparent_70%)]"
      />

      <TopNav onNavigateSection={handleNavigateSection} />

      <div className="relative z-10">
        <main>
          <div className="mx-auto max-w-7xl px-6 pt-4 pb-10 lg:pt-10 lg:pb-12">
            <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,445px)_minmax(0,1fr)] lg:items-start lg:gap-12">
              <AppleVrBackgroundStage
                targetFrame={currentFrame}
                activeAnnotationId={activeAnnotationId}
                onSelectAnnotation={setActiveAnnotationId}
                onResetTop={handleResetTop}
              />

              {/* Left column: French academic narrative */}
              <div className="order-2 lg:order-1 w-full flex flex-col gap-10 lg:gap-12">
                {/* 1. Introduction */}
                <section
                  id="introduction"
                  className="pt-1 lg:min-h-[52vh] lg:flex lg:flex-col lg:justify-center"
                >
                  <h1
                    className="font-bold tracking-[-0.03em] text-white leading-[1.08]"
                    style={{ fontSize: "clamp(1.8rem, 3.1vw, 2.85rem)" }}
                  >
                    La Réalité Virtuelle : importance et utilisations
                  </h1>

                  <p className="mt-4 text-base leading-[1.6] text-[#D4DAE4] max-w-[44ch]">
                    La réalité virtuelle (RV) simule un environnement complet en
                    3D dans lequel l&apos;utilisateur interagit en temps réel
                    grâce à un casque immersif.
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <a
                      href="#importance"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigateSection("importance");
                      }}
                      className="inline-flex items-center gap-2 rounded-lg bg-sky-400 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-sky-300 transition-colors duration-150 whitespace-nowrap shrink-0 min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                    >
                      <span>Découvrir l&apos;importance</span>
                      <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </div>
                </section>

                {/* 2. Importance */}
                <section
                  id="importance"
                  className="border-t border-white/[0.12] pt-8 lg:pt-10"
                >
                  <h2 className="text-xl lg:text-2xl font-semibold tracking-[-0.02em] text-white">
                    Pourquoi est-elle importante ?
                  </h2>
                  <p className="mt-2 text-sm leading-[1.6] text-[#9BA6B8]">
                    Au-delà du jeu, la RV répond à des besoins concrets de
                    formation, de sécurité et de science.
                  </p>

                  <div className="mt-5 divide-y divide-white/[0.08] border-t border-white/[0.08]">
                    {IMPORTANCE_PILLARS.map((pillar) => (
                      <article key={pillar.id} className="py-3">
                        <span className="font-mono text-xs text-sky-400">
                          {pillar.number}
                        </span>
                        <h3 className="mt-0.5 text-sm font-semibold text-white">
                          {pillar.title}
                        </h3>
                        <p className="mt-1 text-sm leading-[1.55] text-[#D4DAE4]">
                          {pillar.summary}
                        </p>
                      </article>
                    ))}
                  </div>
                </section>

                {/* 3. Domaines d'utilisation */}
                <section
                  id="utilisations"
                  className="border-t border-white/[0.12] pt-8 lg:pt-10"
                >
                  <h2 className="text-xl lg:text-2xl font-semibold tracking-[-0.02em] text-white">
                    Où utilise-t-on la réalité virtuelle ?
                  </h2>
                  <p className="mt-2 text-sm leading-[1.6] text-[#9BA6B8]">
                    Sélectionnez un secteur pour voir ses usages concrets.
                  </p>

                  <div
                    role="tablist"
                    aria-label="Domaines d'utilisation de la réalité virtuelle"
                    className="mt-4 flex flex-wrap gap-5 border-b border-white/[0.1]"
                  >
                    {USE_DOMAINS.map((domain, index) => {
                      const isSelected = domain.id === activeDomain.id;
                      return (
                        <button
                          key={domain.id}
                          ref={(el) => {
                            tabRefs.current[index] = el;
                          }}
                          id={`tab-${domain.id}`}
                          type="button"
                          role="tab"
                          aria-selected={isSelected}
                          aria-controls={`panel-${domain.id}`}
                          tabIndex={isSelected ? 0 : -1}
                          onClick={() => setSelectedDomainId(domain.id)}
                          onKeyDown={(e) => handleTabKeyDown(e, index)}
                          className={`relative pb-2.5 text-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded-sm ${
                            isSelected
                              ? "text-white font-semibold"
                              : "text-[#9BA6B8] hover:text-white"
                          }`}
                        >
                          {domain.label}
                          {isSelected ? (
                            <span
                              aria-hidden="true"
                              className="absolute inset-x-0 -bottom-px h-0.5 bg-sky-400"
                            />
                          ) : null}
                        </button>
                      );
                    })}
                  </div>

                  <div
                    id={`panel-${activeDomain.id}`}
                    role="tabpanel"
                    aria-labelledby={`tab-${activeDomain.id}`}
                    className="mt-4"
                  >
                    <h3 className="text-base font-semibold text-white">
                      {activeDomain.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-[1.55] text-[#D4DAE4]">
                      {activeDomain.summary}
                    </p>

                    <ul className="mt-3.5 space-y-2">
                      {activeDomain.examples.map((example) => (
                        <li
                          key={example}
                          className="flex items-start gap-2 text-sm leading-[1.5] text-[#D4DAE4]"
                        >
                          <Check
                            className="mt-0.5 h-4 w-4 shrink-0 text-sky-400"
                            aria-hidden="true"
                          />
                          <span>{example}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 border-t border-white/[0.08] pt-3">
                      <p className="text-sm font-medium text-[#9BA6B8]">
                        Objectif principal :{" "}
                        <span className="text-sky-300">
                          {activeDomain.objective}
                        </span>
                      </p>
                    </div>
                  </div>
                </section>

                {/* 4. Composants clés du casque & Synthèse finale */}
                <section
                  id="composants"
                  ref={componentsSectionRef}
                  className="border-t border-white/[0.12] pt-8 lg:pt-10"
                >
                  <h2 className="text-xl lg:text-2xl font-semibold tracking-[-0.02em] text-white">
                    Les principaux composants du casque
                  </h2>
                  <p className="mt-2 text-sm leading-[1.55] text-[#9BA6B8]">
                    À la fin des 6 secondes, les six éléments s&apos;affichent.
                    Sélectionnez-en un pour le mettre en évidence.
                  </p>

                  <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {HEADSET_ANNOTATIONS.map((ann) => {
                      const isActive = activeAnnotationId === ann.id;
                      return (
                        <button
                          key={ann.id}
                          type="button"
                          onMouseEnter={() => setActiveAnnotationId(ann.id)}
                          onMouseLeave={() => setActiveAnnotationId(null)}
                          onClick={() =>
                            setActiveAnnotationId(isActive ? null : ann.id)
                          }
                          className={`w-full rounded-md border px-3 py-2.5 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                            isActive
                              ? "border-sky-400/50 bg-sky-500/[0.1]"
                              : "border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04]"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`text-sm font-semibold transition-colors duration-150 ${
                                isActive ? "text-sky-300" : "text-white"
                              }`}
                            >
                              {ann.label}
                            </span>
                            <span
                              aria-hidden="true"
                              className={`h-1.5 w-1.5 rounded-full transition-colors duration-150 ${
                                isActive ? "bg-sky-400" : "bg-white/25"
                              }`}
                            />
                          </div>
                          <p className="mt-1 text-sm leading-[1.45] text-[#9BA6B8]">
                            {ann.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>

                  {/* Forces & Limites */}
                  <div
                    id="synthese"
                    className="mt-6 grid grid-cols-1 gap-5 border-t border-white/[0.12] pt-6"
                  >
                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        Forces majeures
                      </h3>
                      <ul className="mt-2 space-y-1.5 text-sm leading-[1.5] text-[#D4DAE4]">
                        {STRENGTHS_LIST.map((item) => (
                          <li key={item} className="flex gap-2">
                            <span aria-hidden="true">—</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        Limites actuelles
                      </h3>
                      <ul className="mt-2 space-y-1.5 text-sm leading-[1.5] text-[#D4DAE4]">
                        {LIMITS_LIST.map((item) => (
                          <li key={item} className="flex gap-2">
                            <span aria-hidden="true">—</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-white/[0.12] pt-5">
                    <h3 className="text-sm font-semibold text-white">
                      Conclusion générale
                    </h3>
                    <p className="mt-1.5 text-sm leading-[1.55] text-[#D4DAE4]">
                      La réalité virtuelle complète l&apos;enseignement et la
                      pratique professionnelle en offrant un espace
                      d&apos;expérimentation sûr, immersif et accessible.
                    </p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </main>

        <Footer onNavigateSection={handleNavigateSection} />
      </div>
    </div>
  );
}
