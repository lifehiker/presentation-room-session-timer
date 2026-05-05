import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Compare the free and Pro plans for the Presentation & Room Session Timer.",
};

export default function PricingPage() {
  return (
    <main className="page-shell">
      <section className="mx-auto max-w-5xl text-center">
        <div className="section-kicker text-black/48">Simple pricing</div>
        <h1 className="display-font mt-5 text-5xl uppercase tracking-[0.08em] text-black sm:text-6xl">Free for quick runs. Pro for repeat professionals.</h1>
        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-black/70">
          Use the app instantly in guest mode, then move to Pro when templates, interval authoring, and recurring facilitation become part of your weekly workflow.
        </p>
      </section>

      <section className="mx-auto mt-12 grid max-w-6xl gap-5 lg:grid-cols-2">
        <PricingCard
          title="Free"
          price="$0"
          detail="For one-off sessions and lightweight practice runs."
          items={["Unlimited one-off timer runs", "One saved local template", "Named segments", "Fullscreen room display"]}
          ctaHref="/app"
          ctaLabel="Open free mode"
          secondary
        />
        <PricingCard
          title="Pro"
          price="$4.99/mo"
          detail="$39/year annual option recommended"
          items={["Unlimited templates", "Repeating interval blocks", "Template duplication", "Color themes per segment", "Future billing-ready sync path"]}
          ctaHref="/app?demoPlan=pro"
          ctaLabel="Start Pro demo"
        />
      </section>

      <section className="mx-auto mt-8 max-w-5xl rounded-[2rem] border border-black/10 bg-black px-6 py-8 text-[#f6f0e4] sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
          <div>
            <div className="section-kicker text-[#f6f0e4]/45">Billing note</div>
            <h2 className="display-font mt-4 text-3xl uppercase tracking-[0.08em]">Stripe is intentionally left in demo mode until credentials are supplied.</h2>
          </div>
          <div className="space-y-4 text-sm leading-7 text-[#f6f0e4]/74">
            <p>The app is production-ready as a local-first guest tool today. Real checkout and account-backed sync require the keys documented in the repository root.</p>
            <p>
              Review <code>HUMAN_INPUT_NEEDED.md</code> for the exact values needed. Until then, the Pro flow is represented by a local demo toggle so the complete experience can still
              be tested end to end.
            </p>
            <Link href="/app?demoPlan=pro" className="button-primary">
              Enable Pro demo locally
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function PricingCard({
  title,
  price,
  detail,
  items,
  ctaHref,
  ctaLabel,
  secondary = false,
}: {
  title: string;
  price: string;
  detail: string;
  items: string[];
  ctaHref: string;
  ctaLabel: string;
  secondary?: boolean;
}) {
  return (
    <div className={`rounded-[2rem] border p-6 shadow-card sm:p-8 ${secondary ? "border-black/10 bg-white" : "border-black bg-black text-[#f6f0e4]"}`}>
      <div className={`section-kicker ${secondary ? "text-black/45" : "text-[#f6f0e4]/45"}`}>{title}</div>
      <div className="display-font mt-4 text-5xl uppercase tracking-[0.08em]">{price}</div>
      <p className={`mt-3 text-sm leading-6 ${secondary ? "text-black/68" : "text-[#f6f0e4]/70"}`}>{detail}</p>
      <ul className={`mt-6 space-y-3 text-sm leading-6 ${secondary ? "text-black/72" : "text-[#f6f0e4]/78"}`}>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <Link href={ctaHref} className={`mt-8 ${secondary ? "button-secondary" : "button-primary"}`}>
        {ctaLabel}
      </Link>
    </div>
  );
}
