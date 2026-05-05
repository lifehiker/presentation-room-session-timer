import type { PlanTier, SessionDraft, TemplateRecord } from "@/lib/session";

const STORAGE_KEYS = {
  templates: "prs.templates",
  draft: "prs.draft",
  plan: "prs.plan",
};

function read<T>(key: string, fallback: T) {
  if (typeof window === "undefined") {
    return fallback;
  }

  const raw = window.localStorage.getItem(key);
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function loadTemplates() {
  return read<TemplateRecord[]>(STORAGE_KEYS.templates, []);
}

export function saveTemplates(templates: TemplateRecord[]) {
  write(STORAGE_KEYS.templates, templates);
}

export function loadDraft(fallback: SessionDraft) {
  return read<SessionDraft>(STORAGE_KEYS.draft, fallback);
}

export function saveDraft(draft: SessionDraft) {
  write(STORAGE_KEYS.draft, draft);
}

export function loadPlan() {
  return read<PlanTier>(STORAGE_KEYS.plan, "free");
}

export function savePlan(plan: PlanTier) {
  write(STORAGE_KEYS.plan, plan);
}
