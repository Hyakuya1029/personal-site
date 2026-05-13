import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackgroundGlow from "@/components/layout/BackgroundGlow";
import ThemeProvider from "@/components/layout/ThemeProvider";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import MusicProvider from "@/components/layout/MusicProvider";
import MusicFloating from "@/components/layout/MusicFloating";

export const metadata: Metadata = {
  title: {
    default: 'Hyakuyaの小站',
    template: '%s - Hyakuyaの小站',
  },
  description: '开发者 Hyakuya 的个人网站 — 记录学习、生活与技术分享',
  authors: [{ name: 'Hyakuya' }],
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    siteName: 'Hyakuyaの小站',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(!t){t=window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'}document.documentElement.classList.toggle('dark',t==='dark')}catch(e){}})()`,
          }}
        />
      </head>
      <body className="antialiased bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen flex flex-col transition-colors">
        <ThemeProvider>
          <MusicProvider>
            <BackgroundGlow />
            <Navbar />
            <AnnouncementBar />
            <div className="flex-1">{children}</div>
            <Footer />
            <MusicFloating />
          </MusicProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}