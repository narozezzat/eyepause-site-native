"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { withBasePath } from "@/config/site";

const VIDEOS = {
  en: {
    label: "EN",
    name: "English",
    title: "EyePause tour, narrated in English",
    runtime: "1:43",
    spoken: "1 minute 43 seconds",
  },
  ar: {
    label: "عربي",
    name: "Arabic",
    title: "جولة في EyePause بالعربي",
    runtime: "2:20",
    spoken: "2 minutes 20 seconds",
  },
} as const;
type VideoLang = keyof typeof VIDEOS;

const noSubscribe = () => () => {};
// Arabic-speaking visitors start on the Arabic cut.
const browserLang = (): VideoLang =>
  navigator.language.toLowerCase().startsWith("ar") ? "ar" : "en";

export function PromoVideo() {
  const preferred = useSyncExternalStore(noSubscribe, browserLang, (): VideoLang => "en");
  const [chosen, setChosen] = useState<VideoLang | null>(null);
  const [started, setStarted] = useState(false);
  const lang = chosen ?? preferred;
  const meta = VIDEOS[lang];
  const video = useRef<HTMLVideoElement>(null);
  const resume = useRef(false);
  // A switch while playing keeps playing in the other language.
  useEffect(() => {
    if (!resume.current) return;
    resume.current = false;
    video.current?.play().catch(() => {});
  }, [lang]);
  const choose = (next: VideoLang) => {
    if (next === lang) return;
    resume.current = !!video.current && !video.current.paused;
    setStarted(resume.current);
    setChosen(next);
  };
  const play = () => {
    setStarted(true);
    video.current?.play().catch(() => setStarted(false));
  };
  const file = withBasePath(`/video/eyepause-promo-${lang}`);
  return (
    <div className="promo">
      <div className="promo-bar">
        <div className="promo-switch" role="group" aria-label="Video language" data-lang={lang}>
          {(Object.keys(VIDEOS) as VideoLang[]).map((value) => (
            <button
              key={value}
              type="button"
              lang={value}
              aria-label={VIDEOS[value].name}
              aria-pressed={lang === value}
              onClick={() => choose(value)}
            >
              {VIDEOS[value].label}
            </button>
          ))}
        </div>
        <p className="promo-meta label">
          <span>{meta.runtime}</span>
          <span>Narrated in {meta.name}</span>
          <span>Captioned</span>
        </p>
      </div>
      <figure className="promo-stage">
        <div className="promo-window">
          <div className="promo-titlebar" aria-hidden="true">
            <span className="promo-lights">
              <i />
              <i />
              <i />
            </span>
            <span className="promo-title">EyePause — Tour</span>
            <span className="promo-runtime">{meta.runtime}</span>
          </div>
          <div className="promo-screen">
            <video
              key={lang}
              ref={video}
              src={`${file}.mp4`}
              poster={`${file}.jpg`}
              lang={lang}
              aria-label={meta.title}
              controls={started}
              playsInline
              preload="none"
              onPlay={() => setStarted(true)}
            />
            {!started && (
              <button
                type="button"
                className="promo-play"
                aria-label={`Play the ${meta.name} tour, ${meta.spoken}`}
                onClick={play}
              >
                <span className="promo-play-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" focusable="false">
                    <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.6-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
                  </svg>
                </span>
                <span className="promo-play-label label" aria-hidden="true">
                  Play tour <b>{meta.runtime}</b>
                </span>
              </button>
            )}
          </div>
        </div>
      </figure>
    </div>
  );
}
