import { Suspense } from "react";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getOutfitByDate, getOutfitDatesInMonth } from "@/lib/queries/outfits";
import { getTodayInKst } from "@/lib/utils/date";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";
import { CalendarView } from "@/app/(tabs)/calendar/calendar-view";
import { CloseDetailButton } from "@/app/(tabs)/calendar/close-detail-button";
import { OutfitDetailBody } from "@/app/outfits/outfit-detail-body";

async function CalendarData({
  userId,
  year,
  month,
  selectedDate,
}: {
  userId: string;
  year: number;
  month: number;
  selectedDate?: string;
}) {
  const markedDates = await getOutfitDatesInMonth(userId, year, month);

  return (
    <CalendarView
      year={year}
      month={month}
      markedDates={markedDates}
      selectedDate={selectedDate}
    />
  );
}

async function InlineOutfitDetail({
  userId,
  date,
}: {
  userId: string;
  date: string;
}) {
  const outfit = await getOutfitByDate(userId, date);

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-md">
      <div className="mb-3 flex items-center justify-end">
        <CloseDetailButton />
      </div>
      <div className="flex flex-col gap-4">
        <OutfitDetailBody outfit={outfit} date={date} />
      </div>
    </div>
  );
}

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string; date?: string }>;
}) {
  const { year: yearParam, month: monthParam, date } = await searchParams;

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
      <h1 className="text-xl font-semibold font-point">캘린더</h1>
      <Suspense
        key={`${year}-${month}`}
        fallback={<LoadingSkeleton variant="calendar" />}
      >
        <CalendarData
          userId={data.claims.sub}
          year={year}
          month={month}
          selectedDate={date}
        />
      </Suspense>
      {date && (
        <Suspense key={date} fallback={<LoadingSkeleton variant="card" />}>
          <InlineOutfitDetail userId={data.claims.sub} date={date} />
        </Suspense>
      )}
    </div>
  );
}
