import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import Preloader from "@/components/Preloader";
import ScrollProgress from "@/components/ScrollProgress";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import BackToTop from "@/components/BackToTop";
import LogoScrollBackdropLoader from "@/components/three/LogoScrollBackdropLoader";
import { siteConfig } from "@/lib/constants";

const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('theme');
    var dark = stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (dark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

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
  title: `${siteConfig.name} — Software Company in Dubai, UAE`,
  description: siteConfig.description,
  keywords: [
    "software company Dubai",
    "software company UAE",
    "web development UAE",
    "app development Dubai",
    "AI automation UAE",
    "SZEITS",
  ],
  openGraph: {
    title: `${siteConfig.name} — Software Company in Dubai, UAE`,
    description: siteConfig.description,
    url: "https://szeits.com",
    siteName: siteConfig.name,
    locale: "en_AE",
    type: "website",
  },
  icons: {
    icon: "/logo.jpeg",
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
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground overflow-x-hidden">
        <LogoScrollBackdropLoader />
        <Preloader />
        <SmoothScroll>
          <CustomCursor />
          <ScrollProgress />
          <Navbar />
          {children}
          <Footer />
          <WhatsAppButton />
          <BackToTop />
        </SmoothScroll>
      </body>
    </html>
  );
}
