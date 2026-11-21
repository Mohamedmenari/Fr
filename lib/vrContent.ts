export const TOTAL_BG_FRAMES = 193;
export const ANIMATION_DURATION_SECONDS = 6;
export const ANIMATION_DURATION_MS = ANIMATION_DURATION_SECONDS * 1000;

export function getBgFrameUrl(frameIndex: number): string {
  const clamped = Math.max(1, Math.min(TOTAL_BG_FRAMES, Math.round(frameIndex)));
  const padded = String(clamped).padStart(4, "0");
  return `/aivid/frames/frame_${padded}.webp`;
}

export function calculateScrollProgress(
  scrollTop: number,
  maxScroll: number
): number {
  if (!Number.isFinite(scrollTop) || !Number.isFinite(maxScroll) || maxScroll <= 0) {
    return 0;
  }
  return Math.max(0, Math.min(1, scrollTop / maxScroll));
}

export function calculateScrollFrame(
  progress: number,
  totalFrames: number = TOTAL_BG_FRAMES
): number {
  const safeProgress = Number.isFinite(progress)
    ? Math.max(0, Math.min(1, progress))
    : 0;
  return Math.max(
    1,
    Math.min(totalFrames, Math.round(safeProgress * (totalFrames - 1)) + 1)
  );
}

export function calculateAnimationTimeSeconds(
  frame: number,
  totalFrames: number = TOTAL_BG_FRAMES,
  durationSeconds: number = ANIMATION_DURATION_SECONDS
): number {
  if (!Number.isFinite(frame) || totalFrames <= 1 || durationSeconds <= 0) {
    return 0;
  }
  const clampedFrame = Math.max(1, Math.min(totalFrames, frame));
  const ratio = (clampedFrame - 1) / (totalFrames - 1);
  return Math.round(ratio * durationSeconds * 10) / 10;
}

export function shouldShowAnnotations(frame: number): boolean {
  return frame >= 190;
}

export interface ImportancePillar {
  id: string;
  number: string;
  title: string;
  summary: string;
}

export interface UseDomain {
  id: string;
  label: string;
  title: string;
  summary: string;
  examples: string[];
  objective: string;
}

export interface HeadsetAnnotation {
  id: string;
  label: string;
  description: string;
  /** Target dot coordinates in viewBox 0..1000 x 0..562.5 (16:9 with 4% stage margin) */
  dotX: number;
  dotY: number;
  /** Label anchor coordinates in viewBox 0..1000 x 0..562.5 */
  labelX: number;
  labelY: number;
  anchor: "start" | "middle" | "end";
}

export const HEADSET_ANNOTATIONS: HeadsetAnnotation[] = [
  {
    id: "visiere",
    label: "Visière frontale",
    description: "Coque légère intégrant les repères de suivi.",
    dotX: 178,
    dotY: 294,
    labelX: 178,
    labelY: 38,
    anchor: "middle",
  },
  {
    id: "cameras",
    label: "Caméras de suivi",
    description: "Capteurs détectant tête et mains en 3D.",
    dotX: 397,
    dotY: 166,
    labelX: 397,
    labelY: 38,
    anchor: "middle",
  },
  {
    id: "arceau",
    label: "Arceau de maintien",
    description: "Maintien ergonomique répartissant le poids.",
    dotX: 740,
    dotY: 112,
    labelX: 790,
    labelY: 38,
    anchor: "middle",
  },
  {
    id: "lentilles",
    label: "Lentilles optiques",
    description: "Optique élargissant le champ de vision 3D.",
    dotX: 419,
    dotY: 337,
    labelX: 250,
    labelY: 545,
    anchor: "middle",
  },
  {
    id: "ecrans",
    label: "Écrans micro-OLED",
    description: "Double dalle HD dédiée à chaque œil.",
    dotX: 505,
    dotY: 278,
    labelX: 545,
    labelY: 545,
    anchor: "middle",
  },
  {
    id: "processeur",
    label: "Processeur spatial",
    description: "Calcul temps réel du rendu et du suivi.",
    dotX: 690,
    dotY: 291,
    labelX: 775,
    labelY: 545,
    anchor: "middle",
  },
];

export const IMPORTANCE_PILLARS: ImportancePillar[] = [
  {
    id: "securite",
    number: "01",
    title: "S'entraîner sans danger",
    summary:
      "Répéter des gestes médicaux ou industriels complexes sans risque réel.",
  },
  {
    id: "memorisation",
    number: "02",
    title: "Comprendre par l'expérience",
    summary:
      "L'immersion 3D renforce l'attention et la mémorisation pratique.",
  },
  {
    id: "accessibilite",
    number: "03",
    title: "Réduire coûts et distances",
    summary:
      "Simuler des laboratoires et équipements coûteux accessibles partout.",
  },
  {
    id: "visualisation",
    number: "04",
    title: "Observer l'invisible",
    summary:
      "Explorer une cellule, une molécule ou un site historique reconstitué.",
  },
];

export const USE_DOMAINS: UseDomain[] = [
  {
    id: "education",
    label: "Éducation",
    title: "Éducation et formation",
    summary:
      "Compléter la théorie par des travaux pratiques immersifs et sûrs.",
    examples: [
      "Visites virtuelles de musées et sites historiques.",
      "Travaux pratiques de chimie ou mécanique sans danger.",
      "Entraînement à la maintenance et à l'oral.",
    ],
    objective: "Passer de l'observation à la pratique active.",
  },
  {
    id: "medecine",
    label: "Médecine",
    title: "Médecine et rééducation",
    summary:
      "Former les soignants et accompagner la thérapie des patients.",
    examples: [
      "Simulation 3D d'opérations chirurgicales.",
      "Traitement progressif de certaines phobies.",
      "Rééducation motrice interactive et mesurable.",
    ],
    objective: "Améliorer la précision médicale et le soin.",
  },
  {
    id: "architecture",
    label: "Architecture",
    title: "Architecture et industrie",
    summary:
      "Visualiser chaque projet à l'échelle réelle avant la fabrication.",
    examples: [
      "Visite d'un bâtiment futur pour tester la lumière.",
      "Détection précoce des défauts de conception.",
      "Revue collaborative d'une maquette 3D à distance.",
    ],
    objective: "Limiter les erreurs et optimiser la production.",
  },
  {
    id: "culture",
    label: "Culture",
    title: "Culture et patrimoine",
    summary:
      "Conserver, restaurer et partager le patrimoine mondial.",
    examples: [
      "Reconstitution fidèle de monuments disparus.",
      "Accès à distance aux collections de musées.",
      "Exploration interactive d'œuvres artistiques.",
    ],
    objective: "Préserver et démocratiser l'accès culturel.",
  },
];

export const STRENGTHS_LIST: string[] = [
  "Immersion captant durablement l'attention.",
  "Répétition illimitée des exercices.",
  "Partage simple entre établissements.",
];

export const LIMITS_LIST: string[] = [
  "Coût élevé des casques et logiciels.",
  "Fatigue visuelle en usage prolongé.",
  "Encadrement humain indispensable.",
];

export function getUseDomainById(id: string): UseDomain {
  return USE_DOMAINS.find((item) => item.id === id) ?? USE_DOMAINS[0];
}
