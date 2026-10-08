import type { Metadata } from "next";
import { EyeGlyph } from "@/components/brand/EyeGlyph";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { withBasePath } from "@/config/site";

export const metadata: Metadata = {
  title: "Page not found · EyePause",
};

export default function NotFound() {
  const home = withBasePath("/");
  return (
    <div className="flex min-h-dvh flex-col">
      <Header home={home} />
      <main
        id="main"
        tabIndex={-1}
        className="mx-auto grid w-full flex-1 max-w-6xl place-items-center px-4 py-16 sm:px-6 md:py-20 lg:px-8"
      >
        <div className="grid max-w-lg justify-items-center text-center">
          <EyeGlyph className="size-10 text-fg-subtle" strokeWidth={1.6} />
          <p className="mt-6 font-mono text-caption text-fg-subtle tabular-nums">404</p>
          <h1 className="mt-2 text-section font-semibold tracking-[-0.03em] text-balance">
            Look 20 feet away. This page isn&apos;t there either.
          </h1>
          <p className="mt-4 text-lede text-fg-muted text-pretty">The link may be old or mistyped.</p>
          <Button href={home} size="lg" className="mt-8">
            Back to EyePause
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
