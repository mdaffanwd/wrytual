import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider/theme-provider";
import AuthProvider from "@/components/session-provider/session-provider";
import Header from "@/components/layout/Header";
import { Analytics } from '@vercel/analytics/next';
import Script from "next/script";
import Head from "next/head";


export const metadata: Metadata = {
  title: "Wrytual - Developer Learning Journal",
  description: "Wrytual helps developers log daily learnings, track growth, and reflect on their coding journey. Write more, grow faster.",
  keywords: ["Developer Journal", "Learning Tracker", "Code Journal", "Daily Dev Logs", "Wrytual", "Programming Journal"],
  authors: [
    { name: "Mohammad Affan", url: "https://mdaffanworks.vercel.app" },
    { name: "Fazil Shaik", url: "https://fazil-portfolio-remastered.vercel.app" }
  ],
  creator: "Mohammad Affan & Fazil Shaik",
  openGraph: {
    title: "Wrytual - Developer Learning Journal",
    description: "A personal space for developers to document what they learn daily and track their growth over time.",
    url: "https://wrytual.vercel.app",
    siteName: "Wrytual",
    locale: "en",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wrytual - Developer Learning Journal",
    description: "Document your dev journey, one entry at a time. Built for focused and intentional learning.",
    creator: "@mdaffan_codes",
  },
  metadataBase: new URL("https://wrytual.vercel.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <meta name="google-site-verification" content="SWZ6hdAyL-XIlsJ-LJaqDSq-WT7o4Thyr1e2NtwLTcE" />
      </Head>
      <body
        className={`min-h-screen`}
      >
        {/* 🔥 Ahrefs Analytics Script */}
        <Script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="rNWZYLcud82ZyTRq9lFOpw"
          strategy="afterInteractive"
          async
        />
        <AuthProvider>
          <ThemeProvider>
            <Header />
            {children}
            <Analytics />
            {/* 🔥 Google Tag Manager */}
            <Script id="json-ld" type="application/ld+json" strategy="afterInteractive">
              {JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "Wrytual",
                url: "https://wrytual.vercel.app",
                author: {
                  "@type": "Person",
                  name: "Mohammad Affan",
                  url: "https://mdaffanworks.vercel.app"
                },
                description:
                  "Wrytual helps developers log daily learnings, track growth, and reflect on their coding journey.",
              })}
            </Script>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
