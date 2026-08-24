import { redirect } from "next/navigation";

import { getAuthClaims } from "@/lib/supabase/server";
import { getOutfitCount } from "@/lib/queries/outfits";
import { getClothingItemCount } from "@/lib/queries/clothing-items";
import { LogoutButton } from "@/components/logout-button";
import packageJson from "@/package.json";

const SIGN_UP_PROVIDER_LABELS: Record<string, string> = {
  email: "이메일 계정",
  google: "구글 계정",
};

const APP_VERSION = packageJson.version;

export default async function MyPage() {
  const { data, error } = await getAuthClaims();

  if (error || !data) {
    redirect("/auth/login");
  }

  const { claims } = data;

  const [outfitCount, clothingItemCount] = await Promise.all([
    getOutfitCount(claims.sub),
    getClothingItemCount(claims.sub),
  ]);

  const provider = claims.app_metadata?.provider;
  const providerLabel = provider
    ? (SIGN_UP_PROVIDER_LABELS[provider] ?? provider)
    : "알 수 없음";

  return (
    <div className="flex flex-col gap-6 p-4">
      <h1 className="text-xl font-semibold font-point">마이</h1>

      <div className="flex flex-col gap-1 rounded-2xl border border-border/60 bg-card p-4 shadow-md">
        <p className="truncate text-sm font-medium">
          {claims.email ?? "이메일 정보 없음"}
        </p>
        <p className="text-sm text-muted-foreground">
          {providerLabel}으로 가입
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-md">
          <p className="text-2xl font-semibold font-point">{outfitCount}</p>
          <p className="text-sm text-muted-foreground">총 기록 일수</p>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-md">
          <p className="text-2xl font-semibold font-point">{clothingItemCount}</p>
          <p className="text-sm text-muted-foreground">등록 아이템 수</p>
        </div>
      </div>

      <LogoutButton />

      <div className="flex flex-col gap-1 rounded-2xl border border-border/60 bg-card p-4 text-sm text-muted-foreground">
        <p>오늘 뭐 입었지? v{APP_VERSION}</p>
        <p>문의: qpalkim.dev@gmail.com</p>
      </div>
    </div>
  );
}
