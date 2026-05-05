import type { Metadata } from "next";

import { UseCasePage } from "@/components/use-case-page";
import { useCasePages } from "@/lib/presets";

const copy = useCasePages.find((page) => page.slug === "presentation-timer")!;

export const metadata: Metadata = {
  title: "Presentation Timer",
  description: copy.description,
};

export default function PresentationTimerPage() {
  return <UseCasePage copy={copy} />;
}
