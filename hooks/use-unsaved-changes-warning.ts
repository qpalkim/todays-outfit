"use client";

import { useEffect } from "react";

/**
 * 폼이 수정된 상태에서 탭을 닫거나 새로고침하면 브라우저 기본 이탈 확인 다이얼로그를 띄운다.
 * Next.js App Router는 클라이언트 사이드 라우팅(Link 이동)을 가로채는 공식 API를 제공하지
 * 않아, 이 훅은 실제 브라우저 탐색(탭 닫기/새로고침/주소 직접 이동)만을 대상으로 한다.
 */
export function useUnsavedChangesWarning(shouldWarn: boolean) {
  useEffect(() => {
    if (!shouldWarn) {
      return;
    }

    function handleBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [shouldWarn]);
}
