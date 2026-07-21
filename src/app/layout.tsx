import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono, Noto_Sans_Myanmar } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});
const notoMm = Noto_Sans_Myanmar({
  variable: "--font-noto-mm",
  subsets: ["myanmar"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Sone Dauk Lay · စုံထောက်လေး",
  description: "A little detective for your pocket. Learn the trick before it reaches you.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="my"
      className={`${inter.variable} ${plexMono.variable} ${notoMm.variable} h-full`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
