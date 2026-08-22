"use client";

import { useRouter } from "next/navigation";

import { Calendar } from "@/components/ui/calendar";

interface CalendarViewProps {
  /** 1~12월 */
  year: number;
  month: number;
  /** 해당 월에 기록이 존재하는 record_date('YYYY-MM-DD') 목록 */
  markedDates: string[];
}

/** 월 단위 착장 기록 캘린더 — 기록 날짜에 민트 도트를 표시하고 이동/선택 시 URL을 갱신한다 */
export function CalendarView({ year, month, markedDates }: CalendarViewProps) {
  const router = useRouter();
  const markedDateSet = new Set(markedDates);

  function handleMonthChange(nextMonth: Date) {
    router.push(
      `/calendar?year=${nextMonth.getFullYear()}&month=${nextMonth.getMonth() + 1}`,
    );
  }

  function handleSelect(date: Date | undefined) {
    if (!date) {
      return;
    }
    router.push(`/outfits/${formatDateKey(date)}`);
  }

  return (
    <Calendar
      mode="single"
      month={new Date(year, month - 1, 1)}
      onMonthChange={handleMonthChange}
      onSelect={handleSelect}
      modifiers={{
        recorded: (date) => markedDateSet.has(formatDateKey(date)),
      }}
      modifiersClassNames={{
        recorded:
          "after:absolute after:bottom-1 after:left-1/2 after:size-1.5 after:-translate-x-1/2 after:rounded-full after:bg-primary",
      }}
      className="mx-auto w-full"
    />
  );
}

/** DayPicker의 로컬 Date 객체를 화면에 표시된 연/월/일 그대로 'YYYY-MM-DD'로 변환한다 */
function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
