import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const albertSans = localFont({
  src: "./fonts/albertsans.ttf",
  weight: "100 900",
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = localFont({
  src: "./fonts/jetbrainsmono.ttf",
  weight: "100 800",
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "La Réalité Virtuelle — Importance et utilisations",
  description:
    "Projet académique en français présentant l'importance, les domaines d'utilisation et l'anatomie d'un casque de réalité virtuelle.",
  openGraph: {
    title: "La Réalité Virtuelle — Importance et utilisations",
    description:
      "Projet académique en français présentant l'importance, les domaines d'utilisation et l'anatomie d'un casque de réalité virtuelle.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${albertSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased bg-black text-[#F4F6FA]">
        {children}
      </body>
    </html>
  );
}
