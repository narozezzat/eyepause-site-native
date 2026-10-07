import type { Metadata } from "next";
import { BrandMark } from "@/components/brand/BrandMark";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { withBasePath } from "@/config/site";

export const metadata: Metadata = {
  title: "Page not found · EyePause",
};

export default function NotFound() {
  const home = withBasePath("/");
  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
      <Header home={home} />
      <main id="main" tabIndex={-1} className="grid max-w-160 justify-items-start py-16 sm:py-20 lg:py-28">
        <BrandMark size="large" />
        <p className="mt-7 font-mono text-xs leading-none font-medium tracking-[0.08em] text-fg-subtle">404</p>
        <h1 className="mt-3.5 text-title font-semibold tracking-[-0.03em] text-balance">
          Look 20 feet away. This page isn&apos;t there either.
        </h1>
        <p className="mt-3.5 text-lede text-fg-muted">The link may be old or mistyped.</p>
        <a
          className="mt-7 inline-flex min-h-11 items-center rounded-xl bg-accent px-4.5 font-semibold text-accent-fg no-underline hover:brightness-105 focus-visible:outline-offset-3"
          href={home}
        >
          Back to EyePause
        </a>
      </main>
      <Footer />
    </div>
  );
}
