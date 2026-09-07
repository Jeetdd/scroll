import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Natinal foods",
  description:
    "Compounded asafoetida. From a single drop of ferula resin to the pinch that finishes your tadka.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spotifyMix.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
