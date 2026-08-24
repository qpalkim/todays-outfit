import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Mascot } from "@/components/common/mascot";

/** 전역 404 — 매칭되는 라우트가 전혀 없을 때의 최종 폴백 */
export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center gap-3 px-4 text-center">
      <Mascot size={96} />
      <p className="text-sm font-medium">페이지를 찾을 수 없어요</p>
      <p className="text-sm text-muted-foreground">
        주소가 잘못되었거나 삭제된 페이지예요
      </p>
      <Button asChild>
        <Link href="/">홈으로 돌아가기</Link>
      </Button>
    </div>
  );
}
