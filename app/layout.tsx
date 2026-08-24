import type { Metadata, Viewport } from "next";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";
import { pointFont, pretendard } from "@/lib/fonts";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "오늘 뭐 입었지?",
  description: "매일의 착장을 기록하는 개인 옷장 로그",
  openGraph: {
    title: "오늘 뭐 입었지?",
    description: "매일의 착장을 기록하는 개인 옷장 로그",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "오늘 뭐 입었지?",
    description: "매일의 착장을 기록하는 개인 옷장 로그",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${pretendard.variable} ${pointFont.variable} font-sans antialiased bg-background`}
      >
        <div className="mx-auto min-h-screen w-full max-w-md">
          {children}
          <Toaster />
        </div>
      </body>
    </html>
  );
}
