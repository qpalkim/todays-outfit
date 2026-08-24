import { Suspense } from "react";
import { redirect } from "next/navigation";

import { getAuthClaims } from "@/lib/supabase/server";

async function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data, error } = await getAuthClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return <>{children}</>;
}

export default function ClosetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense>
      <AuthGuard>{children}</AuthGuard>
    </Suspense>
  );
}
