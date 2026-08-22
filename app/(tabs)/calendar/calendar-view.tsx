"use client";

import { useRouter } from "next/navigation";
import { ko } from "react-day-picker/locale";

import { Calendar } from "@/components/ui/calendar";

interface CalendarViewProps {
  /** 1~12월 */
  year: number;
  month: number;
  /** 해당 월에 기록이 존재하는 record_date('YYYY-MM-DD') 목록 */
  markedDates: string[];
  /** 현재 인라인 상세로 열려 있는 날짜('YYYY-MM-DD', 없으면 undefined) */
  selectedDate?: string;
}

/** 월 단위 착장 기록 캘린더 — 기록 날짜에 민트 도트를 표시하고 이동/선택 시 URL을 갱신한다 */
export function CalendarView({
  year,
  month,
  markedDates,
  selectedDate,
}: CalendarViewProps) {
  const router = useRouter();
  const markedDateSet = new Set(markedDates);

  function handleMonthChange(nextMonth: Date) {
    router.push(
      `/calendar?year=${nextMonth.getFullYear()}&month=${nextMonth.getMonth() + 1}`,
    );
  }

  function handleSelect(date: Date | undefined) {
    const params = new URLSearchParams({ year: String(year), month: String(month) });

    // mode="single"에서 이미 선택된 날짜를 다시 클릭하면 date가 undefined로 전달되며,
    // 이 경우 date 파라미터 없이 push해 인라인 상세를 닫는다.
    if (date) {
      params.set("date", formatDateKey(date));
    }

    router.push(`/calendar?${params.toString()}`);
  }

  return (
    <Calendar
      mode="single"
      locale={ko}
      month={new Date(year, month - 1, 1)}
      selected={selectedDate ? parseDateKey(selectedDate) : undefined}
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

/** 'YYYY-MM-DD' 문자열을 DayPicker에 전달할 로컬 Date 객체로 되돌린다 */
function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}
