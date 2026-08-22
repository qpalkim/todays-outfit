import { Suspense } from "react";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getOutfitDatesInMonth } from "@/lib/queries/outfits";
import { getTodayInKst } from "@/lib/utils/date";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";
import { CalendarView } from "@/app/(tabs)/calendar/calendar-view";

async function CalendarData({
  userId,
  year,
  month,
}: {
  userId: string;
  year: number;
  month: number;
}) {
  const markedDates = await getOutfitDatesInMonth(userId, year, month);

  return <CalendarView year={year} month={month} markedDates={markedDates} />;
}

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string }>;
}) {
  const { year: yearParam, month: monthParam } = await searchParams;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data) {
    redirect("/auth/login");
  }

  const [todayYear, todayMonth] = getTodayInKst().split("-").map(Number);
  const year = yearParam ? Number(yearParam) : todayYear;
  const month = monthParam ? Number(monthParam) : todayMonth;

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-xl font-semibold">캘린더</h1>
      <Suspense
        key={`${year}-${month}`}
        fallback={<LoadingSkeleton variant="calendar" />}
      >
        <CalendarData userId={data.claims.sub} year={year} month={month} />
      </Suspense>
    </div>
  );
}
