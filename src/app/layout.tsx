import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "LHP SaaS",
  description: "Sistemas de igrejas",
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
