import { Suspense } from "react";

import { createClient } from "@/lib/supabase/server";
import { BottomTabBar } from "@/components/layout/bottom-tab-bar";

/** 하단 탭바가 비로그인 상태에서 다른 탭 클릭 시 로그인으로 보낼 수 있도록 인증 여부를 조회해 전달한다 */
async function AuthAwareTabBar() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const isAuthenticated = !error && !!data?.claims;

  return <BottomTabBar isAuthenticated={isAuthenticated} />;
}

/**
 * 탭 그룹 공용 레이아웃 — 홈("/")은 비로그인 접근을 허용하므로 여기서 강제 리다이렉트하지 않는다.
 * 옷장/캘린더/통계/마이 등 나머지 탭은 각 페이지가 자체적으로 로그인 여부를 검사해 리다이렉트하며,
 * 미들웨어(lib/supabase/proxy.ts)도 "/" 외 경로는 비로그인 접근을 차단한다.
 * children과 탭바 각각을 Suspense로 감싸 쿠키 기반 동적 조회가 프리렌더링을 막지 않게 한다.
 */
export default function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <main className="flex-1 overflow-y-auto pb-[calc(4rem+env(safe-area-inset-bottom))]">
        <Suspense>{children}</Suspense>
      </main>
      <Suspense fallback={<BottomTabBar isAuthenticated={false} />}>
        <AuthAwareTabBar />
      </Suspense>
    </div>
  );
}
