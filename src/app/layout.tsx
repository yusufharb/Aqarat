import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "عقار إكزت | منصة التنازل العقاري بدون أوفر",
    template: "%s | عقار إكزت",
  },
  description:
    "منصة رقمية لتسهيل التنازل عن وحدات التقسيط العقاري. للبائع المتعثر والمشتري الباحث عن سعر التعاقد القديم.",
  keywords: ["عقارات", "تنازل", "تقسيط", "مصر", "بدون أوفر", "عقار إكزت"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
