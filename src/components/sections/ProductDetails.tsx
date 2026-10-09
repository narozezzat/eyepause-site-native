import type { ReactNode } from "react";
import { Moon, Settings2 } from "lucide-react";
import { BreakScreen, SettingsScreen, SmartPauseScreen } from "./TourScreens";

type Row = { icon: ReactNode; title: string; body: string; description: string; screen: () => ReactNode };

const rows: Row[] = [
  {
    icon: <Moon aria-hidden="true" />,
    title: "Away from your Mac? So is the timer.",
    body: "Smart pause follows idle time, sleep, and screen lock. Your break schedule waits for you.",
    description: "Status popover: idle and locked or asleep are paused; calls and full screen are waiting; off hours are off.",
    screen: () => <SmartPauseScreen />,
  },
  {
    icon: <svg aria-hidden="true"><use href="#eye" /></svg>,
    title: "A change of focus.",
    body: "Guided eye exercises bring a little variety to your breaks, from gentle blinking to near-and-far focus.",
    description: "A floating 20-second break card guides you to look 20 feet away and blink slowly.",
    screen: () => <BreakScreen active />,
  },
  {
    icon: <Settings2 aria-hidden="true" />,
    title: "Make yourself comfortable.",
    body: "Adjust your schedule, choose your sounds, and launch at login. Set it once; let EyePause keep time.",
    description: "Settings: the 20-20-20 preset is selected. Heads-up, work hours, and delaying breaks during calls are on; Strict Mode is off.",
    screen: () => <SettingsScreen />,
  },
];

/** Beat 04. Rows describe decorative sticky screens; phones show screens inline. */
export function ProductDetails() {
  return (
    <section className="product" id="product" aria-labelledby="product-title">
      <div className="wrap grid-12">
        <header className="product-intro">
          <p className="label">04 — The details</p>
          <h2 id="product-title">
            <span className="line">Thoughtful about</span>
            <span className="line serif accent-line">your time.</span>
          </h2>
          <p>The useful details, right where you expect them.</p>
        </header>
        <ol className="product-rows">
          {rows.map((row, i) => (
            <li key={row.title} className="product-row" data-row={i}>
              {row.icon}
              <div>
                <h3>{row.title}</h3>
                <p>{row.body}</p>
                <p className="product-description">{row.description}</p>
              </div>
              <div className="product-inline">{row.screen()}</div>
            </li>
          ))}
        </ol>
        <div className="product-stage" data-active="0" aria-hidden="true">
          {rows.map((row, i) => (
            <div key={row.title} className="product-shot" data-shot={i}>
              {row.screen()}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
