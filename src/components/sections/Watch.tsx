import { PromoVideo } from "./PromoVideo";

/** Interlude between the hero and the story: the narrated tour. Unnumbered, so the beats keep 01–06. */
export function Watch() {
  return (
    <section className="section watch" id="watch" aria-labelledby="watch-title">
      <div className="section-copy watch-copy">
        <p className="label">Interlude — The tour</p>
        <h2 id="watch-title" className="serif">
          <span className="line">See it in two minutes.</span>
        </h2>
        <p>A short tour of every feature, narrated in English or Arabic.</p>
      </div>
      <PromoVideo />
    </section>
  );
}
