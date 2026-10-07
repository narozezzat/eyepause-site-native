import type { ReactNode } from "react";
import styles from "./sections.module.css";

const features: { title: string; body: ReactNode }[] = [
  { title: "Runs 100% on your Mac", body: "Never connects to the internet. No account, no tracking." },
  { title: "Wellness nudges", body: "Blink, posture, water and stand reminders. Off by default." },
  { title: "Global shortcuts", body: "Your own keys for Pause, Break Now and Skip." },
  {
    title: "Automation",
    body: (
      <>
        Shortcuts and Raycast via <code>eyepause://break</code>
      </>
    ),
  },
  { title: "Pause for…", body: "15 min, 30 min, 1 hour, or until tomorrow." },
  { title: "Lightweight", body: "Near-zero CPU while idle. Native SwiftUI." },
];

export function Features() {
  return (
    <section className={styles.feat} id="features" aria-labelledby="feat-h">
      <h2 id="feat-h">Small, and complete</h2>
      <ul className={styles.fgrid}>
        {features.map((f) => (
          <li key={f.title}>
            <h3>{f.title}</h3>
            <p>{f.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
