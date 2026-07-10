import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { getSiteUrl } from "@/lib/seo";
import Script from "next/script";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Personal Portfolio",
    template: "%s | Personal Portfolio",
  },
  description: "Personal developer portfolio — projects, skills, and work experience",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-pf-bg font-[family-name:var(--font-jakarta)] text-pf-text">
        <Script id="portfolio-theme-init" strategy="beforeInteractive">
          {`try{var t=localStorage.getItem("portfolio-theme");if(t==="dark")document.documentElement.classList.add("dark")}catch(e){}`}
        </Script>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
