import type { Metadata } from "next";
import { Source_Sans_3, Playfair_Display } from "next/font/google";
import "./globals.css";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "Flex IA - PV Corretora | Assistência Funeral SulAmérica",
  description: "Assistente de vendas para corretores PV Corretora - Assistência Funeral SulAmérica",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${sourceSans.variable} ${playfair.variable} font-sans bg-[#0a1628] text-gray-100 antialiased`}>
        {children}
      </body>
    </html>
  );
}
