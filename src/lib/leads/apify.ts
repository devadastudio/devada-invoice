import { sanitizeWhatsAppNumber } from "@/lib/utils";

export interface ApifySearchParams {
  query: string;
  city: string;
  maxResults?: number;
}

export interface ApifyRunResponse {
  id: string;
  actId: string;
  status: "READY" | "RUNNING" | "SUCCEEDED" | "FAILED" | "TIMED-OUT" | "ABORTED";
  defaultDatasetId: string;
}

export interface NormalizedPlace {
  placeId: string;
  name: string;
  category?: string;
  address?: string;
  city?: string;
  phone?: string;
  website?: string;
  rating?: number;
  reviewsCount?: number;
  mapsUrl?: string;
}

const APIFY_API_URL = "https://api.apify.com/v2";
const ACTOR_ID = "compass~crawler-google-places";

/**
 * Lance un run asynchrone du crawler Google Maps sur Apify
 */
export async function startGoogleMapsRun(params: ApifySearchParams): Promise<{
  runId: string;
  datasetId: string;
  isSimulated?: boolean;
}> {
  const token = process.env.APIFY_TOKEN?.trim();

  // Mode de secours simulé si aucun token Apify n'est configuré
  if (!token) {
    console.warn("[Apify] Aucun APIFY_TOKEN configuré, bascule en mode simulation.");
    const simulatedRunId = "sim_run_" + Date.now();
    const simulatedDatasetId = "sim_ds_" + Date.now();
    return { runId: simulatedRunId, datasetId: simulatedDatasetId, isSimulated: true };
  }

  const endpoint = `${APIFY_API_URL}/acts/${ACTOR_ID}/runs`;
  const body = {
    searchStringsArray: [params.query],
    locationQuery: `${params.city}, Sénégal`,
    maxCrawledPlacesPerSearch: Math.min(Math.max(params.maxResults || 50, 5), 100),
    language: "fr",
    skipClosedPlaces: true,
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[Apify] Erreur startGoogleMapsRun:", response.status, errorText);
    throw new Error(`Erreur Apify (${response.status}): ${errorText || "Échec du démarrage de la recherche"}`);
  }

  const data = await response.json();
  const run: ApifyRunResponse = data.data;

  return {
    runId: run.id,
    datasetId: run.defaultDatasetId,
    isSimulated: false,
  };
}

/**
 * Récupère le statut actuel d'un run Apify
 */
export async function getRun(runId: string): Promise<{
  status: "RUNNING" | "SUCCEEDED" | "FAILED";
  datasetId?: string;
  error?: string;
}> {
  // Gestion du mode simulation
  if (runId.startsWith("sim_run_")) {
    return {
      status: "SUCCEEDED",
      datasetId: "sim_dataset_" + runId,
    };
  }

  const token = process.env.APIFY_TOKEN?.trim();
  if (!token) {
    throw new Error("APIFY_TOKEN manquant");
  }

  const endpoint = `${APIFY_API_URL}/actor-runs/${runId}`;
  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[Apify] Erreur getRun:", response.status, errorText);
    return { status: "FAILED", error: `Erreur statut run (${response.status})` };
  }

  const data = await response.json();
  const run = data.data;

  if (run.status === "SUCCEEDED") {
    return { status: "SUCCEEDED", datasetId: run.defaultDatasetId };
  } else if (run.status === "FAILED" || run.status === "TIMED-OUT" || run.status === "ABORTED") {
    return { status: "FAILED", error: `Le scraping Apify a échoué (${run.status})` };
  }

  return { status: "RUNNING", datasetId: run.defaultDatasetId };
}

/**
 * Récupère et normalise les lieux scrapés depuis le dataset Apify
 */
export async function getPlaces(datasetId: string, cityTarget: string): Promise<NormalizedPlace[]> {
  // Mode simulation réaliste
  if (datasetId.startsWith("sim_dataset_") || datasetId.startsWith("sim_ds_")) {
    return getSimulatedPlaces(cityTarget);
  }

  const token = process.env.APIFY_TOKEN?.trim();
  if (!token) {
    throw new Error("APIFY_TOKEN manquant");
  }

  const endpoint = `${APIFY_API_URL}/datasets/${datasetId}/items?clean=true`;
  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[Apify] Erreur getPlaces:", response.status, errorText);
    throw new Error(`Erreur récupération dataset (${response.status})`);
  }

  const rawItems: any[] = await response.json();

  return rawItems
    .filter((item) => item.title && (item.placeId || item.cid || item.id))
    .map((item) => {
      const placeId = String(item.placeId || item.cid || item.id || `place_${Date.now()}_${Math.random()}`);
      const rawPhone = item.phone || item.phoneUnformatted || item.internationalPhoneNumber || null;
      const cleanPhone = sanitizeWhatsAppNumber(rawPhone) ? rawPhone : rawPhone;

      return {
        placeId,
        name: String(item.title || "Commerce sans nom").trim(),
        category: item.categoryName || item.categories?.[0] || "Entreprise locale",
        address: item.address || item.street || `${cityTarget}, Sénégal`,
        city: item.city || cityTarget,
        phone: cleanPhone || undefined,
        website: item.website || item.urlWebsite || undefined,
        rating: typeof item.totalScore === "number" ? Math.round(item.totalScore * 10) / 10 : undefined,
        reviewsCount: typeof item.reviewsCount === "number" ? item.reviewsCount : 0,
        mapsUrl: item.url || item.locationUrl || undefined,
      };
    });
}

/**
 * Données simulées locales de haute qualité si la clé API n'est pas configurée
 */
function getSimulatedPlaces(city: string): NormalizedPlace[] {
  const c = city || "Dakar";
  return [
    {
      placeId: `ChIJ_${c.toLowerCase()}_restaurant_almadies`,
      name: "Le Jardin Gourmand Dakar",
      category: "Restaurant français & sénégalais",
      address: "Route des Almadies, en face King Fahd Palace",
      city: c,
      phone: "+221 77 540 12 34",
      website: undefined, // Sans site web : opportunité vitrine
      rating: 4.6,
      reviewsCount: 142,
      mapsUrl: "https://maps.google.com/?q=Le+Jardin+Gourmand+Dakar",
    },
    {
      placeId: `ChIJ_${c.toLowerCase()}_pharmacie_point_e`,
      name: "Pharmacie du Point E",
      category: "Pharmacie & Parapharmacie",
      address: "Avenue Cheikh Anta Diop x Rue 10, Point E",
      city: c,
      phone: "+221 33 825 40 10",
      website: "https://pharmacie-pointe.sn",
      rating: 4.2,
      reviewsCount: 58,
      mapsUrl: "https://maps.google.com/?q=Pharmacie+du+Point+E",
    },
    {
      placeId: `ChIJ_${c.toLowerCase()}_sahel_immo`,
      name: "Sahel Prestige Immobilier",
      category: "Agence immobilière",
      address: "Boulevard de la République, Plateau",
      city: c,
      phone: "+221 78 410 88 99",
      website: undefined, // Sans site web
      rating: 4.8,
      reviewsCount: 89,
      mapsUrl: "https://maps.google.com/?q=Sahel+Prestige+Immobilier",
    },
    {
      placeId: `ChIJ_${c.toLowerCase()}_boutique_teranga`,
      name: "Teranga Mode & Accessoires",
      category: "Boutique de vêtements",
      address: "Centre Commercial Sea Plaza, Corniche Ouest",
      city: c,
      phone: "+221 76 650 33 21",
      website: undefined,
      rating: 3.9,
      reviewsCount: 24,
      mapsUrl: "https://maps.google.com/?q=Teranga+Mode",
    },
    {
      placeId: `ChIJ_${c.toLowerCase()}_clinique_madeleine`,
      name: "Clinique Médico-Chirurgicale de l'Est",
      category: "Clinique privée",
      address: "Rue Félix Faure x Avenue Lamine Guèye",
      city: c,
      phone: "+221 33 889 00 12",
      website: "https://clinique-est.sn",
      rating: 4.4,
      reviewsCount: 110,
      mapsUrl: "https://maps.google.com/?q=Clinique+Medico+Chirurgicale",
    },
    {
      placeId: `ChIJ_${c.toLowerCase()}_cafe_dakar`,
      name: "Café de Rome Dakar",
      category: "Café & Pâtisserie",
      address: "Boulevard Djily Mbaye, Plateau",
      city: c,
      phone: "+221 77 910 45 60",
      website: undefined,
      rating: 4.1,
      reviewsCount: 230,
      mapsUrl: "https://maps.google.com/?q=Cafe+de+Rome+Dakar",
    },
    {
      placeId: `ChIJ_${c.toLowerCase()}_optique_dakar`,
      name: "Optique Moderne Vision",
      category: "Opticien",
      address: "Avenue Georges Pompidou, Dakar",
      city: c,
      phone: "+221 77 320 18 90",
      website: undefined,
      rating: 4.7,
      reviewsCount: 45,
      mapsUrl: "https://maps.google.com/?q=Optique+Moderne+Vision",
    },
  ];
}
