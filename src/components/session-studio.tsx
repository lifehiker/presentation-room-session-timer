"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { nanoid } from "nanoid";
import { ArrowLeft, ArrowRight, Copy, Expand, Pause, Play, RotateCcw, Save, Trash2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { TimerFace } from "@/components/timer-face";
import { featuredTemplates } from "@/lib/presets";
import {
  clampOptionalSeconds,
  clampSeconds,
  cloneDraft,
  colorThemeOptions,
  expandSession,
  formatCompactDuration,
  sessionDuration,
  segmentCount,
  type ColorTheme,
  type IntervalItem,
  type PlanTier,
  type SessionDraft,
  type SessionItem,
  type TemplateRecord,
} from "@/lib/session";
import { loadDraft, loadPlan, loadTemplates, saveDraft, savePlan, saveTemplates } from "@/lib/storage";

const FREE_TEMPLATE_LIMIT = 1;

const initialSession = featuredTemplates[1]?.session ?? featuredTemplates[0].session;

function materializeSession(source: SessionDraft): SessionDraft {
  return {
    ...cloneDraft(source),
    id: nanoid(),
    updatedAt: new Date().toISOString(),
    items: source.items.map((item) => ({ ...cloneDraft(item), id: nanoid() })),
  };
}

function createBlankSession(): SessionDraft {
  return {
    id: nanoid(),
    title: "Fresh Room Session",
    subtitle: "Build named segments, launch fullscreen, and keep the room on pace.",
    updatedAt: new Date().toISOString(),
    items: [
      { id: nanoid(), type: "segment", name: "Opening", durationSeconds: 300, theme: "signal" },
      { id: nanoid(), type: "segment", name: "Main section", durationSeconds: 900, theme: "ocean" },
      { id: nanoid(), type: "segment", name: "Close", durationSeconds: 180, theme: "sun" },
    ],
  };
}

type Status = { tone: "info" | "success" | "error"; text: string };

export function SessionStudio() {
  const searchParams = useSearchParams();
  const timerRef = useRef<HTMLDivElement | null>(null);
  const endAtRef = useRef<number | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [status, setStatus] = useState<Status>({ tone: "info", text: "Guest mode is active. Sessions save locally in this browser." });
  const [plan, setPlan] = useState<PlanTier>("free");
  const [templates, setTemplates] = useState<TemplateRecord[]>([]);
  const [draft, setDraft] = useState<SessionDraft>(materializeSession(initialSession));
  const [playbackSession, setPlaybackSession] = useState<SessionDraft>(materializeSession(initialSession));
  const [activeIndex, setActiveIndex] = useState(0);
  const [remainingMs, setRemainingMs] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [newSegment, setNewSegment] = useState({ name: "New segment", minutes: 5, seconds: 0, theme: "signal" as ColorTheme });
  const [newInterval, setNewInterval] = useState({ name: "Interval block", workMinutes: 8, workSeconds: 0, restMinutes: 1, restSeconds: 0, repeats: 3, theme: "moss" as ColorTheme });

  useEffect(() => {
    const fallback = materializeSession(initialSession);
    const storedDraft = loadDraft(fallback);
    const storedTemplates = loadTemplates();
    const storedPlan = loadPlan();
    const initialPlayback = cloneDraft(storedDraft);
    const firstSegment = expandSession(initialPlayback.items)[0];

    setDraft(storedDraft);
    setPlaybackSession(initialPlayback);
    setTemplates(storedTemplates);
    setPlan(storedPlan);
    setActiveIndex(0);
    setRemainingMs(firstSegment ? firstSegment.durationSeconds * 1000 : 0);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    saveDraft(draft);
  }, [draft, hydrated]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    saveTemplates(templates);
  }, [templates, hydrated]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    savePlan(plan);
  }, [plan, hydrated]);

  useEffect(() => {
    const requestedPlan = searchParams.get("demoPlan");
    const requestedTemplate = searchParams.get("template");

    if (requestedPlan === "pro") {
      setPlan("pro");
      setStatus({ tone: "success", text: "Pro demo mode enabled. Interval authoring and unlimited template saving are unlocked locally." });
    }

    if (requestedTemplate) {
      const preset = featuredTemplates.find((entry) => entry.slug === requestedTemplate);
      if (preset) {
        const nextDraft = materializeSession(preset.session);
        setDraft(nextDraft);
        primeSession(nextDraft, false);
        setStatus({ tone: "success", text: `${preset.session.title} loaded into the studio.` });
      }
    }
    // searchParams is stable from Next.js, and the setters are intentional.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const expandedPlayback = useMemo(() => expandSession(playbackSession.items), [playbackSession]);
  const currentSegment = expandedPlayback[activeIndex];
  const currentDurationMs = (currentSegment?.durationSeconds ?? 0) * 1000;
  const displayRemainingSeconds = remainingMs > 0 ? Math.ceil(remainingMs / 1000) : 0;

  useEffect(() => {
    if (!currentSegment && expandedPlayback.length > 0) {
      setActiveIndex(0);
      setRemainingMs(expandedPlayback[0].durationSeconds * 1000);
    }
  }, [currentSegment, expandedPlayback]);

  useEffect(() => {
    if (!playing || !currentSegment) {
      return;
    }

    endAtRef.current = Date.now() + remainingMs;

    const interval = window.setInterval(() => {
      const endAt = endAtRef.current ?? Date.now();
      const nextRemaining = endAt - Date.now();

      if (nextRemaining <= 0) {
        const nextIndex = activeIndex + 1;
        if (nextIndex < expandedPlayback.length) {
          const nextSegment = expandedPlayback[nextIndex];
          setActiveIndex(nextIndex);
          setRemainingMs(nextSegment.durationSeconds * 1000);
          endAtRef.current = Date.now() + nextSegment.durationSeconds * 1000;
        } else {
          setRemainingMs(0);
          setPlaying(false);
          endAtRef.current = null;
          setStatus({ tone: "success", text: "Session complete. You can restart it or load another template." });
        }
        return;
      }

      setRemainingMs(nextRemaining);
    }, 100);

    return () => window.clearInterval(interval);
  }, [activeIndex, currentSegment, expandedPlayback, playing]);

  function primeSession(session: SessionDraft, announce = true) {
    const snapshot = cloneDraft(session);
    const expanded = expandSession(snapshot.items);
    setPlaybackSession(snapshot);
    setPlaying(false);
    endAtRef.current = null;

    if (expanded.length === 0) {
      setActiveIndex(0);
      setRemainingMs(0);
      if (announce) {
        setStatus({ tone: "error", text: "Add at least one segment before launching the timer." });
      }
      return;
    }

    setActiveIndex(0);
    setRemainingMs(expanded[0].durationSeconds * 1000);

    if (announce) {
      setStatus({ tone: "success", text: `Loaded ${snapshot.title} into the live timer.` });
    }
  }

  function handlePlay() {
    if (!expandedPlayback.length) {
      primeSession(draft);
      return;
    }

    if (remainingMs === 0) {
      primeSession(playbackSession, false);
      const first = expandSession(playbackSession.items)[0];
      if (!first) {
        return;
      }
      setRemainingMs(first.durationSeconds * 1000);
    }

    setPlaying(true);
  }

  function handlePause() {
    if (!playing) {
      return;
    }

    const endAt = endAtRef.current;
    if (endAt) {
      setRemainingMs(Math.max(0, endAt - Date.now()));
    }
    setPlaying(false);
    endAtRef.current = null;
  }

  function goToIndex(index: number) {
    const bounded = Math.max(0, Math.min(index, expandedPlayback.length - 1));
    const next = expandedPlayback[bounded];
    if (!next) {
      return;
    }

    setActiveIndex(bounded);
    setRemainingMs(next.durationSeconds * 1000);
    if (playing) {
      endAtRef.current = Date.now() + next.durationSeconds * 1000;
    }
  }

  async function toggleFullscreen() {
    if (!timerRef.current) {
      return;
    }

    try {
      if (!document.fullscreenElement) {
        await timerRef.current.requestFullscreen();
        return;
      }

      await document.exitFullscreen();
    } catch {
      setStatus({ tone: "error", text: "Fullscreen was blocked by the browser. Try using the control after a direct click." });
    }
  }

  function patchDraft(updater: (current: SessionDraft) => SessionDraft) {
    setDraft((current) => ({
      ...updater(current),
      updatedAt: new Date().toISOString(),
    }));
  }

  function addSegment() {
    const durationSeconds = clampSeconds(newSegment.minutes * 60 + newSegment.seconds);
    patchDraft((current) => ({
      ...current,
      items: [
        ...current.items,
        { id: nanoid(), type: "segment", name: newSegment.name.trim() || "Untitled segment", durationSeconds, theme: newSegment.theme },
      ],
    }));
    setStatus({ tone: "success", text: "Segment added to the builder." });
  }

  function addInterval() {
    if (plan === "free") {
      setStatus({ tone: "error", text: "Interval authoring is part of Pro. Enable Pro demo or connect Stripe later to unlock it." });
      return;
    }

    const workSeconds = clampSeconds(newInterval.workMinutes * 60 + newInterval.workSeconds);
    const restSeconds = clampOptionalSeconds(newInterval.restMinutes * 60 + newInterval.restSeconds);

    patchDraft((current) => ({
      ...current,
      items: [
        ...current.items,
        {
          id: nanoid(),
          type: "interval",
          name: newInterval.name.trim() || "Interval block",
          workSeconds,
          restSeconds,
          repeats: Math.max(2, Math.min(12, Math.floor(newInterval.repeats))),
          theme: newInterval.theme,
        },
      ],
    }));
    setStatus({ tone: "success", text: "Interval block added and will expand automatically during playback." });
  }

  function updateItem(itemId: string, updater: (item: SessionItem) => SessionItem) {
    patchDraft((current) => ({
      ...current,
      items: current.items.map((item) => (item.id === itemId ? updater(item) : item)),
    }));
  }

  function moveItem(itemId: string, direction: -1 | 1) {
    patchDraft((current) => {
      const index = current.items.findIndex((item) => item.id === itemId);
      if (index === -1) {
        return current;
      }

      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= current.items.length) {
        return current;
      }

      const items = [...current.items];
      const [item] = items.splice(index, 1);
      items.splice(nextIndex, 0, item);
      return { ...current, items };
    });
  }

  function removeItem(itemId: string) {
    patchDraft((current) => ({
      ...current,
      items: current.items.filter((item) => item.id !== itemId),
    }));
  }

  function saveTemplate() {
    const existingIndex = templates.findIndex((template) => template.id === draft.id);
    const isNew = existingIndex === -1;

    if (plan === "free" && isNew && templates.length >= FREE_TEMPLATE_LIMIT) {
      setStatus({ tone: "error", text: "Free mode includes one saved template. Enable Pro demo to unlock more." });
      return;
    }

    const record: TemplateRecord = {
      ...cloneDraft(draft),
      createdAt: templates[existingIndex]?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      source: "saved",
    };

    if (isNew) {
      setTemplates((current) => [record, ...current]);
    } else {
      setTemplates((current) => current.map((template) => (template.id === record.id ? record : template)));
    }

    setStatus({ tone: "success", text: isNew ? "Template saved locally." : "Template updated." });
  }

  function duplicateTemplate(template: TemplateRecord) {
    if (plan === "free" && templates.length >= FREE_TEMPLATE_LIMIT) {
      setStatus({ tone: "error", text: "Duplicate is a Pro feature once you hit the free saved-template limit." });
      return;
    }

    const copy: TemplateRecord = {
      ...materializeSession(template),
      title: `${template.title} Copy`,
      createdAt: new Date().toISOString(),
      source: "saved",
    };
    setTemplates((current) => [copy, ...current]);
    setStatus({ tone: "success", text: `${template.title} duplicated.` });
  }

  function loadTemplateForEdit(template: SessionDraft) {
    const nextDraft = cloneDraft(template);
    setDraft(nextDraft);
    primeSession(nextDraft, false);
    setStatus({ tone: "success", text: `${template.title} loaded into the builder.` });
  }

  const liveTotalSeconds = sessionDuration(playbackSession.items);
  const builderTotalSeconds = sessionDuration(draft.items);
  const currentProgress = currentDurationMs > 0 ? 1 - remainingMs / currentDurationMs : 1;

  return (
    <main className="page-shell space-y-8">
      <section className="grid gap-5 xl:grid-cols-[24rem_minmax(0,1fr)]">
        <aside className="space-y-5">
          <div className="editorial-panel">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="section-kicker text-black/48">Studio</p>
                <h1 className="display-font mt-3 text-4xl uppercase leading-none tracking-[0.08em] text-black">Session Builder</h1>
              </div>
              <button
                type="button"
                className="button-secondary"
                onClick={() => {
                  const blank = createBlankSession();
                  setDraft(blank);
                  primeSession(blank, false);
                  setStatus({ tone: "success", text: "Blank session loaded." });
                }}
              >
                New
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              <div>
                <label className="small-label" htmlFor="session-title">
                  Session title
                </label>
                <input
                  id="session-title"
                  className="field"
                  value={draft.title}
                  onChange={(event) => patchDraft((current) => ({ ...current, title: event.target.value }))}
                />
              </div>
              <div>
                <label className="small-label" htmlFor="session-subtitle">
                  Session subtitle
                </label>
                <textarea
                  id="session-subtitle"
                  className="field min-h-24"
                  value={draft.subtitle}
                  onChange={(event) => patchDraft((current) => ({ ...current, subtitle: event.target.value }))}
                />
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <SummaryCard label="Builder length" value={formatCompactDuration(builderTotalSeconds)} />
              <SummaryCard label="Playback phases" value={String(segmentCount(draft.items))} />
              <SummaryCard label="Plan" value={plan === "pro" ? "Pro demo" : "Free"} />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" className="button-primary" onClick={() => primeSession(draft)}>
                Load Builder Into Timer
              </button>
              <button type="button" className="button-secondary" onClick={saveTemplate}>
                <Save className="h-4 w-4" />
                Save Template
              </button>
            </div>
          </div>

          <div className="editorial-panel">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="section-kicker text-black/48">Add segment</p>
                <h2 className="display-font mt-3 text-3xl uppercase tracking-[0.08em] text-black">Named block</h2>
              </div>
            </div>
            <div className="mt-5 grid gap-3">
              <input className="field" value={newSegment.name} onChange={(event) => setNewSegment((current) => ({ ...current, name: event.target.value }))} />
              <div className="grid grid-cols-3 gap-3">
                <NumberField label="Minutes" value={newSegment.minutes} onChange={(value) => setNewSegment((current) => ({ ...current, minutes: value }))} />
                <NumberField label="Seconds" value={newSegment.seconds} onChange={(value) => setNewSegment((current) => ({ ...current, seconds: value }))} />
                <ThemeField value={newSegment.theme} onChange={(value) => setNewSegment((current) => ({ ...current, theme: value }))} />
              </div>
              <button type="button" className="button-secondary" onClick={addSegment}>
                Add Segment
              </button>
            </div>
          </div>

          <div className="editorial-panel bg-black text-[#f6f0e4]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="section-kicker text-[#f6f0e4]/50">Add interval</p>
                <h2 className="display-font mt-3 text-3xl uppercase tracking-[0.08em]">Work / Rest</h2>
              </div>
              <button type="button" className="button-ghost" onClick={() => setPlan((current) => (current === "free" ? "pro" : "free"))}>
                {plan === "free" ? "Enable Pro Demo" : "Back To Free"}
              </button>
            </div>

            <div className="mt-5 grid gap-3">
              <input
                className="field field-dark"
                value={newInterval.name}
                onChange={(event) => setNewInterval((current) => ({ ...current, name: event.target.value }))}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.2rem] border border-white/10 bg-white/5 p-4">
                  <div className="small-label text-[#f6f0e4]/50">Work duration</div>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <NumberField label="Minutes" value={newInterval.workMinutes} dark onChange={(value) => setNewInterval((current) => ({ ...current, workMinutes: value }))} />
                    <NumberField label="Seconds" value={newInterval.workSeconds} dark onChange={(value) => setNewInterval((current) => ({ ...current, workSeconds: value }))} />
                  </div>
                </div>
                <div className="rounded-[1.2rem] border border-white/10 bg-white/5 p-4">
                  <div className="small-label text-[#f6f0e4]/50">Rest duration</div>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <NumberField label="Minutes" value={newInterval.restMinutes} dark onChange={(value) => setNewInterval((current) => ({ ...current, restMinutes: value }))} />
                    <NumberField label="Seconds" value={newInterval.restSeconds} dark onChange={(value) => setNewInterval((current) => ({ ...current, restSeconds: value }))} />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <NumberField
                  label="Repeats"
                  value={newInterval.repeats}
                  dark
                  onChange={(value) => setNewInterval((current) => ({ ...current, repeats: value }))}
                />
                <ThemeField value={newInterval.theme} onChange={(value) => setNewInterval((current) => ({ ...current, theme: value }))} dark />
              </div>
              <button type="button" className="button-primary" onClick={addInterval}>
                Add Interval Block
              </button>
            </div>
          </div>
        </aside>

        <div className="space-y-5">
          <div ref={timerRef}>
            <TimerFace
              currentSegment={currentSegment}
              remainingSeconds={displayRemainingSeconds}
              totalSeconds={liveTotalSeconds}
              progress={currentProgress}
              sessionTitle={playbackSession.title}
              sessionSubtitle={playbackSession.subtitle}
              playing={playing}
              currentIndex={activeIndex}
              totalSegments={expandedPlayback.length}
              fullscreen={fullscreen}
            />
          </div>

          <div className="editorial-panel">
            <div className="flex flex-wrap gap-3">
              <button type="button" className="button-primary" onClick={playing ? handlePause : handlePlay}>
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {playing ? "Pause" : "Start / Resume"}
              </button>
              <button type="button" className="button-secondary" onClick={() => goToIndex(activeIndex - 1)} disabled={activeIndex === 0}>
                <ArrowLeft className="h-4 w-4" />
                Previous
              </button>
              <button
                type="button"
                className="button-secondary"
                onClick={() => goToIndex(activeIndex + 1)}
                disabled={activeIndex >= expandedPlayback.length - 1}
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </button>
              <button type="button" className="button-secondary" onClick={() => primeSession(playbackSession, false)}>
                <RotateCcw className="h-4 w-4" />
                Restart
              </button>
              <button type="button" className="button-secondary" onClick={toggleFullscreen}>
                <Expand className="h-4 w-4" />
                {fullscreen ? "Exit fullscreen" : "Fullscreen"}
              </button>
            </div>

            <div className={`status-panel mt-5 ${status.tone === "error" ? "status-panel-error" : status.tone === "success" ? "status-panel-success" : ""}`}>
              {status.text}
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
              <div>
                <div className="section-kicker text-black/48">Builder sequence</div>
                <div className="mt-4 space-y-3">
                  {draft.items.map((item, index) => (
                    <div key={item.id} className="rounded-[1.3rem] border border-black/10 bg-white p-4 shadow-card">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="mb-3 flex items-center gap-3">
                            <span className="tag">{item.type === "segment" ? "Segment" : "Interval"}</span>
                            <span className="text-xs uppercase tracking-signal text-black/35">#{index + 1}</span>
                          </div>

                          <input
                            className="field"
                            value={item.name}
                            onChange={(event) => updateItem(item.id, (current) => ({ ...current, name: event.target.value }))}
                          />

                          {item.type === "segment" ? (
                            <div className="mt-3 grid gap-3 sm:grid-cols-2">
                              <NumberField
                                label="Seconds"
                                value={item.durationSeconds}
                                onChange={(value) =>
                                  updateItem(item.id, (current) => ({
                                    ...(current as SessionItem & { type: "segment" }),
                                    durationSeconds: clampSeconds(value),
                                  }))
                                }
                              />
                              <ThemeField
                                value={item.theme}
                                onChange={(value) =>
                                  updateItem(item.id, (current) => ({
                                    ...(current as SessionItem & { type: "segment" }),
                                    theme: value,
                                  }))
                                }
                              />
                            </div>
                          ) : (
                            <div className="mt-3 grid gap-3 sm:grid-cols-2">
                              <NumberField
                                label="Work seconds"
                                value={item.workSeconds}
                                onChange={(value) =>
                                  updateItem(item.id, (current) => ({
                                    ...(current as IntervalItem),
                                    workSeconds: clampSeconds(value),
                                  }))
                                }
                              />
                              <NumberField
                                label="Rest seconds"
                                value={item.restSeconds}
                                onChange={(value) =>
                                  updateItem(item.id, (current) => ({
                                    ...(current as IntervalItem),
                                    restSeconds: clampOptionalSeconds(value),
                                  }))
                                }
                              />
                              <NumberField
                                label="Repeats"
                                value={item.repeats}
                                onChange={(value) =>
                                  updateItem(item.id, (current) => ({
                                    ...(current as IntervalItem),
                                    repeats: Math.max(2, Math.min(12, value)),
                                  }))
                                }
                              />
                              <ThemeField
                                value={item.theme}
                                onChange={(value) =>
                                  updateItem(item.id, (current) => ({
                                    ...(current as IntervalItem),
                                    theme: value,
                                  }))
                                }
                              />
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <button type="button" className="icon-button" onClick={() => moveItem(item.id, -1)} aria-label="Move item up">
                            <ArrowLeft className="h-4 w-4 rotate-90" />
                          </button>
                          <button type="button" className="icon-button" onClick={() => moveItem(item.id, 1)} aria-label="Move item down">
                            <ArrowRight className="h-4 w-4 rotate-90" />
                          </button>
                          <button type="button" className="icon-button" onClick={() => removeItem(item.id)} aria-label="Delete item">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-[1.4rem] border border-black/10 bg-black p-5 text-[#f6f0e4]">
                  <div className="section-kicker text-[#f6f0e4]/45">Saved templates</div>
                  <div className="mt-4 space-y-3">
                    {templates.length === 0 ? (
                      <p className="text-sm leading-6 text-[#f6f0e4]/66">No local templates saved yet. Free mode includes one template slot. Pro demo removes the cap.</p>
                    ) : (
                      templates.map((template) => (
                        <TemplateCard
                          key={template.id}
                          title={template.title}
                          subtitle={template.subtitle}
                          onEdit={() => loadTemplateForEdit(template)}
                          onRun={() => primeSession(template)}
                          onDuplicate={() => duplicateTemplate(template)}
                          onDelete={() => setTemplates((current) => current.filter((entry) => entry.id !== template.id))}
                        />
                      ))
                    )}
                  </div>
                </div>

                <div className="rounded-[1.4rem] border border-black/10 bg-white p-5">
                  <div className="section-kicker text-black/45">Preset library</div>
                  <div className="mt-4 space-y-3">
                    {featuredTemplates.map((template) => (
                      <TemplateCard
                        key={template.slug}
                        title={template.session.title}
                        subtitle={template.summary}
                        onEdit={() => loadTemplateForEdit(materializeSession(template.session))}
                        onRun={() => primeSession(materializeSession(template.session))}
                        onDuplicate={() => loadTemplateForEdit(materializeSession(template.session))}
                        duplicateLabel="Use preset"
                      />
                    ))}
                  </div>
                </div>

                <div className="editorial-panel">
                  <div className="section-kicker text-black/45">Cloud sync readiness</div>
                  <p className="mt-3 text-sm leading-6 text-black/68">
                    Local guest mode is fully functional now. To enable saved accounts across devices and live billing, wire the credentials listed in{" "}
                    <Link href="/pricing" className="underline decoration-black/20 underline-offset-4">
                      pricing
                    </Link>{" "}
                    and the root <code>HUMAN_INPUT_NEEDED.md</code>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.2rem] border border-black/10 bg-white px-4 py-4">
      <div className="text-[0.64rem] uppercase tracking-signal text-black/38">{label}</div>
      <div className="display-font mt-3 text-2xl uppercase tracking-[0.08em] text-black">{value}</div>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  dark = false,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  dark?: boolean;
}) {
  return (
    <label className="block">
      <span className={`small-label ${dark ? "text-[#f6f0e4]/50" : ""}`}>{label}</span>
      <input
        className={dark ? "field field-dark mt-2" : "field mt-2"}
        inputMode="numeric"
        type="number"
        min={0}
        step={1}
        value={value}
        onChange={(event) => onChange(event.target.value === "" ? 0 : Number(event.target.value))}
      />
    </label>
  );
}

function ThemeField({
  value,
  onChange,
  dark = false,
}: {
  value: ColorTheme;
  onChange: (value: ColorTheme) => void;
  dark?: boolean;
}) {
  return (
    <label className="block">
      <span className={`small-label ${dark ? "text-[#f6f0e4]/50" : ""}`}>Theme</span>
      <select className={dark ? "field field-dark mt-2" : "field mt-2"} value={value} onChange={(event) => onChange(event.target.value as ColorTheme)}>
        {colorThemeOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function TemplateCard({
  title,
  subtitle,
  onEdit,
  onRun,
  onDuplicate,
  onDelete,
  duplicateLabel = "Duplicate",
}: {
  title: string;
  subtitle: string;
  onEdit: () => void;
  onRun: () => void;
  onDuplicate: () => void;
  onDelete?: () => void;
  duplicateLabel?: string;
}) {
  return (
    <div className="rounded-[1.2rem] border border-black/10 bg-[rgba(255,255,255,0.92)] p-4 text-black shadow-card">
      <div className="display-font text-xl uppercase tracking-[0.08em]">{title}</div>
      <p className="mt-2 text-sm leading-6 text-black/68">{subtitle}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className="button-secondary" onClick={onEdit}>
          Edit
        </button>
        <button type="button" className="button-secondary" onClick={onRun}>
          Run
        </button>
        <button type="button" className="button-secondary" onClick={onDuplicate}>
          <Copy className="h-4 w-4" />
          {duplicateLabel}
        </button>
        {onDelete ? (
          <button type="button" className="button-secondary" onClick={onDelete}>
            Delete
          </button>
        ) : null}
      </div>
    </div>
  );
}
