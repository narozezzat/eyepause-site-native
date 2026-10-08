import { Footer } from "@/components/layout/Footer";
import { MotionRuntime } from "@/components/motion/MotionRuntime";
import { Header } from "@/components/layout/Header";
import { Features } from "@/components/sections/Features";
import { Hero } from "@/components/sections/Hero";
import { Specs } from "@/components/sections/Specs";
import { Tour } from "@/components/sections/Tour";
import { Watch } from "@/components/sections/Watch";
import { Download } from "@/components/sections/Download";
import { getDownloads } from "@/lib/releases";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main" tabIndex={-1}>
        <div className="wrap">
          <Hero />
          <Watch />
          <Tour />
        </div>
        <Features />
        <div className="wrap">
          <Specs />
          <Download options={getDownloads()} />
        </div>
      </main>
      <Footer />
      {/* Lives with the page, not the layout, so it runs after the page (behind
          loading.tsx) has hydrated and never rewrites text React still owns. */}
      <MotionRuntime />
    </>
  );
}
