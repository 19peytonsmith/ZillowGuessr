import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/app.css";
import "../styles/skeleton.css";
import ThemeToggle from "../components/ThemeToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZillowGuessr",
  description: "The game where you guess the price of Zillow listings!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Theme toggle lives outside main content so it's always visible */}
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
