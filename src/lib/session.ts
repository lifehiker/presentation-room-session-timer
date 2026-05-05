export type ColorTheme = "ink" | "signal" | "moss" | "ocean" | "sun" | "plum";

export type SegmentItem = {
  id: string;
  type: "segment";
  name: string;
  durationSeconds: number;
  theme: ColorTheme;
};

export type IntervalItem = {
  id: string;
  type: "interval";
  name: string;
  workSeconds: number;
  restSeconds: number;
  repeats: number;
  theme: ColorTheme;
};

export type SessionItem = SegmentItem | IntervalItem;

export type SessionDraft = {
  id: string;
  title: string;
  subtitle: string;
  items: SessionItem[];
  updatedAt: string;
};

export type ExpandedSegment = {
  id: string;
  sourceItemId: string;
  kind: "segment" | "work" | "rest";
  name: string;
  durationSeconds: number;
  theme: ColorTheme;
};

export type TemplateRecord = SessionDraft & {
  createdAt: string;
  source: "saved" | "preset";
  slug?: string;
};

export type PlanTier = "free" | "pro";

export type ThemePalette = {
  accent: string;
  accentSoft: string;
  panel: string;
  frame: string;
  text: string;
  glow: string;
  wash: string;
};

export const themePalettes: Record<ColorTheme, ThemePalette> = {
  ink: {
    accent: "#f4efe4",
    accentSoft: "rgba(244, 239, 228, 0.18)",
    panel: "#181714",
    frame: "#2a2824",
    text: "#f7f4ed",
    glow: "rgba(255, 248, 231, 0.18)",
    wash: "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.12), transparent 42%), linear-gradient(135deg, #161511 0%, #25221e 100%)",
  },
  signal: {
    accent: "#ff6b3d",
    accentSoft: "rgba(255, 107, 61, 0.18)",
    panel: "#1b1311",
    frame: "#3a241b",
    text: "#fff4ef",
    glow: "rgba(255, 107, 61, 0.3)",
    wash: "radial-gradient(circle at 18% 18%, rgba(255, 155, 123, 0.18), transparent 44%), linear-gradient(135deg, #1a120f 0%, #3b1f18 100%)",
  },
  moss: {
    accent: "#b3e16f",
    accentSoft: "rgba(179, 225, 111, 0.18)",
    panel: "#121812",
    frame: "#223226",
    text: "#f3f8ea",
    glow: "rgba(179, 225, 111, 0.26)",
    wash: "radial-gradient(circle at 16% 20%, rgba(204, 240, 148, 0.14), transparent 44%), linear-gradient(135deg, #10140f 0%, #1e2d20 100%)",
  },
  ocean: {
    accent: "#72d9ff",
    accentSoft: "rgba(114, 217, 255, 0.18)",
    panel: "#10161a",
    frame: "#1f3139",
    text: "#eefbff",
    glow: "rgba(114, 217, 255, 0.28)",
    wash: "radial-gradient(circle at 18% 16%, rgba(146, 230, 255, 0.14), transparent 42%), linear-gradient(135deg, #0d1418 0%, #18303a 100%)",
  },
  sun: {
    accent: "#ffcb52",
    accentSoft: "rgba(255, 203, 82, 0.18)",
    panel: "#1a150d",
    frame: "#3c2e13",
    text: "#fff9ea",
    glow: "rgba(255, 203, 82, 0.26)",
    wash: "radial-gradient(circle at 20% 18%, rgba(255, 217, 138, 0.14), transparent 44%), linear-gradient(135deg, #18120b 0%, #342610 100%)",
  },
  plum: {
    accent: "#ef99c9",
    accentSoft: "rgba(239, 153, 201, 0.18)",
    panel: "#1b1218",
    frame: "#3b2234",
    text: "#fff2fb",
    glow: "rgba(239, 153, 201, 0.25)",
    wash: "radial-gradient(circle at 16% 20%, rgba(249, 187, 220, 0.14), transparent 42%), linear-gradient(135deg, #160f14 0%, #341d30 100%)",
  },
};

export const colorThemeOptions: Array<{ value: ColorTheme; label: string }> = [
  { value: "ink", label: "Midnight" },
  { value: "signal", label: "Signal Red" },
  { value: "moss", label: "Moss" },
  { value: "ocean", label: "Ocean" },
  { value: "sun", label: "Sun" },
  { value: "plum", label: "Plum" },
];

export function clampSeconds(value: number) {
  return Math.max(5, Math.min(4 * 60 * 60, Math.floor(value)));
}

export function clampOptionalSeconds(value: number) {
  return Math.max(0, Math.min(4 * 60 * 60, Math.floor(value)));
}

export function formatDuration(totalSeconds: number) {
  const clamped = Math.max(0, totalSeconds);
  const hours = Math.floor(clamped / 3600);
  const minutes = Math.floor((clamped % 3600) / 60);
  const seconds = clamped % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function formatCompactDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const chunks: string[] = [];

  if (hours) {
    chunks.push(`${hours}h`);
  }
  if (minutes) {
    chunks.push(`${minutes}m`);
  }
  if (seconds || chunks.length === 0) {
    chunks.push(`${seconds}s`);
  }

  return chunks.join(" ");
}

export function sessionDuration(items: SessionItem[]) {
  return expandSession(items).reduce((sum, item) => sum + item.durationSeconds, 0);
}

export function segmentCount(items: SessionItem[]) {
  return expandSession(items).length;
}

export function expandSession(items: SessionItem[]) {
  const segments: ExpandedSegment[] = [];

  for (const item of items) {
    if (item.type === "segment") {
      segments.push({
        id: item.id,
        sourceItemId: item.id,
        kind: "segment",
        name: item.name,
        durationSeconds: clampSeconds(item.durationSeconds),
        theme: item.theme,
      });
      continue;
    }

    for (let round = 0; round < item.repeats; round += 1) {
      segments.push({
        id: `${item.id}-work-${round + 1}`,
        sourceItemId: item.id,
        kind: "work",
        name: `${item.name} · Work ${round + 1}`,
        durationSeconds: clampSeconds(item.workSeconds),
        theme: item.theme,
      });

      if (round < item.repeats - 1 && item.restSeconds > 0) {
        segments.push({
          id: `${item.id}-rest-${round + 1}`,
          sourceItemId: item.id,
          kind: "rest",
          name: `${item.name} · Rest ${round + 1}`,
          durationSeconds: clampSeconds(item.restSeconds),
          theme: "ink",
        });
      }
    }
  }

  return segments;
}

export function cloneDraft<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
