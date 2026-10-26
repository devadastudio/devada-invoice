import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Devada Invoice | Facturation Moderne en FCFA & TVA 18% pour Entrepreneurs Africains",
  description:
    "La plateforme de facturation tout-en-un pensée pour les entrepreneurs africains. Créez des factures conformes, calculez la TVA 18% en un clic et faites-vous payer plus vite en FCFA.",
  openGraph: {
    title: "Devada Invoice | Facturation Moderne en FCFA & TVA 18% pour Entrepreneurs Africains",
    description:
      "La plateforme de facturation tout-en-un pensée pour les entrepreneurs africains. Facturez en FCFA, appliquez la TVA 18% et encaissez via Mobile Money.",
    url: "https://devadainvoice.com/landing",
    siteName: "Devada Invoice",
    locale: "fr_SN",
    type: "website",
  },
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
