import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Features } from "@/components/sections/Features";
import { Hero } from "@/components/sections/Hero";
import { Specs } from "@/components/sections/Specs";
import { Tour } from "@/components/sections/Tour";
import { getDownloads } from "@/lib/releases";

export default async function Home() {
  const options = await getDownloads();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
      <Header />
      <main id="main" tabIndex={-1}>
        <Hero options={options} />
        <Specs />
        <Tour />
        <Features />
      </main>
      <Footer />
    </div>
  );
}
