import { Footer } from "@/components/layout/Footer";
import { MotionRuntime } from "@/components/motion/MotionRuntime";
import { Header } from "@/components/layout/Header";
import { ProductDetails } from "@/components/sections/ProductDetails";
import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
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
        </div>
        <Problem />
        <div className="wrap">
          <Tour />
        </div>
        <ProductDetails />
        <div className="wrap">
          <Specs />
        </div>
        <Download options={getDownloads()} />
      </main>
      <Footer />
      {/* Lives with the page, not the layout, so it runs after the page (behind
          loading.tsx) has hydrated and never rewrites text React still owns. */}
      <MotionRuntime />
    </>
  );
}
