import type { Metadata } from "next";
import { Suspense } from "react";

import { SessionStudio } from "@/components/session-studio";

export const metadata: Metadata = {
  title: "Timer Studio",
  description: "Build named sessions, launch a fullscreen timer, and save local templates for recurring live facilitation.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AppPage() {
  return (
    <Suspense
      fallback={
        <main className="page-shell">
          <div className="editorial-panel">Loading studio...</div>
        </main>
      }
    >
      <SessionStudio />
    </Suspense>
  );
}
