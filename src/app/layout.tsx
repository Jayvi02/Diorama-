import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter, Special_Elite } from "next/font/google";
import Cursor from "@/components/Cursor";
import Loader from "@/components/Loader";
import SmoothScroll from "@/components/SmoothScroll";
import { coverImage, project } from "@/data/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  weight: "400",
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
  themeColor: "#050608",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${bebas.variable} ${typewriter.variable} antialiased`}
    >
      <body className="grain min-h-screen font-sans">
        {/* SmoothScroll must come before Loader so the loader can pause scrolling */}
        <SmoothScroll />
        <Loader />
        <Cursor />
        {children}
      </body>
    </html>
  );
}
