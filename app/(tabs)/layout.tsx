import { Suspense } from "react";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

async function AuthGuard({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return <>{children}</>;
}

export default function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <main className="flex-1 overflow-y-auto pb-16">
        <Suspense>
          <AuthGuard>{children}</AuthGuard>
        </Suspense>
      </main>
      {/* Task 007에서 components/layout/bottom-tab-bar.tsx로 교체 예정 */}
      <nav className="fixed inset-x-0 bottom-0 h-16 border-t bg-background" />
    </div>
  );
}
