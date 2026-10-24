"use client";

export type InvoiceStatus = "paid" | "sent" | "overdue" | "draft";

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number; // e.g. 18 for 18%
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientCity: string;
  clientAddress?: string;
  clientNinea?: string;
  clientAvatarColor?: string;
  issueDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  amountHT: number;
  taxAmount: number;
  discountAmount?: number;
  amountTTC: number;
  amountPaid: number;
  balanceDue: number;
  status: InvoiceStatus;
  items: InvoiceItem[];
  notes?: string;
  paymentMethod?: string;
  currency?: string;
  appliedRate?: number;
  showExchangeRate?: boolean;
  language?: "fr" | "en" | "it";
}

export interface Client {
  id: string;
  name: string;
  email: string;
  emailPec?: string; // Email légal certifié (optionnel)
  phone: string;
  whatsapp?: string; // Numéro WhatsApp pro (optionnel)
  city: string;
  country?: string; // Pays de domiciliation
  address: string;
  ninea?: string;
  rccm?: string;
  totalBilled: number;
  balanceDue: number;
  invoicesCount: number;
  avatarBg: string;
  status: "active" | "inactive";
  createdAt: string;
  acquisitionDate?: string;
}

export interface MetricCard {
  title: string;
  value: string;
  rawAmount?: number;
  change: string;
  isPositive: boolean;
  period: string;
  description: string;
  type: "billed" | "collected" | "pending" | "overdue";
}

export interface MonthlyStats {
  month: string;
  shortMonth: string;
  billed: number;
  collected: number;
  pending: number;
}

export const CURRENT_USER = {
  name: "Utilisateur",
  email: "",
  company: "",
  address: "",
  city: "",
  country: "Sénégal",
  ninea: "",
  rccm: "",
  phone: "",
  currency: "FCFA",
  avatarUrl: "",
  initials: "U",
  role: "Directeur Général",
};

export const DASHBOARD_METRICS: MetricCard[] = [
  {
    title: "Montant facturé",
    value: "8 450 000 FCFA",
    rawAmount: 8450000,
    change: "+14.2%",
    isPositive: true,
    period: "vs mois dernier",
    description: "Total des factures émises ce mois",
    type: "billed",
  },
  {
    title: "Montant encaissé",
    value: "5 230 000 FCFA",
    rawAmount: 5230000,
    change: "61.9%",
    isPositive: true,
    period: "taux de recouvrement",
    description: "32 factures intégralement réglées",
    type: "collected",
  },
  {
    title: "En attente d'encaissement",
    value: "3 220 000 FCFA",
    rawAmount: 3220000,
    change: "10 factures",
    isPositive: false,
    period: "en cours d'échéance",
    description: "À relancer sous 7 jours",
    type: "pending",
  },
  {
    title: "Factures émises / En retard",
    value: "50 factures",
    rawAmount: 650000,
    change: "4 en retard",
    isPositive: false,
    period: "650 000 FCFA à recouvrer",
    description: "Nécessite une relance immédiate",
    type: "overdue",
  },
];

export const MONTHLY_DATA: MonthlyStats[] = [
  { month: "Mai 2026", shortMonth: "Mai", billed: 6200000, collected: 5900000, pending: 300000 },
  { month: "Juin 2026", shortMonth: "Juin", billed: 7100000, collected: 6800000, pending: 300000 },
  { month: "Juillet 2026", shortMonth: "Juil", billed: 7850000, collected: 7200000, pending: 650000 },
  { month: "Août 2026", shortMonth: "Août", billed: 6900000, collected: 6450000, pending: 450000 },
  { month: "Septembre 2026", shortMonth: "Sept", billed: 8100000, collected: 7600000, pending: 500000 },
  { month: "Octobre 2026", shortMonth: "Oct", billed: 8450000, collected: 5230000, pending: 3220000 },
];

export const MOCK_CLIENTS: Client[] = [
  {
    "id": "client-1",
    "name": "Teranga Solutions SARL",
    "email": "comptabilite@teranga-solutions.sn",
    "emailPec": "teranga-solutions@pec.sn",
    "phone": "+221 33 824 15 20",
    "whatsapp": "+221 77 824 15 20",
    "city": "Dakar - Point E",
    "address": "Rue 10 x Boulevard de l'Est, Immeuble Horizon",
    "ninea": "005489123 2G3",
    "rccm": "SN-DKR-2020-B-8941",
    "totalBilled": 7450000,
    "balanceDue": 1850000,
    "invoicesCount": 6,
    "avatarBg": "bg-blue-600",
    "status": "active",
    "createdAt": "2026-01-15"
  },
  {
    "id": "client-2",
    "name": "Cabinet Ba & Associés",
    "email": "contact@cabinet-ba.sn",
    "emailPec": "cabinet-ba@legalpec.sn",
    "phone": "+221 77 654 12 34",
    "whatsapp": "+221 77 654 12 34",
    "city": "Dakar - Plateau",
    "address": "14 Rue Victor Hugo, Étage 3",
    "ninea": "007891234 1A2",
    "rccm": "SN-DKR-2018-B-3211",
    "totalBilled": 5200000,
    "balanceDue": 0,
    "invoicesCount": 5,
    "avatarBg": "bg-violet-600",
    "status": "active",
    "createdAt": "2026-02-10"
  },
  {
    "id": "client-3",
    "name": "Sunu Logistique SARL",
    "email": "facturation@sunulogistics.com",
    "emailPec": "",
    "phone": "+221 33 839 90 00",
    "whatsapp": "+221 78 839 90 00",
    "city": "Port Autonome de Dakar",
    "address": "Terminal Roulier Môle 2, Zone Franche",
    "ninea": "004312789 3B4",
    "rccm": "SN-DKR-2019-B-6712",
    "totalBilled": 6800000,
    "balanceDue": 0,
    "invoicesCount": 6,
    "avatarBg": "bg-emerald-600",
    "status": "active",
    "createdAt": "2026-03-01"
  },
  {
    "id": "client-4",
    "name": "Baobab Cloud Services",
    "email": "finance@baobab-cloud.sn",
    "emailPec": "baobab-cloud@legalmail.sn",
    "phone": "+221 78 300 44 11",
    "whatsapp": "+221 78 300 44 11",
    "city": "Dakar - Almadies",
    "address": "Route des Almadies, Résidence les Palmiers",
    "ninea": "006543210 5F1",
    "rccm": "SN-DKR-2021-B-9923",
    "totalBilled": 3900000,
    "balanceDue": 450000,
    "invoicesCount": 5,
    "avatarBg": "bg-rose-600",
    "status": "active",
    "createdAt": "2026-03-20"
  },
  {
    "id": "client-5",
    "name": "Khadim Diop Consulting",
    "email": "k.diop@consulting-sn.com",
    "emailPec": "",
    "phone": "+221 77 123 99 88",
    "whatsapp": "+221 77 123 99 88",
    "city": "Dakar - Mermoz",
    "address": "Pyrotechnie Voie B, Villa N° 45",
    "ninea": "008912345 4K7",
    "rccm": "SN-DKR-2022-A-1102",
    "totalBilled": 6400000,
    "balanceDue": 3200000,
    "invoicesCount": 4,
    "avatarBg": "bg-indigo-600",
    "status": "active",
    "createdAt": "2026-04-05"
  },
  {
    "id": "client-6",
    "name": "Dakar Creative Studio",
    "email": "hello@dakarcreative.art",
    "emailPec": "",
    "phone": "+221 76 908 43 21",
    "whatsapp": "+221 76 908 43 21",
    "city": "Fann Résidence",
    "address": "Corniche Ouest, Villa Teranga",
    "ninea": "009876543 8M2",
    "rccm": "SN-DKR-2023-B-4411",
    "totalBilled": 2150000,
    "balanceDue": 200000,
    "invoicesCount": 4,
    "avatarBg": "bg-amber-600",
    "status": "active",
    "createdAt": "2026-05-12"
  },
  {
    "id": "client-7",
    "name": "AgroTech Sénégal",
    "email": "direction@agrotech-sn.org",
    "emailPec": "agrotech@pec.gouv.sn",
    "phone": "+221 33 951 22 10",
    "whatsapp": "+221 77 951 22 10",
    "city": "Thiès - Zone Industrielle",
    "address": "Km 4 Route de Dakar, Hangar C",
    "ninea": "003456789 9P0",
    "rccm": "SN-THS-2019-B-1290",
    "totalBilled": 4250000,
    "balanceDue": 0,
    "invoicesCount": 4,
    "avatarBg": "bg-teal-600",
    "status": "active",
    "createdAt": "2026-06-18"
  },
  {
    "id": "client-8",
    "name": "Noflaye Media Group",
    "email": "adm@noflaye.sn",
    "emailPec": "",
    "phone": "+221 77 444 33 22",
    "whatsapp": "+221 77 444 33 22",
    "city": "Dakar - Ngor",
    "address": "Route de la Corniche des Almadies",
    "ninea": "002233445 6L8",
    "rccm": "SN-DKR-2020-B-7754",
    "totalBilled": 1650000,
    "balanceDue": 0,
    "invoicesCount": 3,
    "avatarBg": "bg-cyan-700",
    "status": "inactive",
    "createdAt": "2026-07-02"
  },
  {
    "id": "client-9",
    "name": "Sopi Technologies",
    "email": "ops@sopi-tech.sn",
    "emailPec": "sopi-tech@legalpec.sn",
    "phone": "+221 78 999 11 00",
    "whatsapp": "+221 78 999 11 00",
    "city": "Dakar - Point E",
    "address": "Boulevard de la République",
    "ninea": "001122334 7R5",
    "rccm": "SN-DKR-2024-B-0831",
    "totalBilled": 2300000,
    "balanceDue": 500000,
    "invoicesCount": 3,
    "avatarBg": "bg-slate-700",
    "status": "active",
    "createdAt": "2026-08-25"
  },
  {
    "id": "client-10",
    "name": "Sahel Énergie Verte",
    "email": "contact@sahel-energie.sn",
    "emailPec": "sahel.energie@pec.sn",
    "phone": "+221 33 860 40 10",
    "whatsapp": "+221 77 860 40 10",
    "city": "Saint-Louis",
    "address": "Quartier Nord, Rue Blaise Diagne",
    "ninea": "007788990 4E3",
    "rccm": "SN-SL-2021-B-0512",
    "totalBilled": 3100000,
    "balanceDue": 0,
    "invoicesCount": 3,
    "avatarBg": "bg-emerald-600",
    "status": "active",
    "createdAt": "2026-09-05"
  },
  {
    "id": "client-11",
    "name": "Touba Import-Export",
    "email": "finance@touba-import.sn",
    "emailPec": "",
    "phone": "+221 77 555 12 34",
    "whatsapp": "+221 77 555 12 34",
    "city": "Touba - Mosquée",
    "address": "Avenue Serigne Fallou",
    "ninea": "006655443 8X2",
    "rccm": "SN-DKR-2017-A-0994",
    "totalBilled": 1200000,
    "balanceDue": 0,
    "invoicesCount": 1,
    "avatarBg": "bg-amber-600",
    "status": "inactive",
    "createdAt": "2026-09-12"
  },
  {
    "id": "client-12",
    "name": "Gorée Voyages & Tourisme",
    "email": "resa@goree-voyages.sn",
    "emailPec": "goree.voyages@certmail.sn",
    "phone": "+221 33 822 55 66",
    "whatsapp": "+221 78 822 55 66",
    "city": "Dakar - Embarcadère",
    "address": "Boulevard de la Libération",
    "ninea": "004433221 1Q9",
    "rccm": "SN-DKR-2022-B-3104",
    "totalBilled": 1850000,
    "balanceDue": 0,
    "invoicesCount": 2,
    "avatarBg": "bg-blue-600",
    "status": "active",
    "createdAt": "2026-09-28"
  }
];

export const TOP_CLIENTS = [...MOCK_CLIENTS]
  .sort((a, b) => b.totalBilled - a.totalBilled)
  .slice(0, 4);

export const MOCK_INVOICES: Invoice[] = [
  {
    "id": "inv-0050",
    "invoiceNumber": "FAC-2026-0050",
    "clientName": "Teranga Solutions SARL",
    "clientEmail": "comptabilite@teranga-solutions.sn",
    "clientPhone": "+221 33 824 15 20",
    "clientCity": "Dakar - Point E",
    "clientAddress": "Rue 10 x Boulevard de l'Est, Immeuble Horizon",
    "clientNinea": "005489123 2G3",
    "clientAvatarColor": "bg-blue-600",
    "issueDate": "2026-10-24",
    "dueDate": "2026-11-08",
    "amountHT": 1850000,
    "taxAmount": 333000,
    "discountAmount": 0,
    "amountTTC": 2183000,
    "amountPaid": 0,
    "balanceDue": 2183000,
    "status": "sent",
    "items": [
      {
        "id": "item-50-1",
        "description": "Développement application web SaaS (Sprint 1)",
        "quantity": 1,
        "unitPrice": 1200000,
        "taxRate": 18,
        "amount": 1200000
      },
      {
        "id": "item-50-2",
        "description": "Audit de sécurité infrastructure & optimisation cloud AWS",
        "quantity": 1,
        "unitPrice": 650000,
        "taxRate": 18,
        "amount": 650000
      }
    ],
    "notes": "Facture de prestation de services professionnels. Mentionner FAC-2026-0050 lors du règlement.",
    "paymentMethod": "Virement Bancaire (BOA)",
    "currency": "FCFA"
  },
  {
    "id": "inv-0049",
    "invoiceNumber": "FAC-2026-0049",
    "clientName": "Cabinet Ba & Associés",
    "clientEmail": "contact@cabinet-ba.sn",
    "clientPhone": "+221 77 654 12 34",
    "clientCity": "Dakar - Plateau",
    "clientAddress": "14 Rue Victor Hugo, Étage 3",
    "clientNinea": "007891234 1A2",
    "clientAvatarColor": "bg-violet-600",
    "issueDate": "2026-10-23",
    "dueDate": "2026-11-07",
    "amountHT": 1500000,
    "taxAmount": 270000,
    "discountAmount": 0,
    "amountTTC": 1770000,
    "amountPaid": 1770000,
    "balanceDue": 0,
    "status": "paid",
    "items": [
      {
        "id": "item-49-1",
        "description": "Développement application mobile iOS & Android",
        "quantity": 1,
        "unitPrice": 1500000,
        "taxRate": 18,
        "amount": 1500000
      }
    ],
    "notes": "Facture de prestation de services professionnels. Mentionner FAC-2026-0049 lors du règlement.",
    "paymentMethod": "Wave Business",
    "currency": "FCFA"
  },
  {
    "id": "inv-0048",
    "invoiceNumber": "FAC-2026-0048",
    "clientName": "Sunu Logistique SARL",
    "clientEmail": "facturation@sunulogistics.com",
    "clientPhone": "+221 33 839 90 00",
    "clientCity": "Port Autonome de Dakar",
    "clientAddress": "Terminal Roulier Môle 2, Zone Franche",
    "clientNinea": "004312789 3B4",
    "clientAvatarColor": "bg-emerald-600",
    "issueDate": "2026-10-19",
    "dueDate": "2026-11-03",
    "amountHT": 450000,
    "taxAmount": 81000,
    "discountAmount": 0,
    "amountTTC": 531000,
    "amountPaid": 0,
    "balanceDue": 531000,
    "status": "sent",
    "items": [
      {
        "id": "item-48-1",
        "description": "Intégration API passerelle Wave & Orange Money",
        "quantity": 1,
        "unitPrice": 450000,
        "taxRate": 18,
        "amount": 450000
      }
    ],
    "notes": "Facture de prestation de services professionnels. Mentionner FAC-2026-0048 lors du règlement.",
    "paymentMethod": "Wave Business",
    "currency": "FCFA"
  },
  {
    "id": "inv-0047",
    "invoiceNumber": "FAC-2026-0047",
    "clientName": "Baobab Cloud Services",
    "clientEmail": "finance@baobab-cloud.sn",
    "clientPhone": "+221 78 300 44 11",
    "clientCity": "Dakar - Almadies",
    "clientAddress": "Route des Almadies, Résidence les Palmiers",
    "clientNinea": "006543210 5F1",
    "clientAvatarColor": "bg-rose-600",
    "issueDate": "2026-10-15",
    "dueDate": "2026-10-30",
    "amountHT": 1150000,
    "taxAmount": 207000,
    "discountAmount": 0,
    "amountTTC": 1357000,
    "amountPaid": 1357000,
    "balanceDue": 0,
    "status": "paid",
    "items": [
      {
        "id": "item-47-1",
        "description": "Audit de sécurité infrastructure & optimisation cloud AWS",
        "quantity": 1,
        "unitPrice": 650000,
        "taxRate": 18,
        "amount": 650000
      },
      {
        "id": "item-47-2",
        "description": "Campagne d'acquisition multicanale & Ads",
        "quantity": 1,
        "unitPrice": 500000,
        "taxRate": 18,
        "amount": 500000
      }
    ],
    "notes": "Facture de prestation de services professionnels. Mentionner FAC-2026-0047 lors du règlement.",
    "paymentMethod": "Orange Money",
    "currency": "FCFA"
  },
  {
    "id": "inv-0046",
    "invoiceNumber": "FAC-2026-0046",
    "clientName": "Khadim Diop Consulting",
    "clientEmail": "k.diop@consulting-sn.com",
    "clientPhone": "+221 77 123 99 88",
    "clientCity": "Dakar - Mermoz",
    "clientAddress": "Pyrotechnie Voie B, Villa N° 45",
    "clientNinea": "008912345 4K7",
    "clientAvatarColor": "bg-indigo-600",
    "issueDate": "2026-10-10",
    "dueDate": "2026-10-25",
    "amountHT": 800000,
    "taxAmount": 144000,
    "discountAmount": 0,
    "amountTTC": 944000,
    "amountPaid": 0,
    "balanceDue": 944000,
    "status": "draft",
    "items": [
      {
        "id": "item-46-1",
        "description": "Conception UI/UX Design System & prototypes Figma",
        "quantity": 1,
        "unitPrice": 800000,
        "taxRate": 18,
        "amount": 800000
      }
    ],
    "notes": "Facture de prestation de services professionnels. Mentionner FAC-2026-0046 lors du règlement.",
    "paymentMethod": "Stripe (Carte Bancaire)",
    "currency": "FCFA"
  },
  {
    "id": "inv-0045",
    "invoiceNumber": "FAC-2026-0045",
    "clientName": "Dakar Creative Studio",
    "clientEmail": "hello@dakarcreative.art",
    "clientPhone": "+221 76 908 43 21",
    "clientCity": "Fann Résidence",
    "clientAddress": "Corniche Ouest, Villa Teranga",
    "clientNinea": "009876543 8M2",
    "clientAvatarColor": "bg-amber-600",
    "issueDate": "2026-09-28",
    "dueDate": "2026-10-13",
    "amountHT": 350000,
    "taxAmount": 63000,
    "discountAmount": 0,
    "amountTTC": 413000,
    "amountPaid": 0,
    "balanceDue": 413000,
    "status": "overdue",
    "items": [
      {
        "id": "item-45-1",
        "description": "Accompagnement stratégie digitale & SEO",
        "quantity": 1,
        "unitPrice": 350000,
        "taxRate": 18,
        "amount": 350000
      }
    ],
    "notes": "Facture de prestation de services professionnels. Mentionner FAC-2026-0045 lors du règlement.",
    "paymentMethod": "Virement Bancaire (BOA)",
    "currency": "FCFA"
  },
  {
    "id": "inv-0044",
    "invoiceNumber": "FAC-2026-0044",
    "clientName": "AgroTech Sénégal",
    "clientEmail": "direction@agrotech-sn.org",
    "clientPhone": "+221 33 951 22 10",
    "clientCity": "Thiès - Zone Industrielle",
    "clientAddress": "Km 4 Route de Dakar, Hangar C",
    "clientNinea": "003456789 9P0",
    "clientAvatarColor": "bg-teal-600",
    "issueDate": "2026-09-22",
    "dueDate": "2026-10-07",
    "amountHT": 900000,
    "taxAmount": 162000,
    "discountAmount": 0,
    "amountTTC": 1062000,
    "amountPaid": 1062000,
    "balanceDue": 0,
    "status": "paid",
    "items": [
      {
        "id": "item-44-1",
        "description": "Campagne d'acquisition multicanale & Ads",
        "quantity": 1,
        "unitPrice": 500000,
        "taxRate": 18,
        "amount": 500000
      },
      {
        "id": "item-44-2",
        "description": "Formation équipe technique aux technologies cloud",
        "quantity": 1,
        "unitPrice": 400000,
        "taxRate": 18,
        "amount": 400000
      }
    ],
    "notes": "Facture de prestation de services professionnels. Mentionner FAC-2026-0044 lors du règlement.",
    "paymentMethod": "Wave Business",
    "currency": "FCFA"
  },
  {
    "id": "inv-0043",
    "invoiceNumber": "FAC-2026-0043",
    "clientName": "Noflaye Media Group",
    "clientEmail": "adm@noflaye.sn",
    "clientPhone": "+221 77 444 33 22",
    "clientCity": "Dakar - Ngor",
    "clientAddress": "Route de la Corniche des Almadies",
    "clientNinea": "002233445 6L8",
    "clientAvatarColor": "bg-cyan-700",
    "issueDate": "2026-09-18",
    "dueDate": "2026-10-03",
    "amountHT": 250000,
    "taxAmount": 45000,
    "discountAmount": 0,
    "amountTTC": 295000,
    "amountPaid": 295000,
    "balanceDue": 0,
    "status": "paid",
    "items": [
      {
        "id": "item-43-1",
        "description": "Support technique mensuel & infogérance serveurs",
        "quantity": 1,
        "unitPrice": 250000,
        "taxRate": 18,
        "amount": 250000
      }
    ],
    "notes": "Facture de prestation de services professionnels. Mentionner FAC-2026-0043 lors du règlement.",
    "paymentMethod": "Orange Money",
    "currency": "FCFA"
  },
  {
    "id": "inv-0042",
    "invoiceNumber": "FAC-2026-0042",
    "clientName": "Sopi Technologies",
    "clientEmail": "ops@sopi-tech.sn",
    "clientPhone": "+221 78 999 11 00",
    "clientCity": "Dakar - Point E",
    "clientAddress": "Boulevard de la République",
    "clientNinea": "001122334 7R5",
    "clientAvatarColor": "bg-slate-700",
    "issueDate": "2026-09-12",
    "dueDate": "2026-09-27",
    "amountHT": 950000,
    "taxAmount": 171000,
    "discountAmount": 0,
    "amountTTC": 1121000,
    "amountPaid": 1121000,
    "balanceDue": 0,
    "status": "paid",
    "items": [
      {
        "id": "item-42-1",
        "description": "Refonte portail institutionnel & espace client",
        "quantity": 1,
        "unitPrice": 950000,
        "taxRate": 18,
        "amount": 950000
      }
    ],
    "notes": "Facture de prestation de services professionnels. Mentionner FAC-2026-0042 lors du règlement.",
    "paymentMethod": "Virement Bancaire (BOA)",
    "currency": "FCFA"
  },
  {
    "id": "inv-0041",
    "invoiceNumber": "FAC-2026-0041",
    "clientName": "Sahel Énergie Verte",
    "clientEmail": "contact@sahel-energie.sn",
    "clientPhone": "+221 33 860 40 10",
    "clientCity": "Saint-Louis",
    "clientAddress": "Quartier Nord, Rue Blaise Diagne",
    "clientNinea": "007788990 4E3",
    "clientAvatarColor": "bg-emerald-600",
    "issueDate": "2026-09-08",
    "dueDate": "2026-09-23",
    "amountHT": 850000,
    "taxAmount": 153000,
    "discountAmount": 0,
    "amountTTC": 1003000,
    "amountPaid": 1003000,
    "balanceDue": 0,
    "status": "paid",
    "items": [
      {
        "id": "item-41-1",
        "description": "Formation équipe technique aux technologies cloud",
        "quantity": 1,
        "unitPrice": 400000,
        "taxRate": 18,
        "amount": 400000
      },
      {
        "id": "item-41-2",
        "description": "Intégration API passerelle Wave & Orange Money",
        "quantity": 1,
        "unitPrice": 450000,
        "taxRate": 18,
        "amount": 450000
      }
    ],
    "notes": "Facture de prestation de services professionnels. Mentionner FAC-2026-0041 lors du règlement.",
    "paymentMethod": "Wave Business",
    "currency": "FCFA"
  },
  {
    "id": "inv-0040",
    "invoiceNumber": "FAC-2026-0040",
    "clientName": "Touba Import-Export",
    "clientEmail": "finance@touba-import.sn",
    "clientPhone": "+221 77 555 12 34",
    "clientCity": "Touba - Mosquée",
    "clientAddress": "Avenue Serigne Fallou",
    "clientNinea": "006655443 8X2",
    "clientAvatarColor": "bg-amber-600",
    "issueDate": "2026-09-02",
    "dueDate": "2026-09-17",
    "amountHT": 1200000,
    "taxAmount": 216000,
    "discountAmount": 0,
    "amountTTC": 1416000,
    "amountPaid": 1416000,
    "balanceDue": 0,
    "status": "paid",
    "items": [
      {
        "id": "item-40-1",
        "description": "Développement application web SaaS (Sprint 1)",
        "quantity": 1,
        "unitPrice": 1200000,
        "taxRate": 18,
        "amount": 1200000
      }
    ],
    "notes": "Facture de prestation de services professionnels. Mentionner FAC-2026-0040 lors du règlement.",
    "paymentMethod": "Stripe (Carte Bancaire)",
    "currency": "FCFA"
  },
  {
    "id": "inv-0039",
    "invoiceNumber": "FAC-2026-0039",
    "clientName": "Gorée Voyages & Tourisme",
    "clientEmail": "resa@goree-voyages.sn",
    "clientPhone": "+221 33 822 55 66",
    "clientCity": "Dakar - Embarcadère",
    "clientAddress": "Boulevard de la Libération",
    "clientNinea": "004433221 1Q9",
    "clientAvatarColor": "bg-blue-600",
    "issueDate": "2026-08-27",
    "dueDate": "2026-09-11",
    "amountHT": 1500000,
    "taxAmount": 270000,
    "discountAmount": 0,
    "amountTTC": 1770000,
    "amountPaid": 1770000,
    "balanceDue": 0,
    "status": "paid",
    "items": [
      {
        "id": "item-39-1",
        "description": "Développement application mobile iOS & Android",
        "quantity": 1,
        "unitPrice": 1500000,
        "taxRate": 18,
        "amount": 1500000
      }
    ],
    "notes": "Facture de prestation de services professionnels. Mentionner FAC-2026-0039 lors du règlement.",
    "paymentMethod": "Wave Business",
    "currency": "FCFA"
  },
  {
    "id": "inv-0038",
    "invoiceNumber": "FAC-2026-0038",
    "clientName": "Teranga Solutions SARL",
    "clientEmail": "comptabilite@teranga-solutions.sn",
    "clientPhone": "+221 33 824 15 20",
    "clientCity": "Dakar - Point E",
    "clientAddress": "Rue 10 x Boulevard de l'Est, Immeuble Horizon",
    "clientNinea": "005489123 2G3",
    "clientAvatarColor": "bg-blue-600",
    "issueDate": "2026-08-20",
    "dueDate": "2026-09-04",
    "amountHT": 800000,
    "taxAmount": 144000,
    "discountAmount": 0,
    "amountTTC": 944000,
    "amountPaid": 944000,
    "balanceDue": 0,
    "status": "paid",
    "items": [
      {
        "id": "item-38-1",
        "description": "Intégration API passerelle Wave & Orange Money",
        "quantity": 1,
        "unitPrice": 450000,
        "taxRate": 18,
        "amount": 450000
      },
      {
        "id": "item-38-2",
        "description": "Accompagnement stratégie digitale & SEO",
        "quantity": 1,
        "unitPrice": 350000,
        "taxRate": 18,
        "amount": 350000
      }
    ],
    "notes": "Facture de prestation de services professionnels. Mentionner FAC-2026-0038 lors du règlement.",
    "paymentMethod": "Virement Bancaire (BOA)",
    "currency": "FCFA"
  },
  {
    "id": "inv-0037",
    "invoiceNumber": "FAC-2026-0037",
    "clientName": "Cabinet Ba & Associés",
    "clientEmail": "contact@cabinet-ba.sn",
    "clientPhone": "+221 77 654 12 34",
    "clientCity": "Dakar - Plateau",
    "clientAddress": "14 Rue Victor Hugo, Étage 3",
    "clientNinea": "007891234 1A2",
    "clientAvatarColor": "bg-violet-600",
    "issueDate": "2026-08-15",
    "dueDate": "2026-08-30",
    "amountHT": 650000,
    "taxAmount": 117000,
    "discountAmount": 0,
    "amountTTC": 767000,
    "amountPaid": 767000,
    "balanceDue": 0,
    "status": "paid",
    "items": [
      {
        "id": "item-37-1",
        "description": "Audit de sécurité infrastructure & optimisation cloud AWS",
        "quantity": 1,
        "unitPrice": 650000,
        "taxRate": 18,
        "amount": 650000
      }
    ],
    "notes": "Facture de prestation de services professionnels. Mentionner FAC-2026-0037 lors du règlement.",
    "paymentMethod": "Orange Money",
    "currency": "FCFA"
  },
  {
    "id": "inv-0036",
    "invoiceNumber": "FAC-2026-0036",
    "clientName": "Sunu Logistique SARL",
    "clientEmail": "facturation@sunulogistics.com",
    "clientPhone": "+221 33 839 90 00",
    "clientCity": "Port Autonome de Dakar",
    "clientAddress": "Terminal Roulier Môle 2, Zone Franche",
    "clientNinea": "004312789 3B4",
    "clientAvatarColor": "bg-emerald-600",
    "issueDate": "2026-08-09",
    "dueDate": "2026-08-24",
    "amountHT": 800000,
    "taxAmount": 144000,
    "discountAmount": 0,
    "amountTTC": 944000,
    "amountPaid": 944000,
    "balanceDue": 0,
    "status": "paid",
    "items": [
      {
        "id": "item-36-1",
        "description": "Conception UI/UX Design System & prototypes Figma",
        "quantity": 1,
        "unitPrice": 800000,
        "taxRate": 18,
        "amount": 800000
      }
    ],
    "notes": "Facture de prestation de services professionnels. Mentionner FAC-2026-0036 lors du règlement.",
    "paymentMethod": "Wave Business",
    "currency": "FCFA"
  },
  {
    "id": "inv-0035",
    "invoiceNumber": "FAC-2026-0035",
    "clientName": "Baobab Cloud Services",
    "clientEmail": "finance@baobab-cloud.sn",
    "clientPhone": "+221 78 300 44 11",
    "clientCity": "Dakar - Almadies",
    "clientAddress": "Route des Almadies, Résidence les Palmiers",
    "clientNinea": "006543210 5F1",
    "clientAvatarColor": "bg-rose-600",
    "issueDate": "2026-08-03",
    "dueDate": "2026-08-18",
    "amountHT": 1300000,
    "taxAmount": 234000,
    "discountAmount": 0,
    "amountTTC": 1534000,
    "amountPaid": 0,
    "balanceDue": 1534000,
    "status": "overdue",
    "items": [
      {
        "id": "item-35-1",
        "description": "Accompagnement stratégie digitale & SEO",
        "quantity": 1,
        "unitPrice": 350000,
        "taxRate": 18,
        "amount": 350000
      },
      {
        "id": "item-35-2",
        "description": "Refonte portail institutionnel & espace client",
        "quantity": 1,
        "unitPrice": 950000,
        "taxRate": 18,
        "amount": 950000
      }
    ],
    "notes": "Facture de prestation de services professionnels. Mentionner FAC-2026-0035 lors du règlement.",
    "paymentMethod": "Virement Bancaire (BOA)",
    "currency": "FCFA"
  },
  {
    "id": "inv-0034",
    "invoiceNumber": "FAC-2026-0034",
    "clientName": "Khadim Diop Consulting",
    "clientEmail": "k.diop@consulting-sn.com",
    "clientPhone": "+221 77 123 99 88",
    "clientCity": "Dakar - Mermoz",
    "clientAddress": "Pyrotechnie Voie B, Villa N° 45",
    "clientNinea": "008912345 4K7",
    "clientAvatarColor": "bg-indigo-600",
    "issueDate": "2026-07-29",
    "dueDate": "2026-08-13",
    "amountHT": 500000,
    "taxAmount": 90000,
    "discountAmount": 0,
    "amountTTC": 590000,
    "amountPaid": 590000,
    "balanceDue": 0,
    "status": "paid",
    "items": [
      {
        "id": "item-34-1",
        "description": "Campagne d'acquisition multicanale & Ads",
        "quantity": 1,
        "unitPrice": 500000,
        "taxRate": 18,
        "amount": 500000
      }
    ],
    "notes": "Facture de prestation de services professionnels. Mentionner FAC-2026-0034 lors du règlement.",
    "paymentMethod": "Wave Business",
    "currency": "FCFA"
  },
  {
    "id": "inv-0033",
    "invoiceNumber": "FAC-2026-0033",
    "clientName": "Dakar Creative Studio",
    "clientEmail": "hello@dakarcreative.art",
    "clientPhone": "+221 76 908 43 21",
    "clientCity": "Fann Résidence",
    "clientAddress": "Corniche Ouest, Villa Teranga",
    "clientNinea": "009876543 8M2",
    "clientAvatarColor": "bg-amber-600",
    "issueDate": "2026-07-22",
    "dueDate": "2026-08-06",
    "amountHT": 250000,
    "taxAmount": 45000,
    "discountAmount": 0,
    "amountTTC": 295000,
    "amountPaid": 295000,
    "balanceDue": 0,
    "status": "paid",
    "items": [
      {
        "id": "item-33-1",
        "description": "Support technique mensuel & infogérance serveurs",
        "quantity": 1,
        "unitPrice": 250000,
        "taxRate": 18,
        "amount": 250000
      }
    ],
    "notes": "Facture de prestation de services professionnels. Mentionner FAC-2026-0033 lors du règlement.",
    "paymentMethod": "Stripe (Carte Bancaire)",
    "currency": "FCFA"
  },
  {
    "id": "inv-0032",
    "invoiceNumber": "FAC-2026-0032",
    "clientName": "AgroTech Sénégal",
    "clientEmail": "direction@agrotech-sn.org",
    "clientPhone": "+221 33 951 22 10",
    "clientCity": "Thiès - Zone Industrielle",
    "clientAddress": "Km 4 Route de Dakar, Hangar C",
    "clientNinea": "003456789 9P0",
    "clientAvatarColor": "bg-teal-600",
    "issueDate": "2026-07-16",
    "dueDate": "2026-07-31",
    "amountHT": 2450000,
    "taxAmount": 441000,
    "discountAmount": 0,
    "amountTTC": 2891000,
    "amountPaid": 2891000,
    "balanceDue": 0,
    "status": "paid",
    "items": [
      {
        "id": "item-32-1",
        "description": "Refonte portail institutionnel & espace client",
        "quantity": 1,
        "unitPrice": 950000,
        "taxRate": 18,
        "amount": 950000
      },
      {
        "id": "item-32-2",
        "description": "Développement application mobile iOS & Android",
        "quantity": 1,
        "unitPrice": 1500000,
        "taxRate": 18,
        "amount": 1500000
      }
    ],
    "notes": "Facture de prestation de services professionnels. Mentionner FAC-2026-0032 lors du règlement.",
    "paymentMethod": "Virement Bancaire (BOA)",
    "currency": "FCFA"
  },
  {
    "id": "inv-0031",
    "invoiceNumber": "FAC-2026-0031",
    "clientName": "Noflaye Media Group",
    "clientEmail": "adm@noflaye.sn",
    "clientPhone": "+221 77 444 33 22",
    "clientCity": "Dakar - Ngor",
    "clientAddress": "Route de la Corniche des Almadies",
    "clientNinea": "002233445 6L8",
    "clientAvatarColor": "bg-cyan-700",
    "issueDate": "2026-07-11",
    "dueDate": "2026-07-26",
    "amountHT": 400000,
    "taxAmount": 72000,
    "discountAmount": 0,
    "amountTTC": 472000,
    "amountPaid": 472000,
    "balanceDue": 0,
    "status": "paid",
    "items": [
      {
        "id": "item-31-1",
        "description": "Formation équipe technique aux technologies cloud",
        "quantity": 1,
        "unitPrice": 400000,
        "taxRate": 18,
        "amount": 400000
      }
    ],
    "notes": "Facture de prestation de services professionnels. Mentionner FAC-2026-0031 lors du règlement.",
    "paymentMethod": "Orange Money",
    "currency": "FCFA"
  },
  {
    "id": "inv-0030",
    "invoiceNumber": "FAC-2026-0030",
    "clientName": "Sopi Technologies",
    "clientEmail": "ops@sopi-tech.sn",
    "clientPhone": "+221 78 999 11 00",
    "clientCity": "Dakar - Point E",
    "clientAddress": "Boulevard de la République",
    "clientNinea": "001122334 7R5",
    "clientAvatarColor": "bg-slate-700",
    "issueDate": "2026-07-06",
    "dueDate": "2026-07-21",
    "amountHT": 1200000,
    "taxAmount": 216000,
    "discountAmount": 0,
    "amountTTC": 1416000,
    "amountPaid": 1416000,
    "balanceDue": 0,
    "status": "paid",
    "items": [
      {
        "id": "item-30-1",
        "description": "Développement application web SaaS (Sprint 1)",
        "quantity": 1,
        "unitPrice": 1200000,
        "taxRate": 18,
        "amount": 1200000
      }
    ],
    "notes": "Facture de prestation de services professionnels. Mentionner FAC-2026-0030 lors du règlement.",
    "paymentMethod": "Wave Business",
    "currency": "FCFA"
  },
  {
    "id": "inv-0029",
    "invoiceNumber": "FAC-2026-0029",
    "clientName": "Sahel Énergie Verte",
    "clientEmail": "contact@sahel-energie.sn",
    "clientPhone": "+221 33 860 40 10",
    "clientCity": "Saint-Louis",
    "clientAddress": "Quartier Nord, Rue Blaise Diagne",
    "clientNinea": "007788990 4E3",
    "clientAvatarColor": "bg-emerald-600",
    "issueDate": "2026-07-01",
    "dueDate": "2026-07-16",
    "amountHT": 2300000,
    "taxAmount": 414000,
    "discountAmount": 0,
    "amountTTC": 2714000,
    "amountPaid": 2714000,
    "balanceDue": 0,
    "status": "paid",
    "items": [
      {
        "id": "item-29-1",
        "description": "Développement application mobile iOS & Android",
        "quantity": 1,
        "unitPrice": 1500000,
        "taxRate": 18,
        "amount": 1500000
      },
      {
        "id": "item-29-2",
        "description": "Conception UI/UX Design System & prototypes Figma",
        "quantity": 1,
        "unitPrice": 800000,
        "taxRate": 18,
        "amount": 800000
      }
    ],
    "notes": "Facture de prestation de services professionnels. Mentionner FAC-2026-0029 lors du règlement.",
    "paymentMethod": "Virement Bancaire (BOA)",
    "currency": "FCFA"
  },
  {
    "id": "inv-0028",
    "invoiceNumber": "FAC-2026-0028",
    "clientName": "Touba Import-Export",
    "clientEmail": "finance@touba-import.sn",
    "clientPhone": "+221 77 555 12 34",
    "clientCity": "Touba - Mosquée",
    "clientAddress": "Avenue Serigne Fallou",
    "clientNinea": "006655443 8X2",
    "clientAvatarColor": "bg-amber-600",
    "issueDate": "2026-06-26",
    "dueDate": "2026-07-11",
    "amountHT": 450000,
    "taxAmount": 81000,
    "discountAmount": 0,
    "amountTTC": 531000,
    "amountPaid": 531000,
    "balanceDue": 0,
    "status": "paid",
    "items": [
      {
        "id": "item-28-1",
        "description": "Intégration API passerelle Wave & Orange Money",
        "quantity": 1,
        "unitPrice": 450000,
        "taxRate": 18,
        "amount": 450000
      }
    ],
    "notes": "Facture de prestation de services professionnels. Mentionner FAC-2026-0028 lors du règlement.",
    "paymentMethod": "Wave Business",
    "currency": "FCFA"
  },
  {
    "id": "inv-0027",
    "invoiceNumber": "FAC-2026-0027",
    "clientName": "Gorée Voyages & Tourisme",
    "clientEmail": "resa@goree-voyages.sn",
    "clientPhone": "+221 33 822 55 66",
    "clientCity": "Dakar - Embarcadère",
    "clientAddress": "Boulevard de la Libération",
    "clientNinea": "004433221 1Q9",
    "clientAvatarColor": "bg-blue-600",
    "issueDate": "2026-06-20",
    "dueDate": "2026-07-05",
    "amountHT": 650000,
    "taxAmount": 117000,
    "discountAmount": 0,
    "amountTTC": 767000,
    "amountPaid": 767000,
    "balanceDue": 0,
    "status": "paid",
    "items": [
      {
        "id": "item-27-1",
        "description": "Audit de sécurité infrastructure & optimisation cloud AWS",
        "quantity": 1,
        "unitPrice": 650000,
        "taxRate": 18,
        "amount": 650000
      }
    ],
    "notes": "Facture de prestation de services professionnels. Mentionner FAC-2026-0027 lors du règlement.",
    "paymentMethod": "Orange Money",
    "currency": "FCFA"
  },
  {
    "id": "inv-0026",
    "invoiceNumber": "FAC-2026-0026",
    "clientName": "Teranga Solutions SARL",
    "clientEmail": "comptabilite@teranga-solutions.sn",
    "clientPhone": "+221 33 824 15 20",
    "clientCity": "Dakar - Point E",
    "clientAddress": "Rue 10 x Boulevard de l'Est, Immeuble Horizon",
    "clientNinea": "005489123 2G3",
    "clientAvatarColor": "bg-blue-600",
    "issueDate": "2026-06-15",
    "dueDate": "2026-06-30",
    "amountHT": 1050000,
    "taxAmount": 189000,
    "discountAmount": 0,
    "amountTTC": 1239000,
    "amountPaid": 1239000,
    "balanceDue": 0,
    "status": "paid",
    "items": [
      {
        "id": "item-26-1",
        "description": "Conception UI/UX Design System & prototypes Figma",
        "quantity": 1,
        "unitPrice": 800000,
        "taxRate": 18,
        "amount": 800000
      },
      {
        "id": "item-26-2",
        "description": "Support technique mensuel & infogérance serveurs",
        "quantity": 1,
        "unitPrice": 250000,
        "taxRate": 18,
        "amount": 250000
      }
    ],
    "notes": "Facture de prestation de services professionnels. Mentionner FAC-2026-0026 lors du règlement.",
    "paymentMethod": "Virement Bancaire (BOA)",
    "currency": "FCFA"
  },
  {
    "id": "inv-0025",
    "invoiceNumber": "FAC-2026-0025",
    "clientName": "Cabinet Ba & Associés",
    "clientEmail": "contact@cabinet-ba.sn",
    "clientPhone": "+221 77 654 12 34",
    "clientCity": "Dakar - Plateau",
    "clientAddress": "14 Rue Victor Hugo, Étage 3",
    "clientNinea": "007891234 1A2",
    "clientAvatarColor": "bg-violet-600",
    "issueDate": "2026-06-10",
    "dueDate": "2026-06-25",
    "amountHT": 350000,
    "taxAmount": 63000,
    "discountAmount": 0,
    "amountTTC": 413000,
    "amountPaid": 413000,
    "balanceDue": 0,
    "status": "paid",
    "items": [
      {
        "id": "item-25-1",
        "description": "Accompagnement stratégie digitale & SEO",
        "quantity": 1,
        "unitPrice": 350000,
        "taxRate": 18,
        "amount": 350000
      }
    ],
    "notes": "Facture de prestation de services professionnels. Mentionner FAC-2026-0025 lors du règlement.",
    "paymentMethod": "Wave Business",
    "currency": "FCFA"
  },
  {
    "id": "inv-0024",
    "invoiceNumber": "FAC-2026-0024",
    "clientName": "Sunu Logistique SARL",
    "clientEmail": "facturation@sunulogistics.com",
    "clientPhone": "+221 33 839 90 00",
    "clientCity": "Port Autonome de Dakar",
    "clientAddress": "Terminal Roulier Môle 2, Zone Franche",
    "clientNinea": "004312789 3B4",
    "clientAvatarColor": "bg-emerald-600",
    "issueDate": "2026-06-05",
    "dueDate": "2026-06-20",
    "amountHT": 500000,
    "taxAmount": 90000,
    "discountAmount": 0,
    "amountTTC": 590000,
    "amountPaid": 590000,
    "balanceDue": 0,
    "status": "paid",
    "items": [
      {
        "id": "item-24-1",
        "description": "Campagne d'acquisition multicanale & Ads",
        "quantity": 1,
        "unitPrice": 500000,
        "taxRate": 18,
        "amount": 500000
      }
    ],
    "notes": "Facture de prestation de services professionnels. Mentionner FAC-2026-0024 lors du règlement.",
    "paymentMethod": "Stripe (Carte Bancaire)",
    "currency": "FCFA"
  },
  {
    "id": "inv-0023",
    "invoiceNumber": "FAC-2026-0023",
    "clientName": "Baobab Cloud Services",
    "clientEmail": "finance@baobab-cloud.sn",
    "clientPhone": "+221 78 300 44 11",
    "clientCity": "Dakar - Almadies",
    "clientAddress": "Route des Almadies, Résidence les Palmiers",
    "clientNinea": "006543210 5F1",
    "clientAvatarColor": "bg-rose-600",
    "issueDate": "2026-06-01",
    "dueDate": "2026-06-16",
    "amountHT": 1450000,
    "taxAmount": 261000,
    "discountAmount": 0,
    "amountTTC": 1711000,
    "amountPaid": 1711000,
    "balanceDue": 0,
    "status": "paid",
    "items": [
      {
        "id": "item-23-1",
        "description": "Support technique mensuel & infogérance serveurs",
        "quantity": 1,
        "unitPrice": 250000,
        "taxRate": 18,
        "amount": 250000
      },
      {
        "id": "item-23-2",
        "description": "Développement application web SaaS (Sprint 1)",
        "quantity": 1,
        "unitPrice": 1200000,
        "taxRate": 18,
        "amount": 1200000
      }
    ],
    "notes": "Facture de prestation de services professionnels. Mentionner FAC-2026-0023 lors du règlement.",
    "paymentMethod": "Virement Bancaire (BOA)",
    "currency": "FCFA"
  },
  {
    "id": "inv-0022",
    "invoiceNumber": "FAC-2026-0022",
    "clientName": "Khadim Diop Consulting",
    "clientEmail": "k.diop@consulting-sn.com",
    "clientPhone": "+221 77 123 99 88",
    "clientCity": "Dakar - Mermoz",
    "clientAddress": "Pyrotechnie Voie B, Villa N° 45",
    "clientNinea": "008912345 4K7",
    "clientAvatarColor": "bg-indigo-600",
    "issueDate": "2026-05-28",
    "dueDate": "2026-06-12",
    "amountHT": 950000,
    "taxAmount": 171000,
    "discountAmount": 0,
    "amountTTC": 1121000,
    "amountPaid": 1121000,
    "balanceDue": 0,
    "status": "paid",
    "items": [
      {
        "id": "item-22-1",
        "description": "Refonte portail institutionnel & espace client",
        "quantity": 1,
        "unitPrice": 950000,
        "taxRate": 18,
        "amount": 950000
      }
    ],
    "notes": "Facture de prestation de services professionnels. Mentionner FAC-2026-0022 lors du règlement.",
    "paymentMethod": "Wave Business",
    "currency": "FCFA"
  },
  {
    "id": "inv-0021",
    "invoiceNumber": "FAC-2026-0021",
    "clientName": "Dakar Creative Studio",
    "clientEmail": "hello@dakarcreative.art",
    "clientPhone": "+221 76 908 43 21",
    "clientCity": "Fann Résidence",
    "clientAddress": "Corniche Ouest, Villa Teranga",
    "clientNinea": "009876543 8M2",
    "clientAvatarColor": "bg-amber-600",
    "issueDate": "2026-05-22",
    "dueDate": "2026-06-06",
    "amountHT": 400000,
    "taxAmount": 72000,
    "discountAmount": 0,
    "amountTTC": 472000,
    "amountPaid": 472000,
    "balanceDue": 0,
    "status": "paid",
    "items": [
      {
        "id": "item-21-1",
        "description": "Formation équipe technique aux technologies cloud",
        "quantity": 1,
        "unitPrice": 400000,
        "taxRate": 18,
        "amount": 400000
      }
    ],
    "notes": "Facture de prestation de services professionnels. Mentionner FAC-2026-0021 lors du règlement.",
    "paymentMethod": "Orange Money",
    "currency": "FCFA"
  },
  {
    "id": "inv-0020",
    "invoiceNumber": "FAC-2026-0020",
    "clientName": "AgroTech Sénégal",
    "clientEmail": "direction@agrotech-sn.org",
    "clientPhone": "+221 33 951 22 10",
    "clientCity": "Thiès - Zone Industrielle",
    "clientAddress": "Km 4 Route de Dakar, Hangar C",
    "clientNinea": "003456789 9P0",
    "clientAvatarColor": "bg-teal-600",
    "issueDate": "2026-05-17",
    "dueDate": "2026-06-01",
    "amountHT": 1850000,
    "taxAmount": 333000,
    "discountAmount": 0,
    "amountTTC": 2183000,
    "amountPaid": 2183000,
    "balanceDue": 0,
    "status": "paid",
    "items": [
      {
        "id": "item-20-1",
        "description": "Développement application web SaaS (Sprint 1)",
        "quantity": 1,
        "unitPrice": 1200000,
        "taxRate": 18,
        "amount": 1200000
      },
      {
        "id": "item-20-2",
        "description": "Audit de sécurité infrastructure & optimisation cloud AWS",
        "quantity": 1,
        "unitPrice": 650000,
        "taxRate": 18,
        "amount": 650000
      }
    ],
    "notes": "Facture de prestation de services professionnels. Mentionner FAC-2026-0020 lors du règlement.",
    "paymentMethod": "Virement Bancaire (BOA)",
    "currency": "FCFA"
  },
  {
    "id": "inv-0019",
    "invoiceNumber": "FAC-2026-0019",
    "clientName": "Noflaye Media Group",
    "clientEmail": "adm@noflaye.sn",
    "clientPhone": "+221 77 444 33 22",
    "clientCity": "Dakar - Ngor",
    "clientAddress": "Route de la Corniche des Almadies",
    "clientNinea": "002233445 6L8",
    "clientAvatarColor": "bg-cyan-700",
    "issueDate": "2026-05-11",
    "dueDate": "2026-05-26",
    "amountHT": 1500000,
    "taxAmount": 270000,
    "discountAmount": 0,
    "amountTTC": 1770000,
    "amountPaid": 1770000,
    "balanceDue": 0,
    "status": "paid",
    "items": [
      {
        "id": "item-19-1",
        "description": "Développement application mobile iOS & Android",
        "quantity": 1,
        "unitPrice": 1500000,
        "taxRate": 18,
        "amount": 1500000
      }
    ],
    "notes": "Facture de prestation de services professionnels. Mentionner FAC-2026-0019 lors du règlement.",
    "paymentMethod": "Wave Business",
    "currency": "FCFA"
  },
  {
    "id": "inv-0018",
    "invoiceNumber": "FAC-2026-0018",
    "clientName": "Sopi Technologies",
    "clientEmail": "ops@sopi-tech.sn",
    "clientPhone": "+221 78 999 11 00",
    "clientCity": "Dakar - Point E",
    "clientAddress": "Boulevard de la République",
    "clientNinea": "001122334 7R5",
    "clientAvatarColor": "bg-slate-700",
    "issueDate": "2026-05-06",
    "dueDate": "2026-05-21",
    "amountHT": 450000,
    "taxAmount": 81000,
    "discountAmount": 0,
    "amountTTC": 531000,
    "amountPaid": 531000,
    "balanceDue": 0,
    "status": "paid",
    "items": [
      {
        "id": "item-18-1",
        "description": "Intégration API passerelle Wave & Orange Money",
        "quantity": 1,
        "unitPrice": 450000,
        "taxRate": 18,
        "amount": 450000
      }
    ],
    "notes": "Facture de prestation de services professionnels. Mentionner FAC-2026-0018 lors du règlement.",
    "paymentMethod": "Stripe (Carte Bancaire)",
    "currency": "FCFA"
  },
  {
    "id": "inv-0017",
    "invoiceNumber": "FAC-2026-0017",
    "clientName": "Sahel Énergie Verte",
    "clientEmail": "contact@sahel-energie.sn",
    "clientPhone": "+221 33 860 40 10",
    "clientCity": "Saint-Louis",
    "clientAddress": "Quartier Nord, Rue Blaise Diagne",
    "clientNinea": "007788990 4E3",
    "clientAvatarColor": "bg-emerald-600",
    "issueDate": "2026-05-02",
    "dueDate": "2026-05-17",
    "amountHT": 1150000,
    "taxAmount": 207000,
    "discountAmount": 0,
    "amountTTC": 1357000,
    "amountPaid": 1357000,
    "balanceDue": 0,
    "status": "paid",
    "items": [
      {
        "id": "item-17-1",
        "description": "Audit de sécurité infrastructure & optimisation cloud AWS",
        "quantity": 1,
        "unitPrice": 650000,
        "taxRate": 18,
        "amount": 650000
      },
      {
        "id": "item-17-2",
        "description": "Campagne d'acquisition multicanale & Ads",
        "quantity": 1,
        "unitPrice": 500000,
        "taxRate": 18,
        "amount": 500000
      }
    ],
    "notes": "Facture de prestation de services professionnels. Mentionner FAC-2026-0017 lors du règlement.",
    "paymentMethod": "Virement Bancaire (BOA)",
    "currency": "FCFA"
  },
  {
    "id": "inv-0016",
    "invoiceNumber": "FAC-2026-0016",
    "clientName": "Touba Import-Export",
    "clientEmail": "finance@touba-import.sn",
    "clientPhone": "+221 77 555 12 34",
    "clientCity": "Touba - Mosquée",
    "clientAddress": "Avenue Serigne Fallou",
    "clientNinea": "006655443 8X2",
    "clientAvatarColor": "bg-amber-600",
    "issueDate": "2026-04-26",
    "dueDate": "2026-05-11",
    "amountHT": 800000,
    "taxAmount": 144000,
    "discountAmount": 0,
    "amountTTC": 944000,
    "amountPaid": 944000,
    "balanceDue": 0,
    "status": "paid",
    "items": [
      {
        "id": "item-16-1",
        "description": "Conception UI/UX Design System & prototypes Figma",
        "quantity": 1,
        "unitPrice": 800000,
        "taxRate": 18,
        "amount": 800000
      }
    ],
    "notes": "Facture de prestation de services professionnels. Mentionner FAC-2026-0016 lors du règlement.",
    "paymentMethod": "Wave Business",
    "currency": "FCFA"
  },
  {
    "id": "inv-0015",
    "invoiceNumber": "FAC-2026-0015",
    "clientName": "Gorée Voyages & Tourisme",
    "clientEmail": "resa@goree-voyages.sn",
    "clientPhone": "+221 33 822 55 66",
    "clientCity": "Dakar - Embarcadère",
    "clientAddress": "Boulevard de la Libération",
    "clientNinea": "004433221 1Q9",
    "clientAvatarColor": "bg-blue-600",
    "issueDate": "2026-04-20",
    "dueDate": "2026-05-05",
    "amountHT": 350000,
    "taxAmount": 63000,
    "discountAmount": 0,
    "amountTTC": 413000,
    "amountPaid": 413000,
    "balanceDue": 0,
    "status": "paid",
    "items": [
      {
        "id": "item-15-1",
        "description": "Accompagnement stratégie digitale & SEO",
        "quantity": 1,
        "unitPrice": 350000,
        "taxRate": 18,
        "amount": 350000
      }
    ],
    "notes": "Facture de prestation de services professionnels. Mentionner FAC-2026-0015 lors du règlement.",
    "paymentMethod": "Orange Money",
    "currency": "FCFA"
  },
  {
    "id": "inv-0014",
    "invoiceNumber": "FAC-2026-0014",
    "clientName": "Teranga Solutions SARL",
    "clientEmail": "comptabilite@teranga-solutions.sn",
    "clientPhone": "+221 33 824 15 20",
    "clientCity": "Dakar - Point E",
    "clientAddress": "Rue 10 x Boulevard de l'Est, Immeuble Horizon",
    "clientNinea": "005489123 2G3",
    "clientAvatarColor": "bg-blue-600",
    "issueDate": "2026-04-14",
    "dueDate": "2026-04-29",
    "amountHT": 900000,
    "taxAmount": 162000,
    "discountAmount": 0,
    "amountTTC": 1062000,
    "amountPaid": 1062000,
    "balanceDue": 0,
    "status": "paid",
    "items": [
      {
        "id": "item-14-1",
        "description": "Campagne d'acquisition multicanale & Ads",
        "quantity": 1,
        "unitPrice": 500000,
        "taxRate": 18,
        "amount": 500000
      },
      {
        "id": "item-14-2",
        "description": "Formation équipe technique aux technologies cloud",
        "quantity": 1,
        "unitPrice": 400000,
        "taxRate": 18,
        "amount": 400000
      }
    ],
    "notes": "Facture de prestation de services professionnels. Mentionner FAC-2026-0014 lors du règlement.",
    "paymentMethod": "Virement Bancaire (BOA)",
    "currency": "FCFA"
  },
  {
    "id": "inv-0013",
    "invoiceNumber": "FAC-2026-0013",
    "clientName": "Cabinet Ba & Associés",
    "clientEmail": "contact@cabinet-ba.sn",
    "clientPhone": "+221 77 654 12 34",
    "clientCity": "Dakar - Plateau",
    "clientAddress": "14 Rue Victor Hugo, Étage 3",
    "clientNinea": "007891234 1A2",
    "clientAvatarColor": "bg-violet-600",
    "issueDate": "2026-04-08",
    "dueDate": "2026-04-23",
    "amountHT": 250000,
    "taxAmount": 45000,
    "discountAmount": 0,
    "amountTTC": 295000,
    "amountPaid": 295000,
    "balanceDue": 0,
    "status": "paid",
    "items": [
      {
        "id": "item-13-1",
        "description": "Support technique mensuel & infogérance serveurs",
        "quantity": 1,
        "unitPrice": 250000,
        "taxRate": 18,
        "amount": 250000
      }
    ],
    "notes": "Facture de prestation de services professionnels. Mentionner FAC-2026-0013 lors du règlement.",
    "paymentMethod": "Wave Business",
    "currency": "FCFA"
  },
  {
    "id": "inv-0012",
    "invoiceNumber": "FAC-2026-0012",
    "clientName": "Sunu Logistique SARL",
    "clientEmail": "facturation@sunulogistics.com",
    "clientPhone": "+221 33 839 90 00",
    "clientCity": "Port Autonome de Dakar",
    "clientAddress": "Terminal Roulier Môle 2, Zone Franche",
    "clientNinea": "004312789 3B4",
    "clientAvatarColor": "bg-emerald-600",
    "issueDate": "2026-04-02",
    "dueDate": "2026-04-17",
    "amountHT": 950000,
    "taxAmount": 171000,
    "discountAmount": 0,
    "amountTTC": 1121000,
    "amountPaid": 1121000,
    "balanceDue": 0,
    "status": "paid",
    "items": [
      {
        "id": "item-12-1",
        "description": "Refonte portail institutionnel & espace client",
        "quantity": 1,
        "unitPrice": 950000,
        "taxRate": 18,
        "amount": 950000
      }
    ],
    "notes": "Facture de prestation de services professionnels. Mentionner FAC-2026-0012 lors du règlement.",
    "paymentMethod": "Stripe (Carte Bancaire)",
    "currency": "FCFA"
  },
  {
    "id": "inv-0011",
    "invoiceNumber": "FAC-2026-0011",
    "clientName": "Baobab Cloud Services",
    "clientEmail": "finance@baobab-cloud.sn",
    "clientPhone": "+221 78 300 44 11",
    "clientCity": "Dakar - Almadies",
    "clientAddress": "Route des Almadies, Résidence les Palmiers",
    "clientNinea": "006543210 5F1",
    "clientAvatarColor": "bg-rose-600",
    "issueDate": "2026-03-25",
    "dueDate": "2026-04-09",
    "amountHT": 850000,
    "taxAmount": 153000,
    "discountAmount": 0,
    "amountTTC": 1003000,
    "amountPaid": 1003000,
    "balanceDue": 0,
    "status": "paid",
    "items": [
      {
        "id": "item-11-1",
        "description": "Formation équipe technique aux technologies cloud",
        "quantity": 1,
        "unitPrice": 400000,
        "taxRate": 18,
        "amount": 400000
      },
      {
        "id": "item-11-2",
        "description": "Intégration API passerelle Wave & Orange Money",
        "quantity": 1,
        "unitPrice": 450000,
        "taxRate": 18,
        "amount": 450000
      }
    ],
    "notes": "Facture de prestation de services professionnels. Mentionner FAC-2026-0011 lors du règlement.",
    "paymentMethod": "Wave Business",
    "currency": "FCFA"
  },
  {
    "id": "inv-0010",
    "invoiceNumber": "FAC-2026-0010",
    "clientName": "Khadim Diop Consulting",
    "clientEmail": "k.diop@consulting-sn.com",
    "clientPhone": "+221 77 123 99 88",
    "clientCity": "Dakar - Mermoz",
    "clientAddress": "Pyrotechnie Voie B, Villa N° 45",
    "clientNinea": "008912345 4K7",
    "clientAvatarColor": "bg-indigo-600",
    "issueDate": "2026-03-18",
    "dueDate": "2026-04-02",
    "amountHT": 1200000,
    "taxAmount": 216000,
    "discountAmount": 0,
    "amountTTC": 1416000,
    "amountPaid": 1416000,
    "balanceDue": 0,
    "status": "paid",
    "items": [
      {
        "id": "item-10-1",
        "description": "Développement application web SaaS (Sprint 1)",
        "quantity": 1,
        "unitPrice": 1200000,
        "taxRate": 18,
        "amount": 1200000
      }
    ],
    "notes": "Facture de prestation de services professionnels. Mentionner FAC-2026-0010 lors du règlement.",
    "paymentMethod": "Virement Bancaire (BOA)",
    "currency": "FCFA"
  },
  {
    "id": "inv-0009",
    "invoiceNumber": "FAC-2026-0009",
    "clientName": "Dakar Creative Studio",
    "clientEmail": "hello@dakarcreative.art",
    "clientPhone": "+221 76 908 43 21",
    "clientCity": "Fann Résidence",
    "clientAddress": "Corniche Ouest, Villa Teranga",
    "clientNinea": "009876543 8M2",
    "clientAvatarColor": "bg-amber-600",
    "issueDate": "2026-03-10",
    "dueDate": "2026-03-25",
    "amountHT": 1500000,
    "taxAmount": 270000,
    "discountAmount": 0,
    "amountTTC": 1770000,
    "amountPaid": 1770000,
    "balanceDue": 0,
    "status": "paid",
    "items": [
      {
        "id": "item-9-1",
        "description": "Développement application mobile iOS & Android",
        "quantity": 1,
        "unitPrice": 1500000,
        "taxRate": 18,
        "amount": 1500000
      }
    ],
    "notes": "Facture de prestation de services professionnels. Mentionner FAC-2026-0009 lors du règlement.",
    "paymentMethod": "Orange Money",
    "currency": "FCFA"
  },
  {
    "id": "inv-0008",
    "invoiceNumber": "FAC-2026-0008",
    "clientName": "AgroTech Sénégal",
    "clientEmail": "direction@agrotech-sn.org",
    "clientPhone": "+221 33 951 22 10",
    "clientCity": "Thiès - Zone Industrielle",
    "clientAddress": "Km 4 Route de Dakar, Hangar C",
    "clientNinea": "003456789 9P0",
    "clientAvatarColor": "bg-teal-600",
    "issueDate": "2026-03-03",
    "dueDate": "2026-03-18",
    "amountHT": 800000,
    "taxAmount": 144000,
    "discountAmount": 0,
    "amountTTC": 944000,
    "amountPaid": 944000,
    "balanceDue": 0,
    "status": "paid",
    "items": [
      {
        "id": "item-8-1",
        "description": "Intégration API passerelle Wave & Orange Money",
        "quantity": 1,
        "unitPrice": 450000,
        "taxRate": 18,
        "amount": 450000
      },
      {
        "id": "item-8-2",
        "description": "Accompagnement stratégie digitale & SEO",
        "quantity": 1,
        "unitPrice": 350000,
        "taxRate": 18,
        "amount": 350000
      }
    ],
    "notes": "Facture de prestation de services professionnels. Mentionner FAC-2026-0008 lors du règlement.",
    "paymentMethod": "Wave Business",
    "currency": "FCFA"
  },
  {
    "id": "inv-0007",
    "invoiceNumber": "FAC-2026-0007",
    "clientName": "Noflaye Media Group",
    "clientEmail": "adm@noflaye.sn",
    "clientPhone": "+221 77 444 33 22",
    "clientCity": "Dakar - Ngor",
    "clientAddress": "Route de la Corniche des Almadies",
    "clientNinea": "002233445 6L8",
    "clientAvatarColor": "bg-cyan-700",
    "issueDate": "2026-02-24",
    "dueDate": "2026-03-11",
    "amountHT": 650000,
    "taxAmount": 117000,
    "discountAmount": 0,
    "amountTTC": 767000,
    "amountPaid": 767000,
    "balanceDue": 0,
    "status": "paid",
    "items": [
      {
        "id": "item-7-1",
        "description": "Audit de sécurité infrastructure & optimisation cloud AWS",
        "quantity": 1,
        "unitPrice": 650000,
        "taxRate": 18,
        "amount": 650000
      }
    ],
    "notes": "Facture de prestation de services professionnels. Mentionner FAC-2026-0007 lors du règlement.",
    "paymentMethod": "Virement Bancaire (BOA)",
    "currency": "FCFA"
  },
  {
    "id": "inv-0006",
    "invoiceNumber": "FAC-2026-0006",
    "clientName": "Sopi Technologies",
    "clientEmail": "ops@sopi-tech.sn",
    "clientPhone": "+221 78 999 11 00",
    "clientCity": "Dakar - Point E",
    "clientAddress": "Boulevard de la République",
    "clientNinea": "001122334 7R5",
    "clientAvatarColor": "bg-slate-700",
    "issueDate": "2026-02-18",
    "dueDate": "2026-03-05",
    "amountHT": 800000,
    "taxAmount": 144000,
    "discountAmount": 0,
    "amountTTC": 944000,
    "amountPaid": 944000,
    "balanceDue": 0,
    "status": "paid",
    "items": [
      {
        "id": "item-6-1",
        "description": "Conception UI/UX Design System & prototypes Figma",
        "quantity": 1,
        "unitPrice": 800000,
        "taxRate": 18,
        "amount": 800000
      }
    ],
    "notes": "Facture de prestation de services professionnels. Mentionner FAC-2026-0006 lors du règlement.",
    "paymentMethod": "Wave Business",
    "currency": "FCFA"
  },
  {
    "id": "inv-0005",
    "invoiceNumber": "FAC-2026-0005",
    "clientName": "Sahel Énergie Verte",
    "clientEmail": "contact@sahel-energie.sn",
    "clientPhone": "+221 33 860 40 10",
    "clientCity": "Saint-Louis",
    "clientAddress": "Quartier Nord, Rue Blaise Diagne",
    "clientNinea": "007788990 4E3",
    "clientAvatarColor": "bg-emerald-600",
    "issueDate": "2026-02-11",
    "dueDate": "2026-02-26",
    "amountHT": 1300000,
    "taxAmount": 234000,
    "discountAmount": 0,
    "amountTTC": 1534000,
    "amountPaid": 1534000,
    "balanceDue": 0,
    "status": "paid",
    "items": [
      {
        "id": "item-5-1",
        "description": "Accompagnement stratégie digitale & SEO",
        "quantity": 1,
        "unitPrice": 350000,
        "taxRate": 18,
        "amount": 350000
      },
      {
        "id": "item-5-2",
        "description": "Refonte portail institutionnel & espace client",
        "quantity": 1,
        "unitPrice": 950000,
        "taxRate": 18,
        "amount": 950000
      }
    ],
    "notes": "Facture de prestation de services professionnels. Mentionner FAC-2026-0005 lors du règlement.",
    "paymentMethod": "Orange Money",
    "currency": "FCFA"
  },
  {
    "id": "inv-0004",
    "invoiceNumber": "FAC-2026-0004",
    "clientName": "Touba Import-Export",
    "clientEmail": "finance@touba-import.sn",
    "clientPhone": "+221 77 555 12 34",
    "clientCity": "Touba - Mosquée",
    "clientAddress": "Avenue Serigne Fallou",
    "clientNinea": "006655443 8X2",
    "clientAvatarColor": "bg-amber-600",
    "issueDate": "2026-02-04",
    "dueDate": "2026-02-19",
    "amountHT": 500000,
    "taxAmount": 90000,
    "discountAmount": 0,
    "amountTTC": 590000,
    "amountPaid": 590000,
    "balanceDue": 0,
    "status": "paid",
    "items": [
      {
        "id": "item-4-1",
        "description": "Campagne d'acquisition multicanale & Ads",
        "quantity": 1,
        "unitPrice": 500000,
        "taxRate": 18,
        "amount": 500000
      }
    ],
    "notes": "Facture de prestation de services professionnels. Mentionner FAC-2026-0004 lors du règlement.",
    "paymentMethod": "Wave Business",
    "currency": "FCFA"
  },
  {
    "id": "inv-0003",
    "invoiceNumber": "FAC-2026-0003",
    "clientName": "Gorée Voyages & Tourisme",
    "clientEmail": "resa@goree-voyages.sn",
    "clientPhone": "+221 33 822 55 66",
    "clientCity": "Dakar - Embarcadère",
    "clientAddress": "Boulevard de la Libération",
    "clientNinea": "004433221 1Q9",
    "clientAvatarColor": "bg-blue-600",
    "issueDate": "2026-01-26",
    "dueDate": "2026-02-10",
    "amountHT": 250000,
    "taxAmount": 45000,
    "discountAmount": 0,
    "amountTTC": 295000,
    "amountPaid": 295000,
    "balanceDue": 0,
    "status": "paid",
    "items": [
      {
        "id": "item-3-1",
        "description": "Support technique mensuel & infogérance serveurs",
        "quantity": 1,
        "unitPrice": 250000,
        "taxRate": 18,
        "amount": 250000
      }
    ],
    "notes": "Facture de prestation de services professionnels. Mentionner FAC-2026-0003 lors du règlement.",
    "paymentMethod": "Virement Bancaire (BOA)",
    "currency": "FCFA"
  },
  {
    "id": "inv-0002",
    "invoiceNumber": "FAC-2026-0002",
    "clientName": "Teranga Solutions SARL",
    "clientEmail": "comptabilite@teranga-solutions.sn",
    "clientPhone": "+221 33 824 15 20",
    "clientCity": "Dakar - Point E",
    "clientAddress": "Rue 10 x Boulevard de l'Est, Immeuble Horizon",
    "clientNinea": "005489123 2G3",
    "clientAvatarColor": "bg-blue-600",
    "issueDate": "2026-01-18",
    "dueDate": "2026-02-02",
    "amountHT": 2450000,
    "taxAmount": 441000,
    "discountAmount": 0,
    "amountTTC": 2891000,
    "amountPaid": 2891000,
    "balanceDue": 0,
    "status": "paid",
    "items": [
      {
        "id": "item-2-1",
        "description": "Refonte portail institutionnel & espace client",
        "quantity": 1,
        "unitPrice": 950000,
        "taxRate": 18,
        "amount": 950000
      },
      {
        "id": "item-2-2",
        "description": "Développement application mobile iOS & Android",
        "quantity": 1,
        "unitPrice": 1500000,
        "taxRate": 18,
        "amount": 1500000
      }
    ],
    "notes": "Facture de prestation de services professionnels. Mentionner FAC-2026-0002 lors du règlement.",
    "paymentMethod": "Wave Business",
    "currency": "FCFA"
  },
  {
    "id": "inv-0001",
    "invoiceNumber": "FAC-2026-0001",
    "clientName": "Cabinet Ba & Associés",
    "clientEmail": "contact@cabinet-ba.sn",
    "clientPhone": "+221 77 654 12 34",
    "clientCity": "Dakar - Plateau",
    "clientAddress": "14 Rue Victor Hugo, Étage 3",
    "clientNinea": "007891234 1A2",
    "clientAvatarColor": "bg-violet-600",
    "issueDate": "2026-01-10",
    "dueDate": "2026-01-25",
    "amountHT": 400000,
    "taxAmount": 72000,
    "discountAmount": 0,
    "amountTTC": 472000,
    "amountPaid": 472000,
    "balanceDue": 0,
    "status": "paid",
    "items": [
      {
        "id": "item-1-1",
        "description": "Formation équipe technique aux technologies cloud",
        "quantity": 1,
        "unitPrice": 400000,
        "taxRate": 18,
        "amount": 400000
      }
    ],
    "notes": "Facture de prestation de services professionnels. Mentionner FAC-2026-0001 lors du règlement.",
    "paymentMethod": "Orange Money",
    "currency": "FCFA"
  }
];

// Local storage management helpers to persist created/edited invoices and clients in the browser
const INVOICES_STORAGE_KEY = "devada_invoices_data_v2";
const CLIENTS_STORAGE_KEY = "devada_clients_data_v2";

export function getStoredInvoices(): Invoice[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(INVOICES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function saveStoredInvoices(invoices: Invoice[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(invoices));
    // Emit global event so Sidebar and other components sync their counters immediately
    window.dispatchEvent(new CustomEvent("invoices_updated", { detail: invoices.length }));
  } catch (e) {
    console.error("Failed to save invoices to storage", e);
  }
}

export function getStoredClients(): Client[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CLIENTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function saveStoredClients(clients: Client[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(clients));
    window.dispatchEvent(new CustomEvent("clients_updated", { detail: clients.length }));
  } catch (e) {
    console.error("Failed to save clients to storage", e);
  }
}

export interface CompanySettings {
  companyName: string;
  legalForm: string;
  tradeName: string;
  ninea: string;
  rccm: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  email: string;
  emailPec?: string;
  phone: string;
  whatsappNumber?: string;
  website: string;
  currency: string;
  taxApplicable: boolean;
  defaultTaxRate: number;
  invoicePrefix: string;
  defaultDueDays: number;
  nextInvoiceSequence: number;
  footerLegalText: string;
  lateFeeInterestRate: number;
  waveEnabled: boolean;
  waveNumber: string;
  waveAccountName: string;
  omEnabled: boolean;
  omNumber: string;
  omMerchantCode: string;
  stripeEnabled: boolean;
  bankEnabled: boolean;
  bankName: string;
  bankIban: string;
  bankRibKey: string;
  bankAccountHolder: string;
  emailNotifications: boolean;
  autoPaymentReminder: boolean;
  reminderDaysBeforeDue: number;
  rateEur: number;
  rateUsd: number;
  signatureType: "name" | "image";
  signatureName: string;
  signatureImageData?: string;
  companyLogo?: string;
  showExchangeRateOnInvoices?: boolean;
  defaultLanguage?: "fr" | "en" | "it";
  whatsappTemplateFr?: string;
  whatsappTemplateEn?: string;
  whatsappTemplateIt?: string;
  whatsappDefaultLanguage?: "fr" | "en" | "it";
}

export const DEFAULT_WHATSAPP_TEMPLATE_FR = `Bonjour *{client_name}*,

Veuillez trouver ci-joint votre facture officielle *{invoice_number}* émise par *{company_name}* :
• Montant TTC : *{amount}*
• Date d'échéance : *{due_date}*
• Statut du paiement : *{status}*

Document officiel PDF en pièce jointe.
Merci pour votre confiance !`;

export const DEFAULT_WHATSAPP_TEMPLATE_EN = `Hello *{client_name}*,

Please find attached your official invoice *{invoice_number}* issued by *{company_name}*:
• Total Due: *{amount}*
• Due Date: *{due_date}*
• Payment Status: *{status}*

Official PDF document attached.
Thank you for your business!`;

export const DEFAULT_WHATSAPP_TEMPLATE_IT = `Gentile *{client_name}*,

In allegato trova la fattura ufficiale *{invoice_number}* emessa da *{company_name}*:
• Totale Fattura: *{amount}*
• Data di scadenza: *{due_date}*
• Stato del pagamento: *{status}*

Documento PDF ufficiale in allegato.
Grazie per la fiducia!`;

export const DEFAULT_SETTINGS: CompanySettings = {
  companyName: "",
  legalForm: "SARL",
  tradeName: "",
  ninea: "",
  rccm: "",
  address: "",
  city: "",
  postalCode: "",
  country: "Sénégal",
  email: "",
  phone: "",
  website: "",
  currency: "FCFA",
  defaultLanguage: "fr",
  whatsappDefaultLanguage: "fr",
  whatsappTemplateFr: DEFAULT_WHATSAPP_TEMPLATE_FR,
  whatsappTemplateEn: DEFAULT_WHATSAPP_TEMPLATE_EN,
  whatsappTemplateIt: DEFAULT_WHATSAPP_TEMPLATE_IT,
  taxApplicable: true,
  defaultTaxRate: 18,
  invoicePrefix: "FAC-",
  defaultDueDays: 15,
  nextInvoiceSequence: 1,
  footerLegalText: "",
  lateFeeInterestRate: 1.5,
  waveEnabled: false,
  waveNumber: "",
  waveAccountName: "",
  omEnabled: false,
  omNumber: "",
  omMerchantCode: "",
  stripeEnabled: false,
  bankEnabled: false,
  bankName: "",
  bankIban: "",
  bankRibKey: "",
  bankAccountHolder: "",
  emailNotifications: true,
  autoPaymentReminder: true,
  reminderDaysBeforeDue: 3,
  rateEur: 655.957,
  rateUsd: 600.0,
  signatureType: "name",
  signatureName: "",
  signatureImageData: "",
  companyLogo: "",
  showExchangeRateOnInvoices: false,
};

const SETTINGS_STORAGE_KEY = "devada_settings_data_v3";

export function getStoredSettings(): CompanySettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    const parsed = JSON.parse(raw);
    if (parsed.companyName === "Dakar Digital Agency SARL") parsed.companyName = "";
    if (parsed.bankName === "Bank of Africa (BOA Sénégal)") parsed.bankName = "";
    if (parsed.bankIban === "SN08 SN03 4010 0200 4589 2100 12") parsed.bankIban = "";
    if (parsed.signatureName === "Moussa Diop") parsed.signatureName = "";
    return parsed;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings: CompanySettings) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent("settings_updated", { detail: settings }));
  } catch (e) {
    console.error("Failed to save settings to storage", e);
  }
}

export function getNextInvoiceNumber(invoicesList?: Invoice[]): string {
  const invoices = invoicesList !== undefined ? invoicesList : getStoredInvoices();
  let maxSeq = 0;
  invoices.forEach((inv) => {
    const match = inv.invoiceNumber.match(/FAC-(\d{4})-(\d+)/);
    if (match && match[2]) {
      const num = parseInt(match[2], 10);
      if (!isNaN(num) && num > maxSeq) {
        maxSeq = num;
      }
    }
  });
  const year = new Date().getFullYear();
  return `FAC-${year}-${String(maxSeq + 1).padStart(4, "0")}`;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  category: "payment" | "invoice_overdue" | "invoice_sent" | "client_created" | "security";
  timestamp: string;
  date: string;
  read: boolean;
  actorName?: string;
  actorAvatar?: string;
  actorBg?: string;
  invoiceId?: string;
  invoiceNumber?: string;
  clientName?: string;
  amount?: number;
}

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif-1",
    title: "Paiement reçu via Wave",
    actorName: "Baobab Traiteur",
    actorBg: "bg-emerald-600",
    message: "a réglé la facture FAC-2026-0047 d'un montant de 450 000 FCFA.",
    category: "payment",
    timestamp: "Il y a 2 min",
    date: "2026-10-24T06:15:00",
    read: false,
    invoiceId: "inv-6",
    invoiceNumber: "FAC-2026-0047",
    clientName: "Baobab Traiteur",
    amount: 450000,
  },
  {
    id: "notif-2",
    title: "Facture en retard d'échéance",
    actorName: "Khadim Diop Consulting",
    actorBg: "bg-rose-600",
    message: "a dépassé l'échéance de la facture FAC-2026-0045 (850 000 FCFA).",
    category: "invoice_overdue",
    timestamp: "Il y a 20 min",
    date: "2026-10-24T05:55:00",
    read: false,
    invoiceId: "inv-4",
    invoiceNumber: "FAC-2026-0045",
    clientName: "Khadim Diop Consulting",
    amount: 850000,
  },
  {
    id: "notif-3",
    title: "Virement bancaire encaissé",
    actorName: "Sonatel SA",
    actorBg: "bg-blue-600",
    message: "a validé le virement de 3 245 000 FCFA pour la facture FAC-2026-0042.",
    category: "payment",
    timestamp: "Il y a 1h",
    date: "2026-10-24T05:00:00",
    read: false,
    invoiceId: "inv-1",
    invoiceNumber: "FAC-2026-0042",
    clientName: "Sonatel SA",
    amount: 3245000,
  },
  {
    id: "notif-4",
    title: "Nouvelle facture émise",
    actorName: "Amadou Diallo",
    actorBg: "bg-indigo-600",
    message: "a généré et transmis la facture FAC-2026-0048 à Dakar Dem Dikk.",
    category: "invoice_sent",
    timestamp: "Il y a 2h",
    date: "2026-10-24T04:10:00",
    read: false,
    invoiceId: "inv-7",
    invoiceNumber: "FAC-2026-0048",
    clientName: "Dakar Dem Dikk",
    amount: 1200000,
  },
  {
    id: "notif-5",
    title: "Nouveau client enregistré",
    actorName: "Wave Mobile Money",
    actorBg: "bg-teal-600",
    message: "a été ajouté au répertoire des clients professionnels.",
    category: "client_created",
    timestamp: "Mardi",
    date: "2026-10-21T14:30:00",
    read: true,
    clientName: "Wave Mobile Money Sénégal",
  },
  {
    id: "notif-6",
    title: "Paiement Orange Money",
    actorName: "Teranga Tech SARL",
    actorBg: "bg-amber-600",
    message: "a réglé le solde de la facture FAC-2026-0044 (620 000 FCFA).",
    category: "payment",
    timestamp: "La semaine dernière",
    date: "2026-10-18T10:20:00",
    read: true,
    invoiceId: "inv-3",
    invoiceNumber: "FAC-2026-0044",
    clientName: "Teranga Tech SARL",
    amount: 620000,
  },
  {
    id: "notif-7",
    title: "Alerte de sécurité",
    actorName: "Système de Sécurité",
    actorBg: "bg-slate-700",
    message: "Session de facturation vérifiée avec succès depuis Dakar (IP 197.234.221.14).",
    category: "security",
    timestamp: "La semaine dernière",
    date: "2026-10-17T08:00:00",
    read: true,
  },
];

const NOTIFICATIONS_STORAGE_KEY = "devada_notifications_data_v2";

export function getStoredNotifications(): AppNotification[] {
  if (typeof window === "undefined") return MOCK_NOTIFICATIONS;
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(MOCK_NOTIFICATIONS));
      return MOCK_NOTIFICATIONS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(MOCK_NOTIFICATIONS));
      return MOCK_NOTIFICATIONS;
    }
    return parsed;
  } catch {
    return MOCK_NOTIFICATIONS;
  }
}

export function saveStoredNotifications(notifs: AppNotification[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifs));
    window.dispatchEvent(new CustomEvent("notifications_updated", { detail: notifs }));
  } catch (e) {
    console.error("Failed to save notifications", e);
  }
}

export function markNotificationAsRead(id: string): AppNotification[] {
  const current = getStoredNotifications();
  const updated = current.map((n) => (n.id === id ? { ...n, read: true } : n));
  saveStoredNotifications(updated);
  return updated;
}

export function markAllNotificationsAsRead(): AppNotification[] {
  const current = getStoredNotifications();
  const updated = current.map((n) => ({ ...n, read: true }));
  saveStoredNotifications(updated);
  return updated;
}

