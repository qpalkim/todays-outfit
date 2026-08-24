import { notFound, redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import {
  getClothingItemById,
  getOutfitCountUsingItem,
} from "@/lib/queries/clothing-items";
import { updateClothingItem } from "@/app/closet/actions";
import { ClothingItemForm } from "@/app/closet/clothing-item-form";
import { DeleteItemDialog } from "@/app/closet/[id]/delete-item-dialog";

export default async function EditClothingItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data) {
    redirect("/auth/login");
  }

  const item = await getClothingItemById(id, data.claims.sub);

  if (!item) {
    notFound();
  }

  const connectedOutfitCount = await getOutfitCountUsingItem(
    id,
    data.claims.sub,
  );

  return (
    <div className="flex flex-col gap-6">
      <h1 className="p-4 pb-0 text-xl font-semibold font-point">옷 아이템 수정</h1>
      <ClothingItemForm
        mode="edit"
        userId={data.claims.sub}
        initialValues={item}
        onSubmitAction={updateClothingItem.bind(null, id)}
      />
      <div className="px-4 pb-4">
        <DeleteItemDialog
          itemId={id}
          photoUrl={item.photo_url}
          connectedOutfitCount={connectedOutfitCount}
        />
      </div>
    </div>
  );
}
