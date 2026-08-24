import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getOutfitByDate } from "@/lib/queries/outfits";
import { getClothingItems } from "@/lib/queries/clothing-items";
import { getTodayInKst } from "@/lib/utils/date";
import { OutfitForm } from "@/app/outfits/new/outfit-form";

export default async function NewOutfitPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; from?: string }>;
}) {
  const { date, from } = await searchParams;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data) {
    redirect("/auth/login");
  }

  const recordDate = date ?? getTodayInKst();

  const [existingOutfit, clothingItems] = await Promise.all([
    getOutfitByDate(data.claims.sub, recordDate),
    getClothingItems(data.claims.sub),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="p-4 pb-0 text-xl font-semibold font-point">
        {existingOutfit ? "오늘의 착장 수정" : "오늘의 착장 기록"}
      </h1>
      <OutfitForm
        userId={data.claims.sub}
        recordDate={recordDate}
        clothingItems={clothingItems}
        existingOutfit={existingOutfit}
        returnTo={from === "calendar" ? "calendar" : "home"}
      />
    </div>
  );
}
