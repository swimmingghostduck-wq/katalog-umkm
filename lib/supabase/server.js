import { createClient } from "@supabase/supabase-js";
import { createServerClient as createSsrServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function getBaseUrl(url) {
  if (!url) return "";
  try {
    return new URL(url).origin;
  } catch {
    return url.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
  }
}

/**
 * Membuat koneksi Supabase di sisi server menggunakan SUPABASE_SECRET_KEY.
 * Digunakan untuk membaca data publik (katalog dan detail produk) di server.
 */
export function createServerClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    throw new Error(
      "SUPABASE_URL dan SUPABASE_SECRET_KEY belum diatur di environment variable."
    );
  }

  return createClient(getBaseUrl(supabaseUrl), supabaseSecretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Membuat koneksi sesi admin menggunakan SUPABASE_PUBLISHABLE_KEY dan cookie (@supabase/ssr).
 * Digunakan untuk login, logout, ganti password, dan aksi manajemen data produk.
 */
export async function createSessionClient() {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.SUPABASE_URL;
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !publishableKey) {
    throw new Error(
      "SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY belum diatur di environment variable."
    );
  }

  return createSsrServerClient(getBaseUrl(supabaseUrl), publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Method setAll dipanggil dari Server Component; abaikan jika ada proxy/middleware.
        }
      },
    },
  });
}

export { createServerClient as createClient };
export { createSessionClient as createAdminClient };
export { createSessionClient as createAuthClient };
