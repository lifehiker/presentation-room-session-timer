import Link from "next/link";

import { TimerFace } from "@/components/timer-face";
import { featuredTemplates, useCasePages } from "@/lib/presets";
import { expandSession, formatCompactDuration, sessionDuration, segmentCount } from "@/lib/session";

export default function HomePage() {
  const featured = featuredTemplates[1];
  const expanded = expandSession(featured.session.items);
  const current = expanded[0];

  return (
    <main>
      <section className="page-shell grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
        <div>
          <div className="section-kicker text-black/52">Presentation timer • workshop timer • classroom timer</div>
          <h1 className="display-font mt-5 max-w-5xl text-6xl uppercase leading-[0.9] tracking-[0.06em] text-black sm:text-7xl lg:text-[6.5rem]">
            Room-scale timing for live sessions that need visible control.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-black/72">
            Built for presenters, teachers, facilitators, coaches, and therapists who need more than a single countdown. Name each phase, shift color by segment,
            expand interval blocks, and run the whole session fullscreen from one studio.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/app" className="button-primary">
              Launch Timer Studio
            </Link>
            <Link href="/presentation-timer" className="button-secondary">
              Explore Use Cases
            </Link>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            <StatCard label="Reusable templates" value="1 free / unlimited Pro" />
            <StatCard label="Auto-expanded rounds" value="Work / rest intervals" />
            <StatCard label="Room readability" value="Fullscreen digits" />
          </div>
        </div>

        <TimerFace
          currentSegment={current}
          remainingSeconds={current?.durationSeconds ?? 0}
          totalSeconds={sessionDuration(featured.session.items)}
          progress={0.26}
          sessionTitle={featured.session.title}
          sessionSubtitle={featured.summary}
          playing
          currentIndex={0}
          totalSegments={expanded.length}
        />
      </section>

      <section className="page-shell pt-0">
        <div className="editorial-panel bg-black text-[#f6f0e4]">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
            <div>
              <div className="section-kicker text-[#f6f0e4]/45">Why it feels different</div>
              <h2 className="display-font mt-4 text-4xl uppercase tracking-[0.08em]">An editorial control room, not a generic timer tab.</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <FeaturePanel title="Named phases" copy="Run openings, breakouts, debriefs, and closing windows without juggling notes." />
              <FeaturePanel title="Visual warnings" copy="Color shifts and final-warning states keep timing obvious without clutter." />
              <FeaturePanel title="Template rhythm" copy="Save recurring workshop or classroom structures instead of rebuilding them every time." />
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell pt-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="section-kicker text-black/48">Featured templates</div>
            <h2 className="display-font mt-4 text-4xl uppercase tracking-[0.08em] text-black">Built for real facilitation patterns</h2>
          </div>
          <Link href="/app" className="button-secondary">
            Open studio
          </Link>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-4">
          {featuredTemplates.map((template) => (
            <Link key={template.slug} href={`/templates/${template.slug}`} className="editorial-panel transition hover:-translate-y-1">
              <div className="section-kicker text-black/45">{formatCompactDuration(sessionDuration(template.session.items))}</div>
              <h3 className="display-font mt-4 text-2xl uppercase tracking-[0.08em] text-black">{template.session.title}</h3>
              <p className="mt-3 text-sm leading-6 text-black/68">{template.summary}</p>
              <div className="mt-4 text-xs uppercase tracking-signal text-black/40">{segmentCount(template.session.items)} phases</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="page-shell pt-0">
        <div className="section-kicker text-black/48">Use cases</div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {useCasePages.map((page) => (
            <Link key={page.slug} href={`/${page.slug}`} className="editorial-panel transition hover:-translate-y-1">
              <div className="section-kicker text-black/42">{page.eyebrow}</div>
              <h3 className="display-font mt-4 text-3xl uppercase tracking-[0.08em] text-black">{page.title}</h3>
              <p className="mt-3 text-sm leading-6 text-black/68">{page.hero}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="editorial-panel">
      <div className="text-[0.64rem] uppercase tracking-signal text-black/38">{label}</div>
      <div className="display-font mt-3 text-2xl uppercase tracking-[0.08em] text-black">{value}</div>
    </div>
  );
}

function FeaturePanel({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-5">
      <div className="display-font text-2xl uppercase tracking-[0.08em]">{title}</div>
      <p className="mt-3 text-sm leading-6 text-[#f6f0e4]/70">{copy}</p>
    </div>
  );
}
