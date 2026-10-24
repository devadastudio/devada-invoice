import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Devada Invoice — Logiciel de Facturation SaaS & Trésorerie pour PME Africaines",
  description:
    "Générez des factures professionnelles en FCFA conformes OHADA et DGID, suivez vos encaissements Wave, Orange Money et virements en temps réel.",
  icons: {
    icon: "/images/devada-logo.png",
    shortcut: "/images/devada-logo.png",
    apple: "/images/devada-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('devada_theme');
                  if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#F8FAFC] dark:bg-[#090D16] text-slate-900 dark:text-slate-100 min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
