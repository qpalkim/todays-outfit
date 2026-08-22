/** 에러 객체에서 Postgres 에러 코드를 추출한다(코드가 없으면 null) */
function getPostgresErrorCode(error: unknown): string | null {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code: unknown }).code === "string"
  ) {
    return (error as { code: string }).code;
  }
  return null;
}

/** Supabase/Postgres 에러를 사용자에게 노출할 한국어 메시지로 변환한다 */
export function mapSupabaseErrorToMessage(error: unknown): string {
  const code = getPostgresErrorCode(error);

  switch (code) {
    case "23505": // unique_violation
      return "이미 등록된 정보입니다";
    case "23503": // foreign_key_violation
      return "연결된 데이터를 찾을 수 없습니다";
    case "23514": // check_violation
      return "입력값이 조건을 만족하지 않습니다";
    case "42501": // insufficient_privilege (RLS 위반 포함)
      return "접근 권한이 없습니다";
    case "23502": // not_null_violation
      return "필수 입력값이 누락되었습니다";
    case "22P02": // invalid_text_representation (잘못된 형식의 id/날짜 등)
      return "요청 값의 형식이 올바르지 않습니다";
    default:
      return "요청을 처리하지 못했습니다. 잠시 후 다시 시도해주세요";
  }
}
