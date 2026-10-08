import { PromoVideo } from "./PromoVideo";
export function Watch() {
  return (
    <section className="section watch" id="watch">
      <div className="section-copy">
        <h2>See it in two minutes.</h2>
        <p>A short tour of every feature, narrated in English or Arabic.</p>
      </div>
      <PromoVideo />
    </section>
  );
}
