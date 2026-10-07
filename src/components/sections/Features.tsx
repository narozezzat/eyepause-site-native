import type { ReactNode } from "react";

const features: { title: string; body: ReactNode }[] = [
  { title: "Runs 100% on your Mac", body: "Never connects to the internet. No account, no tracking." },
  { title: "Wellness nudges", body: "Blink, posture, water and stand reminders. Off by default." },
  { title: "Global shortcuts", body: "Your own keys for Pause, Break Now and Skip." },
  {
    title: "Automation",
    body: (
      <>
        Shortcuts and Raycast via{" "}
        <code className="rounded-[5px] bg-surface-2 px-1.5 py-0.75 font-mono text-xs leading-none whitespace-nowrap">
          eyepause://break
        </code>
      </>
    ),
  },
  { title: "Pause for…", body: "15 min, 30 min, 1 hour, or until tomorrow." },
  { title: "Lightweight", body: "Near-zero CPU while idle. Native SwiftUI." },
];

export function Features() {
  return (
    <section className="border-t border-border py-16 sm:py-20 lg:py-28" id="features" aria-labelledby="feat-h">
      <h2 id="feat-h" className="mb-2 text-title font-semibold tracking-[-0.03em]">
        Small, and complete
      </h2>
      <ul className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-card border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <li key={f.title} className="bg-bg p-5">
            <h3 className="mb-1 text-body font-semibold">{f.title}</h3>
            <p className="text-sm text-fg-muted">{f.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
