import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Digital Broker | Premium Real Estate",
  description: "Find exclusive homes and commercial properties with expert guidance.",
  keywords: "Real Estate, Noida, Yamuna Expressway, Digital Broker, Premium Properties, Investment",
  verification: {
    google: "google5ea580b37fc40bfa",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
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
      </body>
    </html>
  );
}
