import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import Preloader from "@/components/Preloader";
import ScrollProgress from "@/components/ScrollProgress";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { siteConfig } from "@/lib/constants";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: `${siteConfig.name} — Software Company in Sharjah, UAE`,
  description: siteConfig.description,
  keywords: [
    "software company Sharjah",
    "software company UAE",
    "web development UAE",
    "app development Sharjah",
    "AI automation UAE",
    "SZEITS",
  ],
  openGraph: {
    title: `${siteConfig.name} — Software Company in Sharjah, UAE`,
    description: siteConfig.description,
    url: "https://szeits.com",
    siteName: siteConfig.name,
    locale: "en_AE",
    type: "website",
  },
  icons: {
    icon: "/logo.jpg",
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
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground overflow-x-hidden">
        <Preloader />
        <SmoothScroll>
          <CustomCursor />
          <ScrollProgress />
          <Navbar />
          {children}
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
