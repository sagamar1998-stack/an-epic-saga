import type { Metadata, Viewport } from "next";
import { Patrick_Hand, Permanent_Marker } from "next/font/google";
import "./globals.css";

const marker = Permanent_Marker({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-marker-family",
  display: "swap",
});

const hand = Patrick_Hand({
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
  themeColor: "#f3e6c0",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${marker.variable} ${hand.variable} h-full antialiased`}
    >
      <body className="paper min-h-full">{children}</body>
    </html>
  );
}
