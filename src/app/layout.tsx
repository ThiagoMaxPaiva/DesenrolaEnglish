import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Desenrola English — Fluência até 2027",
  description:
    "Aprenda inglês de verdade com prática por voz, tutor de IA e um plano semanal feito pra brasileiros que querem desenrolar no inglês.",
  keywords: ["english", "fluency", "brazilian", "AI tutor", "voice practice"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-black text-gray-200">
        {children}
      </body>
    </html>
  );
}
