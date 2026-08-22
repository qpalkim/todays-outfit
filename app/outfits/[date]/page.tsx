import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getOutfitByDate } from "@/lib/queries/outfits";
import { formatRecordDate } from "@/lib/utils/date";
import { OutfitDetailBody } from "@/app/outfits/outfit-detail-body";
import { OutfitDetailHeader } from "@/app/outfits/[date]/back-header";

export default async function OutfitDetailPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data) {
    redirect("/auth/login");
  }

  const outfit = await getOutfitByDate(data.claims.sub, date);

  return (
    <div className="flex flex-col gap-4">
      <OutfitDetailHeader title={formatRecordDate(date)} />

      <div className="flex flex-col gap-4 p-4 pt-0">
        <OutfitDetailBody outfit={outfit} date={date} />
      </div>
    </div>
  );
}
