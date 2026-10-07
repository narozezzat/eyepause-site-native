import type { Metadata } from "next";
import { BrandMark } from "@/components/brand/BrandMark";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { withBasePath } from "@/config/site";
import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: "Page not found · EyePause",
};

export default function NotFound() {
  const home = withBasePath("/");
  return (
    <div className="wrap">
      <Header home={home} />
      <main id="main" tabIndex={-1} className={styles.main}>
        <BrandMark size="large" />
        <p className={styles.code}>404</p>
        <h1>Look 20 feet away. This page isn&apos;t there either.</h1>
        <p className={styles.lede}>The link may be old or mistyped.</p>
        <a className={styles.home} href={home}>
          Back to EyePause
        </a>
      </main>
      <Footer />
    </div>
  );
}
