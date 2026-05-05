import Link from "next/link";

import { TimerFace } from "@/components/timer-face";
import { featuredTemplates, type UseCaseCopy } from "@/lib/presets";
import { expandSession, sessionDuration } from "@/lib/session";

export function UseCasePage({ copy }: { copy: UseCaseCopy }) {
  const template = featuredTemplates.find((entry) => entry.slug === copy.templateSlug) ?? featuredTemplates[0];
  const expanded = expandSession(template.session.items);
  const current = expanded[0];

  return (
    <main className="page-shell">
      <section className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
        <div>
          <p className="section-kicker text-black/55">{copy.eyebrow}</p>
          <h1 className="display-font mt-5 max-w-4xl text-5xl uppercase leading-[0.92] tracking-[0.06em] text-black sm:text-6xl lg:text-7xl">
            {copy.title}
          </h1>
          <p className="mt-6 max-w-3xl text-xl leading-relaxed text-black/72">{copy.hero}</p>
          <p className="mt-6 max-w-2xl text-base leading-7 text-black/66">{copy.description}</p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link href={`/app?template=${copy.templateSlug}`} className="button-primary">
              {copy.cta}
            </Link>
            <Link href="/pricing" className="button-secondary">
              See Pro features
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {copy.bullets.map((bullet) => (
              <div key={bullet} className="editorial-panel bg-black text-[#f6f0e4]">
                <div className="text-xs uppercase tracking-signal text-[#f6f0e4]/48">Built for live delivery</div>
                <p className="mt-3 text-sm leading-6 text-[#f6f0e4]/82">{bullet}</p>
              </div>
            ))}
          </div>
        </div>

        <TimerFace
          currentSegment={current}
          remainingSeconds={current?.durationSeconds ?? 0}
          totalSeconds={sessionDuration(template.session.items)}
          progress={0.18}
          sessionTitle={template.session.title}
          sessionSubtitle={template.summary}
          playing
          currentIndex={0}
          totalSegments={expanded.length}
        />
      </section>
    </main>
  );
}
