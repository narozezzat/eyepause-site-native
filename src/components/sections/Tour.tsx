"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { BreakScreen, HeadsUpScreen, SettingsScreen, SmartPauseScreen, StatisticsScreen } from "./TourScreens";
import styles from "./tour.module.css";

interface TourTab {
  id: string;
  label: string;
  title: string;
  body: string;
  points: string[];
  screen: (active: boolean) => ReactNode;
}

const tabs: TourTab[] = [
  {
    id: "break",
    label: "Break",
    title: "Twenty seconds, on every display",
    body: "A floating card by default, or a full-screen overlay. Long breaks every few cycles ask you to stand up and stretch.",
    points: [
      "Circular timer or flip clock",
      "Guided eye exercises: focus shifts, figure-eight, palming",
      "Strict mode delays or hides Skip; triple-Esc always gets you out",
      "Skip twice in a row and the next break goes full screen",
    ],
    screen: (active) => <BreakScreen active={active} />,
  },
  {
    id: "heads",
    label: "Heads-up",
    title: "Never mid-sentence",
    body: "A quiet toast slides out from under the menu bar before each break, so you can finish the thought.",
    points: ["Lead time you choose", "One click to postpone five minutes", "Or turn it off entirely"],
    screen: () => <HeadsUpScreen />,
  },
  {
    id: "stats",
    label: "Statistics",
    title: "Know how the week went",
    body: "Completed, skipped and snoozed breaks, screen time, your longest session and a daily goal.",
    points: [
      "History for 7, 30, 90 days or the year",
      "Best hours and streaks",
      "Export as CSV or JSON. It stays on your Mac",
    ],
    screen: () => <StatisticsScreen />,
  },
  {
    id: "set",
    label: "Settings",
    title: "Your rhythm, not ours",
    body: "Start from a preset or set work from 5 to 60 minutes. Every change applies mid-session.",
    points: [
      "Launch at Login, countdown beside the icon",
      "Start and end chimes, or your own sound",
      "Follows light and dark, English and Arabic",
    ],
    screen: () => <SettingsScreen />,
  },
  {
    id: "aware",
    label: "Smart pause",
    title: "It knows when to wait",
    body: "Walk away and the timer pauses. Come back and it resumes. A break that's due waits for your call to end.",
    points: ["No Accessibility or Screen Recording permission", "Never resumes a timer you paused yourself"],
    screen: () => <SmartPauseScreen />,
  },
];

/** App tour as an ARIA tablist: arrows and Home/End move between tabs with a roving tab stop. */
export function Tour() {
  const [selected, setSelected] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function select(index: number) {
    const next = (index + tabs.length) % tabs.length;
    setSelected(next);
    refs.current[next]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const keys: Record<string, () => void> = {
      ArrowRight: () => select(selected + 1),
      ArrowLeft: () => select(selected - 1),
      Home: () => select(0),
      End: () => select(tabs.length - 1),
    };
    const action = keys[event.key];
    if (!action) return;
    event.preventDefault();
    action();
  }

  return (
    <section className={styles.tour} id="tour" aria-labelledby="tour-h">
      <h2 id="tour-h">Take the tour</h2>
      <p className={styles.intro}>Five places you&apos;ll meet EyePause. Drawn from the real app, at real copy.</p>
      <div className={styles.tabs} role="tablist" aria-label="App screens" onKeyDown={onKeyDown}>
        {tabs.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`t-${t.id}`}
            aria-controls={`p-${t.id}`}
            aria-selected={i === selected}
            tabIndex={i === selected ? 0 : -1}
            onClick={() => select(i)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t, i) => (
        <div
          key={t.id}
          className={styles.stage}
          role="tabpanel"
          id={`p-${t.id}`}
          aria-labelledby={`t-${t.id}`}
          tabIndex={0}
          hidden={i !== selected}
        >
          {t.screen(i === selected)}
          <div className={styles.cap}>
            <h3>{t.title}</h3>
            <p>{t.body}</p>
            <ul>
              {t.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </section>
  );
}
