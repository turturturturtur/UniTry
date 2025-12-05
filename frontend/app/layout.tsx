import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "UniTry | 智能换衣体验",
  description:
    "UniTry 让用户在浏览器中体验 AI 换装，未来可无缝接入 diffusion 模型。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body className={`${manrope.className} bg-slate-950 text-slate-100`}>
        {children}
      </body>
    </html>
  );
}
