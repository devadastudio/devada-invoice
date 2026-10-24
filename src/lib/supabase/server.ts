import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "@/types/database.types";

/**
 * Client Supabase côté serveur (Server Components, Server Actions & Route Handlers)
 * Lit et met à jour les cookies de session
 */
export function createClient() {
  const cookieStore = cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createServerClient<Database>(supabaseUrl, supabaseKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // Appel depuis un Server Component sans capacité d'écriture de cookie,
          // pris en charge par le middleware de rafraîchissement.
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options, maxAge: 0 });
        } catch {
          // Appel depuis un Server Component sans capacité d'écriture de cookie,
          // pris en charge par le middleware de rafraîchissement.
        }
      },
    },
  });
}
