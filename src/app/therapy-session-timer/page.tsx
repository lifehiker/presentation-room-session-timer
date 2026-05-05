import type { Metadata } from "next";

import { UseCasePage } from "@/components/use-case-page";
import { useCasePages } from "@/lib/presets";

const copy = useCasePages.find((page) => page.slug === "therapy-session-timer")!;

export const metadata: Metadata = {
  title: "Therapy Session Timer",
  description: copy.description,
};

export default function TherapySessionTimerPage() {
  return <UseCasePage copy={copy} />;
}
