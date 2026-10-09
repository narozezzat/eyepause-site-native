import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { NativeIcons } from "@/components/brand/NativeIcons";
import { Splash } from "@/components/brand/Splash";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { SkipLink } from "@/components/ui/SkipLink";
import { site } from "@/config/site";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F6F8FA" },
    { media: "(prefers-color-scheme: dark)", color: "#0E1013" },
  ],
};

/**
 * Hides the hero until its intro starts, so it never flashes in its final
 * state first. Skipped under reduced motion; un-hides after 3s if scripts fail.
 */
const motionBoot = `(function(){var r=document.documentElement;if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;r.dataset.motion="pending";setTimeout(function(){if(r.dataset.motion==="pending")r.dataset.motion="off"},3000)})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionBoot }} />
      </head>
      <body>
        {/* The route streams behind a Suspense boundary; without JS, reveal it and drop the loading fallback.
            The theme layer is used because Tailwind's preflight hides [hidden] with !important in base. */}
        <noscript>
          <style>{`@layer theme{[hidden][id^="S:"]{display:block!important}}.route-loading,.theme-toggle-placeholder{display:none}`}</style>
        </noscript>
        <ThemeProvider>
          <NativeIcons />
          <SkipLink />
          <Splash />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
