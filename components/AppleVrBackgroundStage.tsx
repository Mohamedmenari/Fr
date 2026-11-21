"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import HeadsetAnnotationsSvg from "@/components/HeadsetAnnotationsSvg";
import {
  TOTAL_BG_FRAMES,
  getBgFrameUrl,
  shouldShowAnnotations,
} from "@/lib/vrContent";

interface AppleVrBackgroundStageProps {
  targetFrame: number;
  activeAnnotationId: string | null;
  onSelectAnnotation: (id: string | null) => void;
  onResetTop: () => void;
}

export default function AppleVrBackgroundStage({
  targetFrame,
  activeAnnotationId,
  onSelectAnnotation,
  onResetTop,
}: AppleVrBackgroundStageProps) {
  const headsetCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const targetFrameRef = useRef<number>(targetFrame);
  const displayFrameRef = useRef<number>(targetFrame);

  const [loadedCount, setLoadedCount] = useState<number>(0);

  // Draw a specific WebP frame onto pure #000000 black with a 4% margin
  const drawHeadsetFrame = useCallback((frameFloat: number) => {
    const canvas = headsetCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const targetIdx = Math.max(
      1,
      Math.min(TOTAL_BG_FRAMES, Math.round(frameFloat))
    );
    const map = imagesRef.current;
    let img = map.get(targetIdx);

    if (!img || !img.complete || img.naturalWidth === 0) {
      let bestDist = Infinity;
      let bestImg: HTMLImageElement | undefined;
      map.forEach((candidate, idx) => {
        if (candidate.complete && candidate.naturalWidth > 0) {
          const dist = Math.abs(idx - targetIdx);
          if (dist < bestDist) {
            bestDist = dist;
            bestImg = candidate;
          }
        }
      });
      img = bestImg;
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, w * 0.04, h * 0.04, w * 0.92, h * 0.92);

    // Keep bottom-right mask until the 193 frames are re-exported without the "Dola AI" watermark
    ctx.fillStyle = "#000000";
    ctx.fillRect(w * 0.8, h * 0.84, w * 0.2, h * 0.16);
  }, []);

  // Preload keyframes first, then stream remaining frames; update state every 10 frames and on completion
  useEffect(() => {
    let cancelled = false;
    const priorityFrames = [1, 25, 49, 73, 97, 121, 145, 169, 193];
    const remainingFrames: number[] = [];
    for (let i = 1; i <= TOTAL_BG_FRAMES; i++) {
      if (!priorityFrames.includes(i)) remainingFrames.push(i);
    }

    const loadSingle = (frameIdx: number) =>
      new Promise<void>((resolve) => {
        if (cancelled || imagesRef.current.has(frameIdx)) {
          resolve();
          return;
        }
        const img = new window.Image();
        img.decoding = "async";
        img.onload = () => {
          if (!cancelled) {
            imagesRef.current.set(frameIdx, img);
            const loaded = imagesRef.current.size;
            if (loaded % 10 === 0 || loaded === TOTAL_BG_FRAMES) {
              setLoadedCount(loaded);
            }
            if (
              Math.abs(frameIdx - Math.round(displayFrameRef.current)) <= 1 ||
              (frameIdx === 1 && Math.round(displayFrameRef.current) === 1)
            ) {
              drawHeadsetFrame(displayFrameRef.current);
            }
          }
          resolve();
        };
        img.onerror = () => resolve();
        img.src = getBgFrameUrl(frameIdx);
      });

    const preloadAll = async () => {
      await Promise.all(priorityFrames.map(loadSingle));
      if (!cancelled) {
        drawHeadsetFrame(displayFrameRef.current);
      }
      const batchSize = 10;
      for (let i = 0; i < remainingFrames.length; i += batchSize) {
        if (cancelled) break;
        await Promise.all(
          remainingFrames.slice(i, i + batchSize).map(loadSingle)
        );
      }
      if (!cancelled) {
        setLoadedCount(TOTAL_BG_FRAMES);
      }
    };

    preloadAll();
    return () => {
      cancelled = true;
    };
  }, [drawHeadsetFrame]);

  // Smooth inertial frame interpolation (honors prefers-reduced-motion)
  useEffect(() => {
    targetFrameRef.current = targetFrame;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      displayFrameRef.current = targetFrame;
      drawHeadsetFrame(targetFrame);
      return;
    }

    let rafId = 0;

    const tick = () => {
      const diff = targetFrameRef.current - displayFrameRef.current;
      if (Math.abs(diff) <= 0.15) {
        displayFrameRef.current = targetFrameRef.current;
        drawHeadsetFrame(displayFrameRef.current);
        rafId = 0;
        return;
      }

      displayFrameRef.current += diff * 0.42;
      drawHeadsetFrame(displayFrameRef.current);
      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [targetFrame, drawHeadsetFrame]);

  const annotationsVisible = shouldShowAnnotations(targetFrame);

  const stageCaption =
    targetFrame < 49
      ? "Casque assemblé"
      : targetFrame < 110
      ? "Séparation du boîtier"
      : targetFrame < 165
      ? "Révélation optique interne"
      : "Vue éclatée et annotée";

  const activeDescription = annotationsVisible
    ? activeAnnotationId
      ? "Composant mis en évidence sur le schéma."
      : "Survolez une ligne ou choisissez un composant."
    : null;

  const loadingPct = Math.round((loadedCount / TOTAL_BG_FRAMES) * 100);

  return (
    <div
      data-testid="headset-scroll-stage"
      data-frame={targetFrame}
      data-annotations-visible={String(annotationsVisible)}
      className="order-1 lg:order-2 sticky top-16 z-20 border-b border-white/[0.08] bg-black py-2 lg:top-24 lg:self-start lg:border-b-0 lg:bg-transparent lg:py-0"
    >
      <div className="relative mx-auto aspect-video w-full max-w-[440px] max-h-[34dvh] lg:max-w-none lg:max-h-none bg-black">
        {/* Poster image behind canvas so the stage is never blank during initial load */}
        <img
          src="/aivid/frames/frame_0001.webp"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-contain p-[4%]"
        />

        <canvas
          ref={headsetCanvasRef}
          width={1280}
          height={720}
          className="relative z-10 block h-full w-full object-contain"
          aria-label={`Animation du casque de réalité virtuelle au défilement — image ${targetFrame} sur ${TOTAL_BG_FRAMES}`}
        />

        <div className="absolute inset-0 z-20">
          <HeadsetAnnotationsSvg
            visible={annotationsVisible}
            activeAnnotationId={activeAnnotationId}
            onSelectAnnotation={onSelectAnnotation}
          />
        </div>
      </div>

      {/* Minimal status line */}
      <div className="mt-1.5 flex items-baseline justify-between gap-4 border-t border-white/[0.08] pt-2 lg:mt-3 lg:gap-6 lg:pt-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-[#F4F6FA] truncate">
            {stageCaption}
          </p>
          {activeDescription ? (
            <p className="hidden lg:block mt-0.5 text-sm text-[#9BA6B8] truncate">
              {activeDescription}
            </p>
          ) : null}
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <span className="text-sm font-mono tabular-nums text-[#9BA6B8]">
            {loadedCount < TOTAL_BG_FRAMES
              ? `Chargement ${loadingPct} %`
              : `${String(targetFrame).padStart(3, "0")} / ${TOTAL_BG_FRAMES}`}
          </span>
          {annotationsVisible ? (
            <button
              type="button"
              onClick={onResetTop}
              className="text-sm font-medium text-sky-400 hover:text-sky-300 underline-offset-4 hover:underline transition-colors whitespace-nowrap"
            >
              Revenir au début
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
