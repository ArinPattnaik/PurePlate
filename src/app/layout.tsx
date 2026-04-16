import type { Metadata } from "next";
import { Inter, Outfit, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-clash-display", // Mapping Outfit to our display variable for ease
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PurePlate | India's Food Transparency Platform",
  description: "Decode the truth behind Indian packaged food. PurePlate algorithmically analyzes ingredients of 120+ Indian FMCG products, exposing hidden chemicals, deceptive sugars, and synthetic additives. Search Maggi, Lay's, Parle-G, Amul and more.",
  keywords: ["food transparency", "Indian FMCG", "ingredient analysis", "INS codes", "food additives", "PurePlate", "packaged food India", "Maggi ingredients", "food chemicals"],
  openGraph: {
    title: "PurePlate — Decode Your Food",
    description: "India's first algorithmic food transparency platform. Search 120+ products to see what's really inside your food.",
    type: "website",
    locale: "en_IN",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <head>
        <meta name="theme-color" content="#1c1a17" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
