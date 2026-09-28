import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Bastien Metayer - Développeur fullstack",
  description:
    "Portfolio de Bastien Metayer, étudiant en 3e année de Bachelor CDA. PHP, Laravel, et projets perso en Python.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${display.variable} ${mono.variable}`}>
        <div className="frame">
          <Header />
          <div className="site">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
