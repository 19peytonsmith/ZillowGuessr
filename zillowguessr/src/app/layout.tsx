import type { Metadata } from "next";
import { Lexend_Exa } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/app.css";
import "../styles/skeleton.css";
import HouseBackground from "@/components/HouseBackground";
import Script from "next/dist/client/script";
import { cookies } from "next/dist/server/request/cookies";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("theme")?.value as
    | "light"
    | "dark"
    | undefined;
  const theme = themeCookie ?? "light";

  return (
    <html lang="en" data-theme={theme}>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){
             try{
               var c = document.cookie.match(/(?:^|; )theme=([^;]+)/);
               var t = c ? decodeURIComponent(c[1]) : null;
               if(!t){
                 var m = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                 t = m ? 'dark' : 'light';
               }
               document.documentElement.setAttribute('data-theme', t);
             }catch(e){}
           })();`}
        </Script>
      </head>
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
