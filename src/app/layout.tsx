import type { Metadata, Viewport } from "next";
import { Sofia_Sans_Extra_Condensed, Sofia_Sans_Semi_Condensed, Special_Elite } from "next/font/google";
import Loader from "@/components/Loader";
import SmoothScroll from "@/components/SmoothScroll";
import { coverImage, project } from "@/data/site";
import "./globals.css";

// Same families as the Resident Evil Requiem site: Sofia Sans + Special Elite.
const display = Sofia_Sans_Extra_Condensed({
  variable: "--font-display-face",
  weight: ["700", "800", "900"],
  subsets: ["latin"],
});

const body = Sofia_Sans_Semi_Condensed({
  variable: "--font-body",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

const typewriter = Special_Elite({
  variable: "--font-typewriter",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${project.title} — Diorama Case File`,
  description: project.tagline,
  openGraph: {
    title: project.title,
    description: project.tagline,
    images: [coverImage],
  },
};

export const viewport: Viewport = {
  themeColor: "#0d0d0c",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${typewriter.variable} antialiased`}>
      <body className="grain min-h-screen font-sans">
        {/* Shared SVG filters: worn letter edges and wobbly hand-drawn lines */}
        <svg aria-hidden width="0" height="0" className="absolute">
          <filter id="rough-edge">
            <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="3" seed="4" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="3.5" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="rough-line">
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="9" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="4" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>
        {/* SmoothScroll must come before Loader so the loader can pause scrolling */}
        <SmoothScroll />
        <Loader />
        {children}
      </body>
    </html>
  );
}
