import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { featuredTemplates } from "@/lib/presets";
import { expandSession, formatCompactDuration, sessionDuration } from "@/lib/session";

type TemplatePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return featuredTemplates.map((template) => ({ slug: template.slug }));
}

export async function generateMetadata({ params }: TemplatePageProps): Promise<Metadata> {
  const { slug } = await params;
  const template = featuredTemplates.find((entry) => entry.slug === slug);

  if (!template) {
    return { title: "Template not found" };
  }

  return {
    title: `${template.session.title} Template`,
    description: template.summary,
  };
}

export default async function TemplatePage({ params }: TemplatePageProps) {
  const { slug } = await params;
  const template = featuredTemplates.find((entry) => entry.slug === slug);
  if (!template) {
    notFound();
  }

  const expanded = expandSession(template.session.items);

  return (
    <main className="page-shell">
      <section className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="editorial-panel bg-black text-[#f6f0e4]">
          <div className="section-kicker text-[#f6f0e4]/45">Example session template</div>
          <h1 className="display-font mt-4 text-5xl uppercase tracking-[0.08em]">{template.session.title}</h1>
          <p className="mt-4 text-base leading-7 text-[#f6f0e4]/74">{template.summary}</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Metric label="Duration" value={formatCompactDuration(sessionDuration(template.session.items))} />
            <Metric label="Phases" value={String(expanded.length)} />
            <Metric label="Use case" value={slug.replaceAll("-", " ")} />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`/app?template=${template.slug}`} className="button-primary">
              Launch this template
            </Link>
            <Link href="/app" className="button-ghost">
              Open timer studio
            </Link>
          </div>
        </div>

        <div className="editorial-panel">
          <div className="section-kicker text-black/45">Expanded timeline</div>
          <div className="mt-5 space-y-3">
            {expanded.map((segment, index) => (
              <div key={segment.id} className="rounded-[1.2rem] border border-black/10 bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-signal text-black/38">Phase {index + 1}</div>
                    <div className="display-font mt-2 text-2xl uppercase tracking-[0.08em] text-black">{segment.name}</div>
                    <div className="mt-2 text-sm text-black/60">{segment.kind}</div>
                  </div>
                  <div className="rounded-full border border-black/10 px-4 py-2 text-sm text-black/65">{formatCompactDuration(segment.durationSeconds)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.2rem] border border-white/10 bg-white/5 px-4 py-4">
      <div className="text-[0.64rem] uppercase tracking-signal text-[#f6f0e4]/45">{label}</div>
      <div className="display-font mt-3 text-2xl uppercase tracking-[0.08em] text-[#f6f0e4]">{value}</div>
    </div>
  );
}
