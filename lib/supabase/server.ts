import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { cache } from "react";

import type { Database } from "@/lib/supabase/types";

/**
 * Especially important if using Fluid compute: Don't put this client in a
 * global variable. Always create a new client within each function when using
 * it.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have proxy refreshing
            // user sessions.
          }
        },
      },
    },
  );
}

/**
 * 로그인 여부/사용자 클레임 조회를 요청 1건당 1회로 묶는다.
 * getClaims()는 대칭키(HS256) 프로젝트에서 매번 Supabase Auth 서버로 왕복하는데,
 * 같은 요청 안에서 레이아웃·페이지가 각자 호출하면 그만큼 왕복이 중복돼 LCP가 늦어진다.
 * React cache()로 감싸 동일 렌더 패스 내 중복 호출을 한 번의 네트워크 호출로 합친다.
 */
export const getAuthClaims = cache(async () => {
  const supabase = await createClient();
  return supabase.auth.getClaims();
});
