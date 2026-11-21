"use client";

import React from "react";
import { HEADSET_ANNOTATIONS } from "@/lib/vrContent";

const LABEL_GAP = 14;

interface HeadsetAnnotationsSvgProps {
  visible: boolean;
  activeAnnotationId: string | null;
  onSelectAnnotation: (id: string | null) => void;
}

export default function HeadsetAnnotationsSvg({
  visible,
  activeAnnotationId,
  onSelectAnnotation,
}: HeadsetAnnotationsSvgProps) {
  return (
    <svg
      viewBox="0 0 1000 562.5"
      className={`absolute inset-0 h-full w-full transition-opacity duration-300 ${
        visible
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <g aria-label="Schéma annoté des principaux composants du casque de réalité virtuelle">
        {HEADSET_ANNOTATIONS.map((ann) => {
          const isHighlighted = activeAnnotationId === ann.id;
          const isDimmed = activeAnnotationId !== null && !isHighlighted;
          const strokeColor = isHighlighted ? "#38BDF8" : "#CBD5E1";
          const lineWidth = isHighlighted ? 2.1 : 1.25;
          const textColor = isHighlighted
            ? "#7DD3FC"
            : isDimmed
            ? "#9BA6B8"
            : "#F8FAFC";

          const lineEndY =
            ann.labelY < 280
              ? ann.labelY + LABEL_GAP
              : ann.labelY - LABEL_GAP;

          const handleToggle = () => {
            onSelectAnnotation(isHighlighted ? null : ann.id);
          };

          const handleKeyDown = (e: React.KeyboardEvent<SVGGElement>) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleToggle();
            }
          };

          return (
            <g
              key={ann.id}
              tabIndex={visible ? 0 : -1}
              role="button"
              aria-label={ann.label}
              aria-pressed={isHighlighted}
              className="cursor-pointer focus:outline-none"
              opacity={isDimmed ? 0.5 : 1}
              onMouseEnter={() => onSelectAnnotation(ann.id)}
              onMouseLeave={() => onSelectAnnotation(null)}
              onFocus={() => onSelectAnnotation(ann.id)}
              onBlur={() => onSelectAnnotation(null)}
              onClick={handleToggle}
              onKeyDown={handleKeyDown}
            >
              <line
                x1={ann.dotX}
                y1={ann.dotY}
                x2={ann.labelX}
                y2={lineEndY}
                stroke={strokeColor}
                strokeWidth={lineWidth}
                strokeOpacity={isHighlighted ? 1 : 0.85}
              />

              {/* Invisible 24px radius touch/pointer hit area */}
              <circle cx={ann.dotX} cy={ann.dotY} r="24" fill="transparent" />

              {/* Precision target ring & core point */}
              <circle
                cx={ann.dotX}
                cy={ann.dotY}
                r={isHighlighted ? 8 : 5}
                fill="none"
                stroke={
                  isHighlighted ? "#38BDF8" : "rgba(248, 250, 252, 0.45)"
                }
                strokeWidth="1"
              />
              <circle
                cx={ann.dotX}
                cy={ann.dotY}
                r={isHighlighted ? 3.8 : 2.8}
                fill={isHighlighted ? "#38BDF8" : "#F8FAFC"}
              />

              <text
                x={ann.labelX}
                y={ann.labelY}
                textAnchor={ann.anchor}
                fill={textColor}
                fontSize="18"
                fontWeight={isHighlighted ? "700" : "500"}
                fontFamily="var(--font-body), sans-serif"
                paintOrder="stroke"
                stroke="#000000"
                strokeWidth="6.5"
                strokeLinejoin="round"
                className="max-md:hidden"
              >
                {ann.label}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
