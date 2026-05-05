import Link from "next/link";

const nav = [
  { href: "/presentation-timer", label: "Presentation" },
  { href: "/classroom-timer", label: "Classroom" },
  { href: "/workshop-timer", label: "Workshop" },
  { href: "/pricing", label: "Pricing" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-[rgba(244,239,228,0.82)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-black text-[0.72rem] font-semibold uppercase tracking-signal text-[#f6f0e4]">
            PRS
          </span>
          <div>
            <div className="display-font text-lg uppercase leading-none tracking-[0.14em] text-black">Room Timer</div>
            <div className="text-xs uppercase tracking-signal text-black/55">Editorial control for live sessions</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-5 text-sm font-medium text-black/70 md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-black">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/app" className="button-secondary hidden sm:inline-flex">
            Open Studio
          </Link>
          <Link href="/app" className="button-primary">
            Launch Timer
          </Link>
        </div>
      </div>
    </header>
  );
}
