import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page-shell">
      <div className="editorial-panel mx-auto max-w-3xl text-center">
        <div className="section-kicker text-black/45">Not found</div>
        <h1 className="display-font mt-4 text-5xl uppercase tracking-[0.08em] text-black">This session page does not exist.</h1>
        <p className="mt-4 text-base leading-7 text-black/68">Use the main studio to build a new timer session or jump back to the homepage.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/" className="button-secondary">
            Home
          </Link>
          <Link href="/app" className="button-primary">
            Open studio
          </Link>
        </div>
      </div>
    </main>
  );
}
