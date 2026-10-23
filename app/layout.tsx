import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "오늘 기분 기록기",
  description: "하루 한 번, 오늘의 기분을 기록하세요",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
