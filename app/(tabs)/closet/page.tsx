import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getClothingItems } from "@/lib/queries/clothing-items";
import { ClosetList } from "@/app/(tabs)/closet/closet-list";

export default async function ClosetPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data) {
    redirect("/auth/login");
  }

  const items = await getClothingItems(data.claims.sub);

  return (
    <div className="p-4">
      <h1 className="mb-4 text-xl font-semibold font-point">옷장</h1>
      <ClosetList items={items} />
    </div>
  );
}
