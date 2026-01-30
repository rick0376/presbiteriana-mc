import type { Metadata } from "next";
import "./globals.scss"; // ou global.css

export const metadata: Metadata = {
  title: "LHP SaaS",
  description: "Sistema igrejas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
