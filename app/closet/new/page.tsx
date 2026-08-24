import { redirect } from "next/navigation";

import { getAuthClaims } from "@/lib/supabase/server";
import { createClothingItem } from "@/app/closet/actions";
import { ClothingItemForm } from "@/app/closet/clothing-item-form";

export default async function NewClothingItemPage() {
  const { data, error } = await getAuthClaims();

  if (error || !data) {
    redirect("/auth/login");
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="p-4 pb-0 text-xl font-semibold font-point">옷 아이템 등록</h1>
      <ClothingItemForm
        mode="create"
        userId={data.claims.sub}
        onSubmitAction={createClothingItem}
      />
    </div>
  );
}
