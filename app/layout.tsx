import type { Metadata, Viewport } from "next";
import { Irish_Grover, Just_Me_Again_Down_Here, Permanent_Marker } from "next/font/google";
import "./globals.css";

const title = Irish_Grover({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-title-family",
  display: "swap",
});

const marker = Permanent_Marker({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-marker-family",
  display: "swap",
});

const hand = Just_Me_Again_Down_Here({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-hand-family",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AN EPIC SAGA",
  description: "Saga's personal projects, kept like a hand-painted notebook.",
};

export const viewport: Viewport = {
  themeColor: "#f7f6f3",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${title.variable} ${marker.variable} ${hand.variable} h-full antialiased`}
    >
      <body className="paper min-h-full">{children}</body>
    </html>
  );
}
