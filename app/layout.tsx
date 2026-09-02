import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://billscope.app"),
  title: {
    default: "BillScope — find the money you don't owe",
    template: "%s · BillScope",
  },
  description:
    "Upload a medical bill. BillScope finds the billing errors, shows you the money you don't owe, and drafts the dispute for you.",
  keywords: ["medical bill", "hospital bill", "audit", "billing errors", "dispute letter"],
  openGraph: {
    title: "BillScope — find the money you don't owe",
    description:
      "Upload a medical bill. BillScope finds the billing errors, shows you the money you don't owe, and drafts the dispute for you.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <head>
        <meta name="theme-color" content="#030712" />
      </head>
      <body className="min-h-screen font-display">{children}</body>
    </html>
  );
}
