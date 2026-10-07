import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Splash } from "@/components/brand/Splash";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { site } from "@/config/site";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
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
    { media: "(prefers-color-scheme: light)", color: "#fbfcfd" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0d10" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <a
            className="fixed top-3 left-3 z-20 inline-flex min-h-11 -translate-y-[200%] items-center rounded-control bg-fg px-4 font-semibold text-bg no-underline focus-visible:translate-y-0"
            href="#main"
          >
            Skip to content
          </a>
          <Splash />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
