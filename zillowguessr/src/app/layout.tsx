import type { Metadata } from "next";
import { Lexend_Exa } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/app.css";
import "../styles/skeleton.css";
import "../styles/main.css";
import HouseBackground from "@/components/HouseBackground";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { cn } from "@/lib/utils";

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
    <html lang="en" suppressHydrationWarning>
      <body className={`${lexendExa.variable} antialiased relative`}>
        <ThemeProvider>
          <AnimatedGridPattern
            numSquares={30}
            maxOpacity={0.1}
            duration={3}
            repeatDelay={1}
            className={cn("fixed inset-0 -z-10 w-screen h-screen")}
            style={{ position: "fixed" }}
          />
          <HouseBackground
            zIndex={0}
            minSize={10}
            maxSize={1200}
            minSpeed={8}
            maxSpeed={50}
          />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
