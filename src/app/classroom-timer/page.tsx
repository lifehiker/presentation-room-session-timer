import type { Metadata } from "next";

import { UseCasePage } from "@/components/use-case-page";
import { useCasePages } from "@/lib/presets";

const copy = useCasePages.find((page) => page.slug === "classroom-timer")!;

export const metadata: Metadata = {
  title: "Classroom Timer",
  description: copy.description,
};

export default function ClassroomTimerPage() {
  return <UseCasePage copy={copy} />;
}
