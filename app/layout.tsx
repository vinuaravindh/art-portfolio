import type { Metadata } from "next";
import { Crimson_Text } from "next/font/google";
import "./globals.css";

const crimsonText = Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Gayathri Devi — Mixed Medium Artist",
  description: "Art portfolio of Gayathri Devi, mixed medium artist based in Salem.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={crimsonText.variable}>
      <body className="overflow-hidden antialiased">{children}</body>
    </html>
  );
}
