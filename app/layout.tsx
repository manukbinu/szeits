import type { Metadata } from "next";
import { Inter, Space_Grotesk, Cairo } from "next/font/google";
import { MotionConfig } from "framer-motion";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import SiteChrome from "@/components/SiteChrome";
import { siteConfig } from "@/lib/constants";
import { en } from "@/lib/i18n/en";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";

const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('theme');
    var dark = stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (dark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

const langInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('locale');
    if (stored === 'ar') {
      document.documentElement.lang = 'ar';
      document.documentElement.dir = 'rtl';
    }
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

const cairo = Cairo({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: `${siteConfig.name} — Software Company in Dubai, UAE`,
  description: en.siteConfig.description,
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
    description: en.siteConfig.description,
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
      dir="ltr"
      className={`${inter.variable} ${spaceGrotesk.variable} ${cairo.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script dangerouslySetInnerHTML={{ __html: langInitScript }} />
      </head>
      <body className="min-h-full flex flex-col text-foreground overflow-x-hidden">
        <LanguageProvider>
          <MotionConfig reducedMotion="user">
            <CustomCursor />
            <SiteChrome>{children}</SiteChrome>
          </MotionConfig>
        </LanguageProvider>
      </body>
    </html>
  );
}
