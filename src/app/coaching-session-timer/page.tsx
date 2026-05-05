import type { Metadata } from "next";

import { UseCasePage } from "@/components/use-case-page";
import { useCasePages } from "@/lib/presets";

const copy = useCasePages.find((page) => page.slug === "coaching-session-timer")!;

export const metadata: Metadata = {
  title: "Coaching Session Timer",
  description: copy.description,
};

export default function CoachingSessionTimerPage() {
  return <UseCasePage copy={copy} />;
}
