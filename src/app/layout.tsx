import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
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
