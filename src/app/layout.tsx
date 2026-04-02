import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Upmont | Cadastro",
  description: "Preencha seus dados e entre em contato com a Upmont pelo WhatsApp.",
  openGraph: {
    title: "Upmont | Cadastro",
    description: "Preencha seus dados e entre em contato com a Upmont pelo WhatsApp.",
    siteName: "Upmont",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={montserrat.variable}>{children}</body>
    </html>
  );
}
