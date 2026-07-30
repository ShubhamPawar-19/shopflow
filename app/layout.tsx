import type { Metadata } from "next";
import {
  Inter,
  Noto_Sans_Devanagari,
} from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const marathi = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-marathi",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "गुरुकृपा",
  description: "गुरुकृपा फ्रँचायझी व्यवस्थापन प्रणाली",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="mr"
      className={`${inter.variable} ${marathi.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        {children}

        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}