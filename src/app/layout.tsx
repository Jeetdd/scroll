import type { Metadata, Viewport } from "next";
import {
  Archivo,
  Corinthia,
  Geist_Mono,
  Edu_QLD_Beginner,
} from "next/font/google";
import localFont from "next/font/local";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import "./globals.css";

/**
 * The page face. One cut only — Black — so nothing here should ask for a
 * weight it hasn't got; `adjustFontFallback` is off because a 900-weight
 * fallback metric would make the swap worse, not better.
 */
const spotifyMix = localFont({
  adjustFontFallback: false,
  display: "swap",
  src: "../../public/SpotifyMix-Black.woff",
  style: "normal",
  variable: "--font-spotify",
  weight: "900",
});

// Kept for the eyebrow labels, where a monospaced grid does work Black can't.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * The editorial face for everything below the pinned scene. SpotifyMix has one
 * cut and the comps below the fold need five weights across a single family —
 * eyebrow, body, stat, pull-quote and headline all sit in the same column and
 * are told apart by weight alone. Loaded as the variable cut, so the whole
 * 100–900 range costs one file rather than five.
 */
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

// One line only — the handwritten caption under the About spread.
const corinthia = Corinthia({
  variable: "--font-corinthia",
  subsets: ["latin"],
  weight: ["400", "700"],
});

// The updated font for the quote in the About section.
const eduQldBeginner = Edu_QLD_Beginner({
  variable: "--font-edu-qld-beginner",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Natinal foods",
  description:
    "Compounded asafoetida. From a single drop of ferula resin to the pinch that finishes your tadka.",
};

// Paints the mobile browser chrome (address bar) to match the page.
export const viewport: Viewport = {
  themeColor: "#f7f3ee",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spotifyMix.variable} ${geistMono.variable} ${archivo.variable} ${corinthia.variable} ${eduQldBeginner.variable} h-full bg-cream antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
