import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import {
  ClerkProvider,
} from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

import dbConnect from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";

export async function generateMetadata(): Promise<Metadata> {
  await dbConnect();
  const settings = await SiteSettings.findOne();

  return {
    title: settings?.siteTitle || "Digital Broker | Premium Real Estate",
    description: settings?.siteDescription || "Find exclusive homes and commercial properties with expert guidance.",
    keywords: settings?.keywords || "Real Estate, Noida, Yamuna Expressway, Digital Broker",
    verification: {
      google: settings?.googleVerification || "google5ea580b37fc40bfa",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-P4N8R3K5');
          `}
        </Script>
      </head>
      <body className={`${inter.variable} antialiased`}>
        <ClerkProvider>
          {/* Google Tag Manager (noscript) */}
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-P4N8R3K5"
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>

          {/* Google Analytics */}
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-P5PS887CVC"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-P5PS887CVC');
            `}
          </Script>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
