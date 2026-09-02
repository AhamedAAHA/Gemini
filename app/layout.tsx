import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
    default: "BillScope — Find The Money You Don't Owe",
    template: "%s · BillScope",
  },
  description:
    "Upload a medical bill. BillScope scans your statement, highlights inflated CPT rates & duplicate charges, and generates custom dispute letters.",
  keywords: ["medical bill audit", "hospital bill dispute", "CPT code checker", "medical billing errors"],
  openGraph: {
    title: "BillScope — Find The Money You Don't Owe",
    description:
      "Upload a medical bill. BillScope scans your statement, highlights inflated CPT rates & duplicate charges, and generates custom dispute letters.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased dark`}
    >
      <head>
        <meta name="theme-color" content="#020617" />
      </head>
      <body className="min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-200">
        {children}
      </body>
    </html>
  );
}
