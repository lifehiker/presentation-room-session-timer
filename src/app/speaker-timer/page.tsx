import type { Metadata } from "next";

import { UseCasePage } from "@/components/use-case-page";
import { useCasePages } from "@/lib/presets";

const copy = useCasePages.find((page) => page.slug === "speaker-timer")!;

export const metadata: Metadata = {
  title: "Speaker Timer",
  description: copy.description,
};

export default function SpeakerTimerPage() {
  return <UseCasePage copy={copy} />;
}
