import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://presentation-room-session-timer.example.com"),
  title: "Presentation Timer - Large Display Session Timer for Presenters, Teachers, and Coaches",
  description:
    "Run clear, full-screen timed sessions with named segments, color phase changes, and reusable templates. Built for presentations, classrooms, workshops, coaching, and facilitation.",
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#141310",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
