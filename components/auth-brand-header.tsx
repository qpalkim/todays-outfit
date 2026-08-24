import Link from "next/link";

import { Mascot } from "@/components/common/mascot";

/** 로그인/회원가입 등 인증 화면 상단에 공통으로 쓰는 브랜드 헤더 — 마스코트(클릭 시 홈으로 이동)와 서비스 이름을 보여준다 */
export function AuthBrandHeader() {
  return (
    <div className="mb-6 flex flex-col items-center gap-2 text-center">
      <Link href="/" aria-label="홈으로 이동">
        <Mascot size={80} />
      </Link>
      <p className="text-lg font-semibold font-point">오늘 뭐 입었지?</p>
    </div>
  );
}
