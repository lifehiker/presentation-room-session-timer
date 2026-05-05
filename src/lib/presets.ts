import { nanoid } from "nanoid";

import type { SessionDraft } from "@/lib/session";

export type UseCaseCopy = {
  slug: string;
  title: string;
  eyebrow: string;
  hero: string;
  description: string;
  bullets: string[];
  cta: string;
  templateSlug: string;
};

const keynoteRhythm: SessionDraft = {
  id: "preset-keynote-rhythm",
  title: "Keynote Rhythm",
  subtitle: "Open strong, land the middle, keep space for the final close.",
  updatedAt: "2026-05-04T00:00:00.000Z",
  items: [
    { id: nanoid(), type: "segment", name: "Opening hook", durationSeconds: 120, theme: "signal" },
    { id: nanoid(), type: "segment", name: "Core story", durationSeconds: 900, theme: "ocean" },
    { id: nanoid(), type: "segment", name: "Case study", durationSeconds: 420, theme: "sun" },
    { id: nanoid(), type: "segment", name: "Closing ask", durationSeconds: 180, theme: "moss" },
  ],
};

const workshopSprint: SessionDraft = {
  id: "preset-workshop-sprint",
  title: "Workshop Sprint",
  subtitle: "A facilitation flow for room-energy workshops with structured breakouts.",
  updatedAt: "2026-05-04T00:00:00.000Z",
  items: [
    { id: nanoid(), type: "segment", name: "Warm-up framing", durationSeconds: 300, theme: "signal" },
    { id: nanoid(), type: "interval", name: "Breakout rounds", workSeconds: 480, restSeconds: 60, repeats: 3, theme: "moss" },
    { id: nanoid(), type: "segment", name: "Share-back", durationSeconds: 600, theme: "ocean" },
    { id: nanoid(), type: "segment", name: "Wrap-up", durationSeconds: 240, theme: "sun" },
  ],
};

const classroomBlocks: SessionDraft = {
  id: "preset-classroom-blocks",
  title: "Classroom Blocks",
  subtitle: "A readable visual timer for transitions, work time, and reflective close.",
  updatedAt: "2026-05-04T00:00:00.000Z",
  items: [
    { id: nanoid(), type: "segment", name: "Directions", durationSeconds: 180, theme: "signal" },
    { id: nanoid(), type: "segment", name: "Independent work", durationSeconds: 900, theme: "moss" },
    { id: nanoid(), type: "segment", name: "Partner check", durationSeconds: 300, theme: "ocean" },
    { id: nanoid(), type: "segment", name: "Exit ticket", durationSeconds: 180, theme: "sun" },
  ],
};

const breathworkSet: SessionDraft = {
  id: "preset-breathwork-set",
  title: "Coaching Reset",
  subtitle: "Grounding intervals for therapy, coaching, or private practice resets.",
  updatedAt: "2026-05-04T00:00:00.000Z",
  items: [
    { id: nanoid(), type: "segment", name: "Arrival", durationSeconds: 120, theme: "plum" },
    { id: nanoid(), type: "interval", name: "Breath cycle", workSeconds: 75, restSeconds: 30, repeats: 5, theme: "ocean" },
    { id: nanoid(), type: "segment", name: "Reflection", durationSeconds: 240, theme: "ink" },
  ],
};

export const featuredTemplates = [
  { slug: "keynote-rhythm", summary: "Speaker pacing template for clean 20-minute talks.", session: keynoteRhythm },
  { slug: "workshop-sprint", summary: "Breakout-heavy facilitation flow with structured resets.", session: workshopSprint },
  { slug: "classroom-blocks", summary: "Teacher-friendly visual timer for focused classroom work.", session: classroomBlocks },
  { slug: "coaching-reset", summary: "Interval-based coaching and therapy reset flow.", session: breathworkSet },
];

export const useCasePages: UseCaseCopy[] = [
  {
    slug: "presentation-timer",
    title: "Presentation Timer",
    eyebrow: "Large display pacing for talks and decks",
    hero: "A presentation timer built to be read across the room, not hidden on a laptop.",
    description: "Keep speakers, co-presenters, and room energy aligned with named agenda segments, color-based phase changes, and a timer face that stays legible from the back row.",
    bullets: ["Oversized digits for confidence monitors and projector screens", "Named segments instead of a single anonymous countdown", "Final-10-second warning for clean landings"],
    cta: "Launch the presentation timer",
    templateSlug: "keynote-rhythm",
  },
  {
    slug: "speaker-timer",
    title: "Speaker Timer",
    eyebrow: "Pacing support for rehearsals and live delivery",
    hero: "A speaker timer that turns stage pacing into a visible rhythm, not a guessing game.",
    description: "Use one-off rehearsal sessions or reusable speaking templates to shape openings, transitions, stories, demos, and closing asks without losing track of your timing.",
    bullets: ["Fast setup for practice sessions", "Fullscreen timer view with progress feedback", "Reusable templates for recurring keynote formats"],
    cta: "Run the speaker timer",
    templateSlug: "keynote-rhythm",
  },
  {
    slug: "classroom-timer",
    title: "Classroom Timer",
    eyebrow: "Structured timing for teachers and facilitators",
    hero: "A classroom timer that makes transitions feel deliberate instead of chaotic.",
    description: "Project large, high-contrast timing cues for work blocks, partner activities, quiet writing, and end-of-class reflection, with clear segment names students can actually follow.",
    bullets: ["Readable from anywhere in the room", "Color-coded phases for independent work and transitions", "Guest mode that works instantly in the browser"],
    cta: "Open the classroom timer",
    templateSlug: "classroom-blocks",
  },
  {
    slug: "workshop-timer",
    title: "Workshop Timer",
    eyebrow: "Facilitation timing for live group sessions",
    hero: "A workshop timer for facilitators who need both flow and authority in the room.",
    description: "Build multi-part sessions with intros, breakouts, debriefs, and Q&A. Repeating interval blocks help you run timeboxed exercises without rebuilding the same structure every week.",
    bullets: ["Interval rounds for breakout cycles", "One-click restart for repeat cohorts", "Template library for recurring workshops"],
    cta: "Launch the workshop timer",
    templateSlug: "workshop-sprint",
  },
  {
    slug: "therapy-session-timer",
    title: "Therapy Session Timer",
    eyebrow: "Calm visual pacing for therapeutic sessions",
    hero: "A therapy session timer designed for structure without bringing workout-app energy into the room.",
    description: "Use calm but visible segment pacing for breathing exercises, guided reflection, grounding work, and close-out windows while keeping the interface discreet and stable.",
    bullets: ["Gentle color shifts instead of aggressive alerts", "Named therapeutic phases for structured flows", "Reusable templates for recurring session formats"],
    cta: "Open the therapy timer",
    templateSlug: "coaching-reset",
  },
  {
    slug: "coaching-session-timer",
    title: "Coaching Session Timer",
    eyebrow: "High-clarity timing for private or group coaching",
    hero: "A coaching session timer that keeps drills, pauses, and reflection windows disciplined.",
    description: "Time practice rounds, reset windows, breathwork, and reflection segments with a timer designed for visible guidance instead of fitness aesthetics.",
    bullets: ["Supports repeated work and rest cycles", "Readable on external displays during group coaching", "Template-driven setup for consistent session delivery"],
    cta: "Run the coaching timer",
    templateSlug: "coaching-reset",
  },
];
