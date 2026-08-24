"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";

/** 캘린더 인라인 상세를 닫는다 — year/month는 유지하고 date만 URL에서 제거한다 */
export function CloseDetailButton() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleClose() {
    const params = new URLSearchParams(searchParams);
    params.delete("date");
    router.push(`/calendar?${params.toString()}`);
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label="닫기"
      onClick={handleClose}
    >
      <X className="size-4" strokeWidth={1.5} />
    </Button>
  );
}
