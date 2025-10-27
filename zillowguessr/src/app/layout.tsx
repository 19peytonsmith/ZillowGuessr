import type { Metadata } from "next";
import { Lexend_Exa } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/app.css";
import "../styles/skeleton.css";
import HouseBackground from "@/components/HouseBackground";

const lexendExa = Lexend_Exa({
  variable: "--font-lexend-exa",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
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
      <body className={`${lexendExa.variable} antialiased relative`}>
        <HouseBackground
          zIndex={0}
          minSize={10}
          maxSize={1200}
          minSpeed={8}
          maxSpeed={50}
        />
        <main>{children}</main>
      </body>
    </html>
  );
}
