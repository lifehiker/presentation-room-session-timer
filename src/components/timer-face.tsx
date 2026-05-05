import type { CSSProperties } from "react";

import clsx from "clsx";

import { formatDuration, themePalettes, type ExpandedSegment } from "@/lib/session";

type TimerFaceProps = {
  currentSegment?: ExpandedSegment;
  remainingSeconds: number;
  totalSeconds: number;
  progress: number;
  sessionTitle: string;
  sessionSubtitle?: string;
  playing: boolean;
  currentIndex: number;
  totalSegments: number;
  fullscreen?: boolean;
};

export function TimerFace({
  currentSegment,
  remainingSeconds,
  totalSeconds,
  progress,
  sessionTitle,
  sessionSubtitle,
  playing,
  currentIndex,
  totalSegments,
  fullscreen = false,
}: TimerFaceProps) {
  const palette = themePalettes[currentSegment?.theme ?? "ink"];
  const isWarning = remainingSeconds <= 10 && remainingSeconds > 0;
  const percent = Math.max(0, Math.min(100, progress * 100));

  return (
    <section
      className={clsx(
        "display-shell relative overflow-hidden rounded-[2rem] border px-5 py-5 shadow-glow transition-all duration-500 sm:px-8 sm:py-8",
        fullscreen ? "min-h-screen rounded-none border-0" : "min-h-[32rem]",
      )}
      style={
        {
          background: isWarning ? themePalettes.signal.wash : palette.wash,
          borderColor: isWarning ? "rgba(255,107,61,0.32)" : "rgba(255,255,255,0.08)",
          boxShadow: isWarning ? "0 0 0 1px rgba(255,107,61,0.28), 0 0 90px rgba(255,107,61,0.22)" : undefined,
        } as CSSProperties
      }
    >
      <div className="absolute inset-0 opacity-20" aria-hidden>
        <div className="absolute -left-20 top-10 h-56 w-56 rounded-full blur-3xl" style={{ backgroundColor: isWarning ? "#ff6b3d" : palette.accent }} />
        <div className="absolute right-0 top-0 h-full w-[42%] bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.1)_100%)]" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_24px,rgba(255,255,255,0.06)_24px,rgba(255,255,255,0.06)_25px)]" />
      </div>

      <div className="relative flex h-full flex-col justify-between gap-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-xl">
            <div className="section-kicker" style={{ color: isWarning ? "#ffb29a" : palette.accent }}>
              {playing ? "Live session" : "Ready state"}
            </div>
            <h2 className="display-font mt-3 text-4xl uppercase leading-none tracking-[0.08em] text-white sm:text-5xl">
              {sessionTitle}
            </h2>
            <p className="mt-3 max-w-lg text-sm text-white/72 sm:text-base">{sessionSubtitle}</p>
          </div>

          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
            Segment {Math.min(currentIndex + 1, Math.max(totalSegments, 1))}/{Math.max(totalSegments, 1)}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_14rem] lg:items-end">
          <div>
            <div className="rounded-[1.6rem] border border-white/10 bg-[rgba(8,8,8,0.18)] px-5 py-4 text-white/72">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-signal text-white/45">Current phase</div>
                  <div className="display-font mt-2 text-2xl uppercase tracking-[0.08em] sm:text-3xl">
                    {currentSegment?.name ?? "Session complete"}
                  </div>
                </div>
                {currentSegment ? (
                  <div className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-signal text-white/55">
                    {currentSegment.kind}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-6">
              <div className="display-font leading-none text-white" style={{ fontSize: "clamp(4.5rem, 14vw, 12rem)" }}>
                {formatDuration(remainingSeconds)}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-white/62">
                <span>{totalSeconds > 0 ? `${formatDuration(totalSeconds)} total` : "Build a session to begin"}</span>
                <span className={clsx("rounded-full px-3 py-1 uppercase tracking-signal", isWarning ? "bg-[#ff6b3d]/15 text-[#ffd6ca]" : "bg-white/6 text-white/55")}>
                  {isWarning ? "Final warning" : playing ? "Running" : "Paused"}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center text-white/70 lg:grid-cols-1">
            <Metric label="Readability" value="Across room" />
            <Metric label="Theme" value={currentSegment?.theme ?? "ink"} />
            <Metric label="Progress" value={`${Math.round(percent)}%`} />
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-signal text-white/40">
            <span>Phase progress</span>
            <span>{Math.round(percent)}%</span>
          </div>
          <div className="h-4 overflow-hidden rounded-full bg-white/8">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${percent}%`,
                background: isWarning ? "linear-gradient(90deg, #ff8b64 0%, #ff5b2f 100%)" : `linear-gradient(90deg, ${palette.accent} 0%, rgba(255,255,255,0.92) 100%)`,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.2rem] border border-white/10 bg-white/5 px-4 py-4">
      <div className="text-[0.64rem] uppercase tracking-signal text-white/40">{label}</div>
      <div className="display-font mt-2 text-lg uppercase tracking-[0.08em] text-white">{value}</div>
    </div>
  );
}
