"use client";

import { useCountdown } from "@/hooks/useCountdown";
import styles from "./tour.module.css";

/* Mock-ups of the real app's screens for the tour. All decorative: each is a single role="img". */

const BREAK_RING = 326.7;

export function BreakScreen({ active }: { active: boolean }) {
  const [b, ref] = useCountdown<HTMLDivElement>(20, 20, active);
  return (
    <div ref={ref} className={styles.screen} role="img" aria-label="Floating break card counting down 20 seconds">
      <div className={styles.card}>
        <span className={styles.chip}>MICRO BREAK</span>
        <div className={styles.bring}>
          <svg viewBox="0 0 120 120" fill="none">
            <circle cx="60" cy="60" r="52" stroke="var(--line)" strokeWidth="5" />
            <circle
              className={styles.bringProgress}
              cx="60"
              cy="60"
              r="52"
              stroke="var(--accent)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={BREAK_RING}
              strokeDashoffset={BREAK_RING * (1 - b / 20)}
              transform="rotate(-90 60 60)"
            />
          </svg>
          <b>00:{String(b).padStart(2, "0")}</b>
        </div>
        <h4>Look away from your screen</h4>
        <p>Focus on an object at least 20 feet (6m) away.</p>
        <p>Blink slowly to lubricate your eyes.</p>
        <div className={styles.acts}>
          <span>Skip</span>
          <span>Snooze</span>
          <span className={styles.done}>I&apos;m Done</span>
        </div>
        <div className={styles.hint}>Exit Break (Esc)</div>
      </div>
    </div>
  );
}

export function HeadsUpScreen() {
  return (
    <div
      className={styles.screen}
      role="img"
      aria-label="Heads-up toast under the menu bar: break in 30 seconds, Postpone 5 min"
    >
      <div className={styles.mbar} />
      <div className={styles.toast}>
        <svg viewBox="0 0 30 30" fill="none">
          <circle cx="15" cy="15" r="12" stroke="var(--line)" strokeWidth="3" />
          <circle
            cx="15"
            cy="15"
            r="12"
            stroke="var(--accent)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="75.4"
            strokeDashoffset="37.7"
            transform="rotate(-90 15 15)"
          />
        </svg>
        <span>
          <b>Break in 30s</b>
          <small>Micro break · 20 sec</small>
        </span>
        <em>Postpone 5 min</em>
      </div>
      <div className={styles.ghost}>
        {[80, 100, 60, 90, 40].map((w, i) => (
          <i key={i} style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
  );
}

/** [bar height %, completed, skipped] for Mon–Sun. */
const week: [number, number, number][] = [
  [82, 16, 2],
  [86, 18, 1],
  [82, 14, 4],
  [91, 19, 1],
  [86, 17, 2],
  [32, 6, 1],
  [91, 18, 2],
];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
/** 26 weeks × 7 days of activity levels (0–3), column-major like the app's heatmap. */
const heat =
  "11032210002213301221131301103331311111333331032132211121033231012313321222122111133000231223231131021332111232132110303113223101112001301331011113323323301212111221120102113311000000";
const heatClass = ["", styles.l1, styles.l2, styles.l3];

export function StatisticsScreen() {
  return (
    <div
      className={styles.win}
      role="img"
      aria-label="EyePause Statistics window: 18 breaks completed, 2 skipped, 90 percent completion, weekly chart and yearly heatmap"
    >
      <div className={styles.tb}>
        <i />
        <i />
        <i />
        <span>EyePause Statistics</span>
      </div>
      <div className={styles.wb}>
        <div className={styles.sgrid}>
          <div className={styles.sc}>
            <b>18</b>
            <span>Breaks Completed</span>
          </div>
          <div className={styles.sc}>
            <b>2</b>
            <span>Breaks Skipped</span>
          </div>
          <div className={styles.sc}>
            <b>90%</b>
            <span>Completion Rate</span>
          </div>
          <div className={styles.sc}>
            <b>6h 40m</b>
            <span>Screen Time</span>
          </div>
        </div>
        <div className={styles.chart}>
          {week.map(([h, c, k], i) => (
            <div key={days[i]} style={{ height: `${h}%` }}>
              <span className={styles.c} style={{ flex: c }} />
              <span className={styles.k} style={{ flex: k }} />
            </div>
          ))}
        </div>
        <div className={styles.cl}>
          {days.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
        <div className={styles.legend}>
          <span>
            <i className={styles.c} />
            Completed
          </span>
          <span>
            <i className={styles.k} />
            Skipped
          </span>
          <span className={styles.streak}>Current Streak · 12 days</span>
        </div>
        <div className={styles.heat}>
          {Array.from(heat, (level, i) => (
            <i key={i} className={heatClass[Number(level)]} />
          ))}
        </div>
      </div>
    </div>
  );
}

const presets = [
  { name: "20-20-20", detail: "20m · 20s · 5m", on: true },
  { name: "Pomodoro", detail: "25m · 5m · 15m", on: false },
  { name: "Deep work", detail: "50m · 10m · 20m", on: false },
];

const toggles = [
  { label: "Heads-up before break", detail: "30 seconds", on: true },
  { label: "Only Remind During Work Hours", detail: "Mon–Fri · 9:00–18:00", on: true },
  { label: "Delay breaks during calls", on: true },
  { label: "Strict Mode", on: false },
];

export function SettingsScreen() {
  return (
    <div className={styles.win} role="img" aria-label="Settings window, Schedule tab, with presets and toggles">
      <div className={styles.tb}>
        <i />
        <i />
        <i />
        <span>Settings</span>
      </div>
      <div className={styles.set}>
        <div className={styles.side}>
          {["General", "Schedule", "Behavior", "Appearance", "Audio", "About"].map((s) => (
            <span key={s} className={s === "Schedule" ? styles.on : undefined}>
              {s}
            </span>
          ))}
        </div>
        <div className={styles.pane}>
          <h5>Preset</h5>
          <div className={styles.presets}>
            {presets.map((p) => (
              <div key={p.name} className={p.on ? styles.on : undefined}>
                <b>{p.name}</b>
                {p.detail}
              </div>
            ))}
          </div>
          {toggles.map((t) => (
            <div key={t.label} className={styles.optRow}>
              <span>
                {t.label}
                {t.detail && <small>{t.detail}</small>}
              </span>
              <i className={t.on ? `${styles.sw} ${styles.swOn}` : styles.sw} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const statuses = [
  { title: "Idle", detail: "No keyboard or mouse for 5 minutes", chip: "PAUSED" },
  { title: "Locked · Asleep", detail: "Screen locked or lid closed", chip: "PAUSED" },
  { title: "Waiting: On a call", detail: "Microphone or camera in use", chip: "WAITING" },
  { title: "Waiting: Full screen", detail: "Keynote in front, up to 10 min", chip: "WAITING" },
  { title: "Off Hours", detail: "Outside your work hours", chip: "OFF" },
];

export function SmartPauseScreen() {
  return (
    <div className={styles.win} role="img" aria-label="Popover status chips: Idle, Locked, Waiting on a call, Off Hours">
      <div className={styles.tb}>
        <i />
        <i />
        <i />
        <span>Status</span>
      </div>
      <div className={`${styles.wb} ${styles.statusList}`}>
        {statuses.map((s) => (
          <div key={s.title} className={styles.optRow}>
            <span>
              <b>{s.title}</b>
              <small>{s.detail}</small>
            </span>
            <span className={styles.chip}>{s.chip}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
