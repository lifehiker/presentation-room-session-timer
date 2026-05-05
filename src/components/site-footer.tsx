import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-black/10 py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 text-sm text-black/60 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <p>Presentation & Room Session Timer. Built for visible pacing in classrooms, workshops, coaching, and speaking.</p>
        <div className="flex flex-wrap gap-4">
          <Link href="/presentation-timer" className="hover:text-black">
            Presentation Timer
          </Link>
          <Link href="/speaker-timer" className="hover:text-black">
            Speaker Timer
          </Link>
          <Link href="/classroom-timer" className="hover:text-black">
            Classroom Timer
          </Link>
          <Link href="/pricing" className="hover:text-black">
            Pricing
          </Link>
        </div>
      </div>
    </footer>
  );
}
