import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { getClothingItems } from "@/lib/queries/clothing-items";
import { ClosetList } from "@/app/(tabs)/closet/closet-list";
import { Button } from "@/components/ui/button";

export default async function ClosetPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data) {
    redirect("/auth/login");
  }

  const items = await getClothingItems(data.claims.sub);

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold font-point">옷장</h1>
        {items.length > 0 && (
          <Button asChild size="sm" variant="outline">
            <Link href="/closet/new">
              <Plus className="size-4" strokeWidth={1.5} />
              추가
            </Link>
          </Button>
        )}
      </div>
      <ClosetList items={items} />
    </div>
  );
}
