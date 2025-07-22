import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider/theme-provider";
import AuthProvider from "@/components/session-provider/session-provider";
import Header from "@/components/layout/Header";
import { Analytics } from '@vercel/analytics/next';


export const metadata: Metadata = {
  title: "Wrytual - Developer Learning Journal",
  description: "Wrytual helps developers log daily learnings, track growth, and reflect on their coding journey. Write more, grow faster.",
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
      <body
        className={`min-h-screen`}
      >
        <AuthProvider>
          <ThemeProvider>
            <Header />
            {children}
            <Analytics />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
