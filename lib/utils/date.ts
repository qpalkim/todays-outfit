const KST_TIME_ZONE = "Asia/Seoul";

/** KST(Asia/Seoul) 기준 오늘 날짜를 'YYYY-MM-DD' 형식으로 반환한다 */
export function getTodayInKst(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: KST_TIME_ZONE }).format(
    new Date(),
  );
}

/** 'YYYY-MM-DD' 형식의 record_date를 한국어 날짜 표기('2026년 8월 20일')로 변환한다 */
export function formatRecordDate(recordDate: string): string {
  const [year, month, day] = recordDate.split("-").map(Number);
  return `${year}년 ${month}월 ${day}일`;
}

/** 주어진 record_date가 KST 기준 오늘인지 판정한다 */
export function isTodayInKst(recordDate: string): boolean {
  return recordDate === getTodayInKst();
}
