import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agende7 — Portal do Parceiro",
  description: "Acompanhe comissões e links de venda do programa Agende7.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
