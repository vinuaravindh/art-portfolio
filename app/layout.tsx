import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body className="overflow-hidden antialiased">{children}</body>
    </html>
  );
}
