import type { Metadata } from "next";
import { Poppins, Noto_Sans_Myanmar } from "next/font/google";
import "./globals.css";

// Display face — headings only (rounded, friendly). next/font self-hosts at build.
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

// Burmese — self-hosted via next/font, regular + semibold only.
const notoMm = Noto_Sans_Myanmar({
  variable: "--font-noto-mm",
  subsets: ["myanmar"],
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "San Dauk Lay · စုံထောက်လေး",
  description:
    "A little detective for your pocket. Learn the trick before it reaches you.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="my"
      className={`${poppins.variable} ${notoMm.variable} h-full`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
